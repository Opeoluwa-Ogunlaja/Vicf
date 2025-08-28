/// <reference lib="webworker" />

const CACHE_NAME = 'app-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
})

self.addEventListener('activate', event => {
  const swEvent = event
  swEvent.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
      )
  )
})

self.addEventListener('fetch', event => {
  const fetchEvent = event
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
})

self.addEventListener('message', event => {
  const msgEvent = event
  if (msgEvent.data && msgEvent.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
self.addEventListener('sync', event => {
  if (event.tag === 'sync-tasks') {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({ type: 'SYNC_TASKS' }));
    });
  }
});
