const CACHE_NAME = 'codeacademy-v3';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Не трогаем запросы к CDN (Pyodide и т.п.) — только свои ассеты.
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    // cache: 'no-store' — обходим обычный HTTP-кеш браузера, а не только
    // кеш этого service worker. Без этого fetch() мог тихо вернуть старую
    // версию файла из дискового кеша браузера, даже при "network-first"
    // логике — именно это, скорее всего, вызывало показ устаревшей версии
    // после обновлений.
    fetch(event.request, { cache: 'no-store' })
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
