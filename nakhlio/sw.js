const CACHE = 'nakhlio-v53';
const V = 'v=53';
const B = '/nakhlio/';
const HOME = new URL('./', self.registration.scope).href;
const CORE = [HOME, B + 'index.html', B + 'app.js?' + V, B + 'data.js?' + V, B + 'community.js?' + V, B + 'services.js?' + V, B + 'mgdata.js?' + V, B + 'magaam.js?' + V, B + 'live.js?' + V, B + 'vendor/supabase-2.118.0.js', B + 'i18n.js?' + V, B + 'icon-192.png', B + 'img/mgapp/icon-192.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  if (e.request.headers.has('range') || /\.(mp4|mov|webm)$/i.test(new URL(e.request.url).pathname)) return;
  const put = (r) => { if (r && r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)).catch(() => {}); } return r; };
  const nav = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(e.request.url).pathname);
  if (nav) {
    // page: try the network for up to 1.5 s (to get new versions), otherwise open instantly from cache
    e.respondWith(new Promise(res => {
      let done = false; const fin = (r) => { if (!done && r) { done = true; res(r); } };
      const net = fetch(e.request).then(put);
      net.then(fin).catch(() => caches.match(HOME).then(r => fin(r || Response.error())));
      setTimeout(() => caches.match(e.request, { ignoreSearch: true }).then(r => r ? fin(r) : caches.match(HOME).then(fin)), 2500);
    }));
    return;
  }
  // files: from cache at once, refreshed in the background (file names carry the version, so a new version is a new file)
  e.respondWith(caches.match(e.request).then(hit => { const net = fetch(e.request).then(put).catch(() => hit); return hit || net.then(r => r || caches.match(e.request, { ignoreSearch: true })); }));
});

/* badge counter kept by the worker; the app resets it when opened */
const BADGE = 'nk-badge';
const getN = () => caches.open(BADGE).then(c => c.match('n')).then(r => r ? r.text() : '0').then(t => +t || 0).catch(() => 0);
const setN = (n) => caches.open(BADGE).then(c => c.put('n', new Response(String(n)))).catch(() => {});
self.addEventListener('message', e => { if (e.data && typeof e.data.badge === 'number') setN(e.data.badge); });
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (x) { d = { title: 'Nakhlio', body: e.data ? e.data.text() : '' }; }
  const icon = d.app === 'magaam' ? B + 'img/mgapp/icon-192.png' : B + 'icon-192.png';
  e.waitUntil(getN().then(n => { n++; return setN(n).then(() => Promise.all([
    self.registration.showNotification(d.title || 'Nakhlio', { body: d.body || '', icon, badge: icon, tag: d.tag || undefined, renotify: !!d.tag, silent: !!d.silent, data: { url: d.url || HOME } }),
    self.navigator && self.navigator.setAppBadge ? self.navigator.setAppBadge(n).catch(() => {}) : null])); }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close(); const url = (e.notification.data && e.notification.data.url) || HOME;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const base = url.split('?')[0];
    for (const w of ws) { if (w.url.indexOf(base) >= 0 || base.indexOf(new URL(w.url).pathname) === 0) { w.postMessage({ open: url }); return w.focus(); } }
    return self.clients.openWindow(url); }));
});
