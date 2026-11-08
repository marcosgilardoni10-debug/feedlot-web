// Mapa Ganadero — ServiceWorker mínimo (cachea index + manifest, red primero para datos).
const CACHE = 'mg-v1';
const URLS = ['./', './index.html', './manifest.webmanifest', './feedlots.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return; // Firebase y otros dominios: red directo.
  event.respondWith(
    fetch(event.request).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copia));
      return res;
    }).catch(() => caches.match(event.request))
  );
});
