import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { db } from '@/stores/dexie/db'

/* ---- Core setup ---- */
precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()
clientsClaim()

/* ---- Utils ---- */
function sanitizeInput(input) {
  const element = document.createElement('div')
  element.innerText = input
  return element.innerHTML
}

/* ---- Network state ---- */
const onlineStatus = new Proxy(
  {
    socketOnline: false,
    checkedOnline: navigator.onLine,
    lastChecked: null
  },
  {
    get(target, prop) {
      if (prop === 'online') return target.socketOnline && target.checkedOnline
      if (prop === 'systemOnline') return navigator.onLine
      return Reflect.get(target, prop)
    }
  }
)

/* ---- Network checking ---- */
/* ---- Network checking ---- */
const CHECK_URL = 'http://localhost:3002/ping'
let firstCheckPromise = null

async function checkNetwork() {
  try {
    const res = await fetch(CHECK_URL, {
      cache: 'no-store',
      mode: 'no-cors',
      credentials: 'include'
    })
    return !!res
  } catch {
    return false
  }
}

/**
 * Ensure the first check happens before any backend request continues.
 */
async function ensureFirstCheck() {
  if (!firstCheckPromise) {
    firstCheckPromise = (async () => {
      const isOnline = await checkNetwork()
      broadcastStatus(isOnline)
      return isOnline
    })()
  }
  return firstCheckPromise
}

async function broadcastStatus(isOnline) {
  const clientsList = await self.clients.matchAll()
  onlineStatus.checkedOnline = Boolean(isOnline)
  for (const client of clientsList) {
    client.postMessage({ type: 'NETWORK_STATUS', isOnline })
  }
}

/* ---- Periodic checks ---- */
setInterval(async () => {
  const isOnline = await checkNetwork()
  broadcastStatus(isOnline)
}, 20000) // every 20s

/* ---- Message handling ---- */
self.addEventListener('message', async event => {
  const data = event.data

  if (data === 'CHECK_NETWORK') {
    const isOnline = await checkNetwork()
    broadcastStatus(isOnline)
  }

  if (data?.type === 'ONLINE_STATUS') {
    onlineStatus.socketOnline = data.online
    onlineStatus.lastChecked = data.lastChecked
  }

  if (data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

/* ---- Background Sync ---- */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-tasks') {
    event.waitUntil(syncPendingTasks())
  }
})

/* ---- Notifications ---- */
self.addEventListener('push', event => {
  const data = event.data?.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'pwa-192x192.png'
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow('/notifications'))
})

/* ---- Fetch interception ---- */
self.addEventListener('fetch', event => {
  const url = event.request.url

  // only intercept your backend requests
  if (url.startsWith('http://localhost:3002')) {
    event.respondWith(
      (async () => {
        // --- ensureFirstCheck must exist and resolve before allowing the first backend request ---
        await ensureFirstCheck(event.request)

        try {
          // ---- Offline user/profile fallback ----
          if (url.includes('users/profile') && !onlineStatus.checkedOnline) {
            try {
              const res = await db.last_user.toCollection().first()
              if (res) {
                const response = new Response(JSON.stringify({ ok: true, data: res }), {
                  headers: { 'Content-Type': 'application/json' },
                })
                const cache = await caches.open('user info')
                await cache.put(event.request, response.clone())
                return response
              }
            } catch (err) {
              console.error('[SW] Local user fetch error:', err)
            }
          }


          // ---- Return live fetch result ----
          return await fetch(event.request, { credentials: 'include' })
        } catch (err) {
          // ---- Return 503 for network-level errors ----
          return new Response('Service Unavailable', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        }
      })()
    )
  }
})
