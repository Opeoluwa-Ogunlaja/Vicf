self.addEventListener('push', (event) => {
  const data = event.data?.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/pwa-192x192.png',
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/notifications'))
})

// Example custom cache handling
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/custom-endpoint')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open('custom-endpoint-cache')
        const cached = await cache.match(event.request)
        if (cached) return cached

        const res = await fetch(event.request)
        cache.put(event.request, res.clone())
        return res
      })()
    )
  }
})