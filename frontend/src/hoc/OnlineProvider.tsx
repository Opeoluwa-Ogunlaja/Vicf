import OnlineContext from '@/contexts/OnlineContext'
import OnlineEventsContext, { type Handler } from '@/contexts/OnlineEventsContext'
import { useEventListener } from '@/hooks/useEventListener'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { useUser } from '@/hooks/useUser'
import { OnlineTaskQueue } from '@/queue'
import { ReactNode, useEffect, useRef, useState, useCallback, memo } from 'react'

const OnlineProvider = memo(({ children }: { children: ReactNode }) => {
  const { loggedIn: isUserLoggedIn } = useUser()

  // --- Refs ---
  const isConnected = useRef(false)
  const isNetworkOnline = useRef<boolean>(navigator.onLine)
  const lastOnlineRef = useRef<Date | null>(null)
  const lastCheckRef = useRef<Date | null>(null)
  const handlers = useRef<{ on: Handler[]; off: Handler[] }>({ on: [], off: [] })

  // --- State ---
  const [online, setOnline] = useState(false)

  // --- Handlers registration ---
  const onOnline = useCallback((handler: Handler) => {
    handlers.current.on.push(handler)
  }, [])

  const onOffline = useCallback((handler: Handler) => {
    handlers.current.off.push(handler)
  }, [])

  // --- Computed status ---
  const computeOnline = useCallback(() => {
    return isConnected.current && isNetworkOnline.current
  }, [])

  // --- Sync logic ---
  const syncOnlineStatus = useCallback(() => {
    const newOnline = computeOnline()
    const now = new Date()

    lastCheckRef.current = now
    navigator.serviceWorker.controller?.postMessage({
      type: 'ONLINE_STATUS',
      online: newOnline,
      lastChecked: now,
    })

    setOnline(prev => {
      if (prev !== newOnline && newOnline) {
        lastOnlineRef.current = now
      }
      return newOnline
    })
  }, [computeOnline])

  // --- Fire handlers when online state changes ---
  useUpdateEffect(() => {
    const prop = online ? 'on' : 'off'
    handlers.current[prop].forEach(handler => handler())
  }, [online])

  // --- Socket events ---
  useSocketEvent('connect', () => {
    isConnected.current = true
    syncOnlineStatus()
  }, [syncOnlineStatus])

  useSocketEvent('disconnect', () => {
    isConnected.current = false
    syncOnlineStatus()
    console.log('socket disconnected')
  }, [syncOnlineStatus])

  // --- Browser events ---
  const handleBrowserStatusChange = useCallback(() => {
    isNetworkOnline.current = navigator.onLine
    syncOnlineStatus()
  }, [syncOnlineStatus])

  useEventListener('online', handleBrowserStatusChange, window)
  useEventListener('offline', handleBrowserStatusChange, window)

  // --- User login status ---
  useEffect(() => {
    syncOnlineStatus()
  }, [isUserLoggedIn, syncOnlineStatus])

  // --- Task queue sync ---
  useEffect(() => {
    if (online) OnlineTaskQueue.resume()
    else OnlineTaskQueue.pause()
  }, [online])

  // --- Service worker network check ---
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NETWORK_STATUS') {
        const isOnline = Boolean(event.data.isOnline)
        if (isNetworkOnline.current !== isOnline) {
          isNetworkOnline.current = isOnline
          syncOnlineStatus()
        }
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage)
      navigator.serviceWorker.controller?.postMessage('CHECK_NETWORK')
    }

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [syncOnlineStatus])

  // --- Render ---
  return (
    <OnlineContext.Provider
      value={{
        isOnline: online && isUserLoggedIn,
        hasNetwork: isNetworkOnline.current,
        online,
        lastOnline: lastOnlineRef.current,
        lastCheck: lastCheckRef.current,
      }}
    >
      <OnlineEventsContext.Provider value={{ onOnline, onOffline }}>
        {children}
      </OnlineEventsContext.Provider>
    </OnlineContext.Provider>
  )
})

export default OnlineProvider
