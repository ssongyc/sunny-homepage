import { importPKCS8, SignJWT } from 'jose';

const API = 'https://www.googleapis.com/drive/v3/files';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ID = /^[A-Za-z0-9_-]+$/;
let cachedToken;
let pendingToken;

export class DriveError extends Error {
  constructor(code, status = 0) {
    super(code);
    this.code = code;
    this.upstreamStatus = status;
  }
}

async function token(env) {
  if (cachedToken?.source === env.GOOGLE_SERVICE_ACCOUNT && cachedToken.expires > Date.now() + 60000) return cachedToken.value;
  if (pendingToken?.source === env.GOOGLE_SERVICE_ACCOUNT) return pendingToken.promise;
  const promise = (async () => {
    const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT);
    if (credentials.type !== 'service_account' || !/^[^@]+@[^@]+\.gserviceaccount\.com$/.test(credentials.client_email)) throw new Error('Invalid service account');
    const key = await importPKCS8(credentials.private_key, 'RS256');
    const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/drive.readonly' })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuer(credentials.client_email).setAudience(TOKEN_URL)
      .setIssuedAt().setExpirationTime('1h').sign(key);
    let result;
    try { result = await fetch(TOKEN_URL, {
      method: 'POST', redirect: 'manual',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
      signal: AbortSignal.timeout(15000)
    }); } catch { throw new DriveError('drive_token_network'); }
    if (!result.ok) throw new DriveError('drive_authentication', result.status);
    const data = await result.json();
    if (typeof data.access_token !== 'string' || !(data.expires_in > 0)) throw new Error('Invalid Drive token');
    cachedToken = { source: env.GOOGLE_SERVICE_ACCOUNT, value: data.access_token, expires: Date.now() + data.expires_in * 1000 };
    return data.access_token;
  })();
  pendingToken = { source: env.GOOGLE_SERVICE_ACCOUNT, promise };
  try { return await promise; }
  finally { if (pendingToken?.promise === promise) pendingToken = null; }
}

export function folderFor(env, category, app) {
  const map = env.DRIVE_FOLDERS;
  if (!map || typeof map !== 'object' || Array.isArray(map)) throw new Error('Invalid Drive folder mapping');
  const folder = map[`${category}/${app}`];
  if (folder === undefined) return null;
  if (typeof folder !== 'string' || !ID.test(folder)) throw new Error('Invalid Drive folder ID');
  return folder;
}

async function get(env, path, params, headers = {}) {
  const url = new URL(`${API}${path}`);
  url.search = new URLSearchParams({ supportsAllDrives: 'true', ...params }).toString();
  const accessToken = await token(env);
  try { return await fetch(url, { headers: { ...headers, Authorization: `Bearer ${accessToken}` }, redirect: 'manual', signal: AbortSignal.timeout(30000) }); }
  catch { throw new DriveError('drive_network'); }
}

export async function metadata(env, id) {
  if (!ID.test(id)) return null;
  const result = await get(env, `/${id}`, { fields: 'id,name,mimeType,size,parents,trashed,capabilities(canDownload)' });
  if (result.status === 404) return null;
  if (!result.ok) throw new DriveError('drive_metadata', result.status);
  return result.json();
}

export async function list(env, folder, cursor) {
  const parent = await metadata(env, folder);
  if (!parent || parent.trashed || parent.mimeType !== 'application/vnd.google-apps.folder') throw new DriveError('drive_folder_unavailable');
  const result = await get(env, '', {
    q: `'${folder}' in parents and trashed = false`,
    fields: 'nextPageToken,incompleteSearch,files(id,name,mimeType,size)',
    pageSize: '200', orderBy: 'name', includeItemsFromAllDrives: 'true',
    ...(cursor ? { pageToken: cursor } : {})
  });
  if (!result.ok) throw new DriveError('drive_listing', result.status);
  const data = await result.json();
  if (data.incompleteSearch || !Array.isArray(data.files)) throw new Error('Incomplete Drive listing');
  return data;
}

export async function media(env, id, range) {
  return get(env, `/${id}`, { alt: 'media' }, range ? { Range: range } : {});
}
