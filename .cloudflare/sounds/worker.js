import page from './index.html';
import styles from './styles.css';
import client from './client.js';
import licenses from './ICONS-LICENSE.txt';
import { validOrder, readOrder, writeOrder } from './order.js';
export { SoundOrder } from './order.js';
import { DriveError, folderFor, metadata as driveMetadata, list as driveList, media as driveMedia } from './drive.js';

const ROOT = '/sounds';
const COOKIE = '__Secure-sunny-sounds';
const AGE = 8 * 60 * 60;
const encoder = new TextEncoder();
const categories = [{ id: 'bgm', name: 'BGM' }, { id: 'sound-effect', name: 'Sound Effect' }];
const apps = [
  ['subway-master', 'Subway Master'], ['sky-peacemaker', 'Sky Peacemaker'],
  ['led-pop', 'LED POP'], ['simply-multi-timer', 'Simply Multi Timer'],
  ['world-movie-trailer', 'World Movie Trailer'], ['world-book-ranking', 'World Book Ranking'],
  ['scanatory', 'Scanatory'], ['watermelon-checker', 'Watermelon Checker'],
  ['histree', 'Histree'], ['wisdom-qclock', 'Wisdom Qclock'],
  ['dual-flashlight', 'Dual Flashlight'], ['play-memo', 'Play Memo'],
  ['decibella-2', 'decibella 2'], ['decibella', 'decibella'], ['find-four', 'Find Four']
].map(([id, name]) => ({ id, name }));
const types = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', aac: 'audio/aac', flac: 'audio/flac', webm: 'audio/webm' };

function response(body, status = 200, headers = {}) {
  return new Response(body, { status, headers: {
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    ...headers
  } });
}

function json(value, status = 200, headers = {}) {
  return response(JSON.stringify(value), status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
}

function base64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function bytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Invalid encoding');
  return Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), c => c.charCodeAt(0));
}

async function signingKey(secret) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function authenticated(request, env) {
  const cookie = (request.headers.get('Cookie') || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`));
  if (!cookie) return false;
  try {
    const [expires, nonce, signature, extra] = cookie.slice(COOKIE.length + 1).split('.');
    const now = Math.floor(Date.now() / 1000);
    if (extra || !/^\d+$/.test(expires) || Number(expires) <= now || Number(expires) > now + AGE || !/^[\w-]{22}$/.test(nonce)) return false;
    return await crypto.subtle.verify('HMAC', await signingKey(env.SESSION_SECRET), bytes(signature), encoder.encode(`${expires}.${nonce}`));
  } catch { return false; }
}

async function passwordMatches(password, verifier) {
  const [iterations, salt, hash, extra] = verifier.split(':');
  if (extra || iterations !== '100000' || !salt || !hash) throw new Error('Invalid password verifier');
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes(salt), iterations: 100000 }, material, 256));
  const expected = bytes(hash);
  let difference = derived.length ^ expected.length;
  for (let i = 0; i < derived.length; i++) difference |= derived[i] ^ expected[i];
  return difference === 0;
}

function cookie(value, age) {
  return `${COOKIE}=${value}; Path=/sounds; Max-Age=${age}; Secure; HttpOnly; SameSite=Strict`;
}

function soundKey(url) {
  const key = url.searchParams.get('key');
  // eslint-disable-next-line no-control-regex -- Reject control bytes in untrusted audio keys.
  if (!key || key.length > 1024 || /[\x00-\x1f\x7f\\]/.test(key)) return null;
  const parts = key.split('/');
  if (parts.length !== 3 || !categories.some(c => c.id === parts[0]) || !apps.some(a => a.id === parts[1]) || !parts[2] || parts[2] === '.' || parts[2] === '..') return null;
  return /^[A-Za-z0-9_-]+$/.test(parts[2]) ? { id: parts[2], category: parts[0], app: parts[1] } : null;
}

function audioType(file) {
  return types[file.name?.split('.').pop().toLowerCase()] &&
    file.mimeType !== 'application/vnd.google-apps.shortcut' &&
    file.mimeType !== 'application/vnd.google-apps.folder'
    ? types[file.name.split('.').pop().toLowerCase()] : null;
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== ROOT && !url.pathname.startsWith(`${ROOT}/`)) return response(null, 404);
  if (!['GET', 'HEAD', 'POST'].includes(request.method)) return response(null, 405, { Allow: 'GET, HEAD, POST' });
  if (request.method === 'POST' && request.headers.get('Origin') !== url.origin) return json({ error: 'origin' }, 403);
  if (!env.PASSWORD_VERIFIER || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32 || !env.LOGIN_LIMITER || !env.GOOGLE_SERVICE_ACCOUNT || !env.DRIVE_FOLDERS) return json({ error: 'configuration' }, 503);

  if (request.method === 'POST' && url.pathname === `${ROOT}/api/order`) {
    if (!await authenticated(request, env)) return json({ error: 'authentication' }, 401);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'format' }, 415);
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'format' }, 400);
    const chunks = [];
    let length = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 96 * 1024) { await reader.cancel(); return json({ error: 'size' }, 413); }
      chunks.push(value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    let input;
    try { input = JSON.parse(new TextDecoder().decode(body)); } catch { return json({ error: 'format' }, 400); }
    if (!categories.some(c => c.id === input?.category) || !apps.some(a => a.id === input?.app)) return json({ error: 'selection' }, 400);
    const scope = `${input.category}/${input.app}`;
    if (!folderFor(env, input.category, input.app) || !validOrder(input, scope)) return json({ error: 'order_format' }, 400);
    const result = await writeOrder(env, scope, { keys: input.keys, version: input.version });
    return json(await result.json(), result.status);
  }

  if (request.method === 'POST') {
    if (url.pathname === `${ROOT}/api/logout`) return json({}, 200, { 'Set-Cookie': cookie('', 0) });
    if (url.pathname !== `${ROOT}/api/login`) return response(null, 404);
    const limit = await env.LOGIN_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' });
    if (!limit.success) return json({ error: 'rate_limit' }, 429, { 'Retry-After': '60' });
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'format' }, 415);
    // Bound streamed input too: Content-Length alone is not authoritative.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'format' }, 400);
    let text = '';
    let length = 0;
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 1024) { await reader.cancel(); return json({ error: 'size' }, 413); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    let input;
    try { input = JSON.parse(text); } catch { return json({ error: 'format' }, 400); }
    if (typeof input?.password !== 'string' || !await passwordMatches(input.password, env.PASSWORD_VERIFIER)) return json({ error: 'password' }, 401);
    const payload = `${Math.floor(Date.now() / 1000) + AGE}.${base64(crypto.getRandomValues(new Uint8Array(16)))}`;
    const signature = base64(await crypto.subtle.sign('HMAC', await signingKey(env.SESSION_SECRET), encoder.encode(payload)));
    return json({}, 200, { 'Set-Cookie': cookie(`${payload}.${signature}`, AGE) });
  }

  if ([ROOT, `${ROOT}/`].includes(url.pathname)) return response(request.method === 'HEAD' ? null : page, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  if (url.pathname === `${ROOT}/styles.css`) return response(request.method === 'HEAD' ? null : styles, 200, { 'Content-Type': 'text/css; charset=utf-8' });
  if (url.pathname === `${ROOT}/client.js`) return response(request.method === 'HEAD' ? null : client, 200, { 'Content-Type': 'text/javascript; charset=utf-8' });
  if (url.pathname === `${ROOT}/licenses.txt`) return response(request.method === 'HEAD' ? null : licenses, 200, { 'Content-Type': 'text/plain; charset=utf-8' });
  if (!await authenticated(request, env)) return json({ error: 'authentication' }, 401);
  if (url.pathname === `${ROOT}/api/session`) return json({ categories, apps });
  if (url.pathname === `${ROOT}/api/files`) {
    const category = url.searchParams.get('category');
    const app = url.searchParams.get('app');
    if (!categories.some(c => c.id === category) || !apps.some(a => a.id === app)) return json({ error: 'selection' }, 400);
    const folder = folderFor(env, category, app);
    if (!folder) return json({ files: [], cursor: null, order: { keys: [], version: 0 } });
    const cursor = url.searchParams.get('cursor');
    const [result, order] = await Promise.all([
      driveList(env, folder, cursor), readOrder(env, `${category}/${app}`)
    ]);
    const files = result.files.filter(audioType).map(file => {
      const size = Number(file.size);
      if (!Number.isSafeInteger(size) || size < 0 || !/^[A-Za-z0-9_-]+$/.test(file.id)) throw new Error('Invalid Drive file metadata');
      return { key: `${category}/${app}/${file.id}`, name: file.name, size };
    });
    return json({ files, cursor: result.nextPageToken || null, order });
  }
  if (url.pathname !== `${ROOT}/api/audio`) return response(null, 404);
  const selected = soundKey(url);
  if (!selected) return response(null, 400);
  const folder = folderFor(env, selected.category, selected.app);
  if (!folder) return response(null, 404);
  const metadata = await driveMetadata(env, selected.id);
  if (!metadata || metadata.trashed || !metadata.parents?.includes(folder) || !audioType(metadata)) return response(null, 404);
  if (!metadata.capabilities?.canDownload) return response(null, 403);
  const size = Number(metadata.size);
  if (!Number.isSafeInteger(size) || size < 0) return response(null, 503);
  const headers = { 'Content-Type': audioType(metadata), 'Accept-Ranges': 'bytes' };
  if (url.searchParams.get('download') === '1') headers['Content-Disposition'] = `attachment; filename="sound.${metadata.name.split('.').pop().replace(/[^a-z0-9]/gi, '')}"; filename*=UTF-8''${encodeURIComponent(metadata.name).replace(/['()*]/g, c => `%${c.charCodeAt(0).toString(16)}`)}`;
  let range;
  const value = request.headers.get('Range');
  if (value) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(value);
    if (!match || (!match[1] && !match[2])) return response(null, 416, { 'Content-Range': `bytes */${size}` });
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) return response(null, 416, { 'Content-Range': `bytes */${size}` });
    range = { offset: start, length: end - start + 1 };
    headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length'] = String(range ? range.length : size);
  if (request.method === 'HEAD') return response(null, range ? 206 : 200, headers);
  const object = await driveMedia(env, selected.id, range ? `bytes=${range.offset}-${range.offset + range.length - 1}` : null);
  if (object.status === 404) return response(null, 404);
  // Never forward a Google redirect, error body, or an unexpected full download as a range.
  if (object.status !== (range ? 206 : 200) || (range && object.headers.get('Content-Range') !== headers['Content-Range']) || object.headers.get('Content-Length') !== headers['Content-Length']) {
    await object.body?.cancel();
    return response(null, 503);
  }
  return response(object.body, range ? 206 : 200, headers);
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); }
    catch (error) {
      if (error instanceof DriveError) return json({ error: error.code, upstreamStatus: error.upstreamStatus }, 503);
      return json({ error: 'unavailable' }, 503);
    }
  }
};
