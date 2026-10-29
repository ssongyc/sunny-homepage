'use strict';

const get = id => document.getElementById(id);
const audio = new Audio();
audio.preload = 'none';
let catalog;
let category;
let app;
let cursor;
let requestId = 0;
let playing;
let busy = false;
const REFRESH_INTERVAL = 30000;
const LAST_SELECTION_KEY = 'sunny-sounds.last-selection.v1';
let selectionError = null;
let refreshTimer;
let refreshRequest;
let refreshStopped = false;
let filesLoading = false;
let loadedPages = 0;
let fileOrder = [];
let orderVersion = 0;
let orderSaving = false;
let drag = null;

function stopAutoRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = null;
  if (refreshRequest) {
    refreshRequest.abort();
    refreshRequest = null;
  }
}

function scheduleAutoRefresh() {
  clearTimeout(refreshTimer);
  if (catalog && !document.hidden && !refreshStopped && !filesLoading && !drag && !orderSaving) {
    refreshTimer = setTimeout(refreshFiles, REFRESH_INTERVAL);
  }
}

function error(password = false, message) {
  get('error').textContent = message || (password ? '비밀번호가 올바르지 않습니다.' : '연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
  get('error').hidden = false;
}

function clearError() { get('error').hidden = true; }

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#icon-${name}`);
  svg.append(use);
  return svg;
}

function resetPlay() {
  if (!playing) return;
  playing.replaceChildren(icon('play'));
  playing.setAttribute('aria-pressed', 'false');
  playing.setAttribute('aria-label', `재생: ${playing.dataset.name}`);
  playing = null;
}

function stopPlayback() { audio.pause(); audio.removeAttribute('src'); audio.load(); resetPlay(); }

function showLogin() {
  finishDrag(true);
  requestId++;
  stopAutoRefresh();
  filesLoading = false;
  loadedPages = 0;
  stopPlayback();
  get('library').hidden = true;
  get('logout').hidden = true;
  get('login').hidden = false;
  get('files').replaceChildren();
  catalog = null;
  get('password').focus();
}

async function api(path, options) {
  const result = await fetch(`/sounds/api/${path}`, { credentials: 'same-origin', cache: 'no-store', ...options });
  if (result.status === 401 && !path.startsWith('login')) showLogin();
  if (!result.ok) { const failure = new Error('Request failed'); failure.status = result.status; throw failure; }
  return result.json();
}

function tabs(target, items, selected, choose) {
  get(target).replaceChildren(...items.map(item => {
    const button = document.createElement('button');
    button.textContent = item.name;
    button.setAttribute('aria-pressed', String(item.id === selected));
    button.addEventListener('click', () => choose(item.id));
    return button;
  }));
}

function rememberSelection() {
  if (!category || !app) return;
  try {
    localStorage.setItem(LAST_SELECTION_KEY, JSON.stringify({ category, app }));
    selectionError = null;
  } catch (failure) {
    console.error('[Sounds] Last selection could not be saved:', failure);
    selectionError = '마지막 방문 위치를 저장하지 못했습니다.';
  }
}

function selectionChanged() {
  rememberSelection();
  navigation();
  if (category && app) void loadFiles();
}

function navigation() {
  const scroll = get('apps').scrollLeft;
  tabs('categories', catalog.categories, category, value => { if (value !== category) { category = value; selectionChanged(); } });
  tabs('apps', catalog.apps, app, value => { if (value !== app) { app = value; selectionChanged(); } });
  get('apps').scrollLeft = scroll;
  get('selection').textContent = catalog.apps.find(item => item.id === app)?.name ?? '';
}

function fileRow(file) {
  const row = document.createElement('div');
  row.className = 'file';
  row.dataset.key = file.key;
  const label = document.createElement('div');
  label.className = 'filename';
  label.textContent = file.name;
  const size = document.createElement('small');
  size.textContent = fileSize(file.size);
  label.append(size);
  const play = document.createElement('button');
  play.className = 'play';
  play.dataset.name = file.name;
  play.setAttribute('aria-label', `재생: ${file.name}`);
  play.setAttribute('aria-pressed', 'false');
  play.append(icon('play'));
  const url = `/sounds/api/audio?key=${encodeURIComponent(file.key)}`;
  play.addEventListener('click', async () => {
    clearError();
    if (playing === play) { audio.pause(); resetPlay(); return; }
    stopPlayback();
    playing = play;
    play.replaceChildren(icon('pause'));
    play.setAttribute('aria-pressed', 'true');
    play.setAttribute('aria-label', `일시정지: ${play.dataset.name}`);
    audio.src = url;
    try { await audio.play(); } catch (failure) { if (failure.name !== 'AbortError') { resetPlay(); error(); } }
  });
  const download = document.createElement('a');
  download.className = 'download';
  download.href = `${url}&download=1`;
  download.setAttribute('aria-label', `다운로드: ${file.name}`);
  download.download = file.name;
  download.append(icon('download'));
  const handle = document.createElement('button');
  handle.className = 'reorder';
  handle.type = 'button';
  handle.setAttribute('aria-label', `순서 변경: ${file.name}`);
  handle.title = '드래그 또는 위/아래 방향키로 순서 변경';
  handle.append(icon('grip'));
  handle.addEventListener('pointerdown', event => beginDrag(event, row, handle));
  handle.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drag?.handle === handle) { finishDrag(true); return; }
    if (!['ArrowUp', 'ArrowDown'].includes(event.key) || filesLoading || orderSaving || drag) return;
    event.preventDefault();
    const neighbor = event.key === 'ArrowUp' ? row.previousElementSibling : row.nextElementSibling;
    if (!neighbor) return;
    const before = Array.from(get('files').children);
    get('files').insertBefore(row, event.key === 'ArrowUp' ? neighbor : neighbor.nextElementSibling);
    handle.focus({ preventScroll: true });
    row.scrollIntoView({ block: 'nearest' });
    void saveOrder(before);
  });
  row.append(handle, label, play, download);
  return row;
}

function beginDrag(event, row, handle) {
  if (!event.isPrimary || event.button !== 0 || filesLoading || orderSaving || drag) return;
  drag = { row, handle, pointerId: event.pointerId, startY: event.clientY, y: event.clientY,
    active: false, frame: null, before: Array.from(get('files').children) };
  get('files').setPointerCapture(event.pointerId);
}

function moveDraggedRow() {
  if (!drag?.active) return;
  const edge = 64;
  if (drag.y < edge) window.scrollBy(0, -12);
  else if (drag.y > window.innerHeight - edge) window.scrollBy(0, 12);
  const list = get('files');
  const target = Array.from(list.children).find(row => {
    if (row === drag.row) return false;
    const rect = row.getBoundingClientRect();
    return drag.y < rect.top + rect.height / 2;
  });
  if (drag.row.nextElementSibling !== (target || null)) list.insertBefore(drag.row, target || null);
  drag.frame = requestAnimationFrame(moveDraggedRow);
}

function restoreRows(rows) {
  // Move the existing DOM nodes, preserving the current audio button/source.
  get('files').append(...rows);
}

function finishDrag(cancel) {
  if (!drag) return;
  const current = drag;
  drag = null;
  cancelAnimationFrame(current.frame);
  current.row.classList.remove('dragging');
  const list = get('files');
  if (list.hasPointerCapture(current.pointerId)) list.releasePointerCapture(current.pointerId);
  if (cancel) restoreRows(current.before);
  else if (current.active) void saveOrder(current.before);
  scheduleAutoRefresh();
}

function ranked(items, key) {
  const ranks = new Map(fileOrder.map((value, index) => [value, index]));
  return items.slice().sort((a, b) => (ranks.get(key(a)) ?? Number.MAX_SAFE_INTEGER) - (ranks.get(key(b)) ?? Number.MAX_SAFE_INTEGER));
}

async function saveOrder(before) {
  const rows = Array.from(get('files').children);
  if (rows.every((row, index) => row === before[index])) return;
  const visibleKeys = rows.map(row => row.dataset.key);
  const visible = new Set(visibleKeys);
  let index = 0;
  // Keep the relative positions of stored keys outside the loaded page window.
  const keys = fileOrder.map(key => visible.has(key) ? visibleKeys[index++] : key);
  keys.push(...visibleKeys.slice(index));
  const id = requestId;
  orderSaving = true;
  stopAutoRefresh();
  get('files').setAttribute('aria-busy', 'true');
  clearError();
  try {
    const result = await api('order', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, app, keys, version: orderVersion }) });
    if (id !== requestId || !catalog) return;
    fileOrder = result.keys;
    orderVersion = result.version;
  } catch (failure) {
    if (id === requestId && catalog) {
      restoreRows(before);
      refreshStopped = true;
      error(false, failure.status === 409
        ? '다른 기기에서 순서가 변경되었습니다. 새로고침 후 다시 시도해 주세요.'
        : '음원 순서를 저장하지 못했습니다. 새로고침 후 다시 시도해 주세요.');
    }
  } finally {
    orderSaving = false;
    if (id === requestId) get('files').setAttribute('aria-busy', 'false');
    scheduleAutoRefresh();
  }
}

function fileSize(size) {
  return size < 1048576 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1048576).toFixed(1)} MB`;
}

function reconcileFiles(files) {
  const list = get('files');
  const existing = new Map(Array.from(list.children, row => [row.dataset.key, row]));
  ranked(files, file => file.key).forEach((file, index) => {
    let row = existing.get(file.key);
    if (!row) row = fileRow(file);
    else {
      existing.delete(file.key);
      const label = row.querySelector('.filename');
      if (label.firstChild.nodeValue !== file.name) label.firstChild.nodeValue = file.name;
      const size = label.querySelector('small');
      if (size.textContent !== fileSize(file.size)) size.textContent = fileSize(file.size);
      row.querySelector('.reorder').setAttribute('aria-label', `순서 변경: ${file.name}`);
      const play = row.querySelector('.play');
      play.dataset.name = file.name;
      play.setAttribute('aria-label', `${playing === play ? '일시정지' : '재생'}: ${file.name}`);
      const download = row.querySelector('a');
      download.download = file.name;
      download.setAttribute('aria-label', `다운로드: ${file.name}`);
    }
    if (list.children[index] !== row) list.insertBefore(row, list.children[index] || null);
  });
  for (const row of existing.values()) {
    if (playing && row.contains(playing)) stopPlayback();
    row.remove();
  }
  get('count').textContent = String(files.length);
}

async function refreshFiles() {
  if (!catalog || document.hidden || refreshStopped || filesLoading || refreshRequest || drag || orderSaving) return;
  clearTimeout(refreshTimer);
  const id = requestId;
  const controller = new AbortController();
  refreshRequest = controller;
  try {
    const files = [];
    const seen = new Set();
    let next = null;
    let pages = 0;
    let latestOrder;
    // Refresh the already loaded window atomically; preserve live play buttons.
    do {
      const query = new URLSearchParams({ category, app });
      if (next) query.set('cursor', next);
      const result = await api(`files?${query}`, { signal: controller.signal });
      if (id !== requestId || controller.signal.aborted || !catalog) return;
      for (const file of result.files) {
        if (!seen.has(file.key)) { files.push(file); seen.add(file.key); }
      }
      if (pages === 0) latestOrder = result.order;
      next = result.cursor;
      pages++;
    } while (next && pages < Math.max(loadedPages, 1));
    if (document.hidden || drag || orderSaving) return;
    fileOrder = latestOrder.keys;
    orderVersion = latestOrder.version;
    reconcileFiles(files);
    cursor = next;
    loadedPages = pages;
    get('more').hidden = !cursor;
  } catch (failure) {
    if (failure.name !== 'AbortError' && id === requestId && catalog) {
      refreshStopped = true;
      error();
    }
  } finally {
    if (refreshRequest === controller) {
      refreshRequest = null;
      scheduleAutoRefresh();
    }
  }
}

async function loadFiles(append = false) {
  finishDrag(true);
  stopAutoRefresh();
  refreshStopped = false;
  filesLoading = true;
  const id = ++requestId;
  if (!append) { stopPlayback(); cursor = null; loadedPages = 0; get('files').replaceChildren(); get('count').textContent = ''; }
  clearError();
  get('files').setAttribute('aria-busy', 'true');
  get('more').disabled = true;
  get('more').hidden = true;
  try {
    const query = new URLSearchParams({ category, app });
    if (append && cursor) query.set('cursor', cursor);
    const result = await api(`files?${query}`);
    if (id !== requestId || !catalog) return;
    fileOrder = result.order.keys;
    orderVersion = result.order.version;
    const existingKeys = new Set(Array.from(get('files').children, row => row.dataset.key));
    get('files').append(...result.files.filter(file => !existingKeys.has(file.key)).map(fileRow));
    restoreRows(ranked(Array.from(get('files').children), row => row.dataset.key));
    loadedPages++;
    cursor = result.cursor;
    get('more').hidden = !cursor;
    get('count').textContent = String(get('files').children.length);
  } catch { if (id === requestId) { refreshStopped = true; get('more').hidden = !cursor; error(); } }
  finally {
    if (id === requestId) {
      filesLoading = false;
      get('files').setAttribute('aria-busy', 'false');
      get('more').disabled = false;
      if (selectionError && get('error').hidden) error(false, selectionError);
      scheduleAutoRefresh();
    }
  }
}

async function openLibrary() {
  catalog = await api('session');
  category = undefined;
  app = undefined;
  selectionError = null;
  try {
    const saved = localStorage.getItem(LAST_SELECTION_KEY);
    if (saved === null) {
      category = catalog.categories[0].id;
      app = catalog.apps[0].id;
    } else {
      const selection = JSON.parse(saved);
      if (!catalog.categories.some(item => item.id === selection?.category) ||
          !catalog.apps.some(item => item.id === selection?.app)) throw new Error('Invalid saved selection');
      category = selection.category;
      app = selection.app;
    }
  } catch (failure) {
    console.error('[Sounds] Last selection could not be restored:', failure);
    selectionError = '마지막 방문 위치를 불러오지 못했습니다. 카테고리와 앱을 선택해 주세요.';
  }
  get('login').hidden = true;
  get('library').hidden = false;
  get('logout').hidden = false;
  navigation();
  if (category && app) {
    get('apps').querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    await loadFiles();
  } else {
    error(false, selectionError);
  }
}

get('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  busy = true;
  clearError();
  const button = event.submitter;
  button.disabled = true;
  try {
    await api('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: get('password').value }) });
    get('password').value = '';
    await openLibrary();
  } catch (failure) { error(failure.status === 401); }
  finally { busy = false; button.disabled = false; }
});
get('logout').addEventListener('click', async () => {
  try { await api('logout', { method: 'POST' }); clearError(); showLogin(); } catch { error(); }
});
get('refresh').addEventListener('click', () => loadFiles());
get('more').addEventListener('click', () => loadFiles(true));
// Capture on the stable list so moving a row cannot cancel pointer capture.
get('files').addEventListener('pointermove', event => {
  if (!drag || drag.pointerId !== event.pointerId) return;
  drag.y = event.clientY;
  if (!drag.active && Math.abs(drag.y - drag.startY) >= 5) {
    drag.active = true;
    drag.row.classList.add('dragging');
    stopAutoRefresh();
    drag.frame = requestAnimationFrame(moveDraggedRow);
  }
});
get('files').addEventListener('pointerup', event => { if (drag?.pointerId === event.pointerId) finishDrag(false); });
get('files').addEventListener('pointercancel', event => { if (drag?.pointerId === event.pointerId) finishDrag(true); });
get('files').addEventListener('lostpointercapture', () => { if (drag) finishDrag(true); });

audio.addEventListener('ended', resetPlay);
audio.addEventListener('error', () => { if (playing) { resetPlay(); error(); } });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { finishDrag(true); stopAutoRefresh(); }
  else refreshFiles();
});
window.addEventListener('pagehide', () => { finishDrag(true); stopAutoRefresh(); });
window.addEventListener('pageshow', () => refreshFiles());
openLibrary().catch(failure => { showLogin(); if (failure.status !== 401) error(); });
