const CACHE = 'nakhlio-v31';
const V = 'v=31';
const CORE = ['./', './index.html', './app.js?' + V, './data.js?' + V, './community.js?' + V, './services.js?' + V, './magaam.js?' + V, './live.js?' + V, './vendor/supabase-2.118.0.js', './i18n.js?' + V, './manifest.webmanifest', './icon-192.png', './apple-touch-icon.png'];
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
      net.then(fin).catch(() => caches.match('./index.html').then(r => fin(r || Response.error())));
      setTimeout(() => caches.match(e.request, { ignoreSearch: true }).then(r => r ? fin(r) : caches.match('./index.html').then(fin)), 2500);
    }));
    return;
  }
  // files: from cache at once, refreshed in the background (file names carry the version, so a new version is a new file)
  e.respondWith(caches.match(e.request).then(hit => { const net = fetch(e.request).then(put).catch(() => hit); return hit || net.then(r => r || caches.match(e.request, { ignoreSearch: true })); }));
});
