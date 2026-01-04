import OnlineContext from '@/contexts/OnlineContext'
import OnlineEventsContext, { type Handler } from '@/contexts/OnlineEventsContext'
import { useEventListener } from '@/hooks/useEventListener'
import { useSocketEvent } from '@/hooks/useSocketEvent'
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

  const sentFirstRequest = useRef(false)
  useEffect(() => {
    if(!sentFirstRequest.current){ 
      if( 'serviceWorker' in navigator )(navigator.serviceWorker.controller?.postMessage('CHECK_NETWORK'))
      sentFirstRequest.current = true
    }
  }, [])

  const onOffline = useCallback((handler: Handler) => {
    handlers.current.off.push(handler)
  }, [])

  // --- Sync logic ---
  const syncOnlineStatus = useCallback(() => {
    const newOnline = isConnected.current && isNetworkOnline.current
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
  }, [])

  const synced = useRef(false)
  useEffect(() => {
    if(!synced) syncOnlineStatus()
    synced.current = true
  }, [ syncOnlineStatus ])

  // --- Fire handlers when online state changes ---
  useEffect(() => {
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

  // --- Task queue sync ---
  useEffect(() => {
    if (online) OnlineTaskQueue.resume()
    else OnlineTaskQueue.pause()
  }, [online])

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'NETWORK_STATUS') {
      const isOnline = Boolean(event.data.isOnline)
      if (isNetworkOnline.current !== isOnline) {
        isNetworkOnline.current = isOnline
        syncOnlineStatus()
      }
    }
  }, [syncOnlineStatus])

  useEventListener('message', handleMessage, navigator.serviceWorker)

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
