/// <reference lib="webworker" />

const CACHE_NAME = 'app-cache-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
]

self.addEventListener('install', event => {
  const swEvent = event
  swEvent.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)))
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
  fetchEvent.respondWith(fetch(fetchEvent.request).catch(() => caches.match(fetchEvent.request)))
})

self.addEventListener('message', event => {
  const msgEvent = event
  if (msgEvent.data && msgEvent.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
