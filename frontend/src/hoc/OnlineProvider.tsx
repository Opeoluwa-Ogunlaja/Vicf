import OnlineContext from '@/contexts/OnlineContext'
import OnlineEventsContext, { type Handler } from '@/contexts/OnlineEventsContext'
import { useEventListener } from '@/hooks/useEventListener'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { useUser } from '@/hooks/useUser'
import { OnlineTaskQueue } from '@/queue'
import { ReactNode, useEffect, useRef, useState, useCallback, memo } from 'react'

const OnlineProvider = memo(({ children }: { children: ReactNode }) => {
  const isConnected = useRef(false)
  const lastOnlineRef = useRef<Date | null>(null)
  const lastCheckRef = useRef<Date | null>(null)
  const [online, setOnline] = useState(false)
  const { loggedIn: isUserLoggedIn } = useUser()
  const handlers = useRef<{ on: Handler[]; off: Handler[] }>({
    on: [],
    off: []
  })

  const onOnline = useCallback((handler: Handler) => {
    handlers.current.on.push(handler)
  }, [])

  const onOffline = useCallback((handler: Handler) => {
    handlers.current.off.push(handler)
  }, [])

  const computeOnline = useCallback(
    () => isConnected.current && navigator.onLine,
    [isConnected, isUserLoggedIn]
  )

  // Sync computed status and timestamps
  const syncOnlineStatus = useCallback(() => {
    const newOnline = computeOnline()

    const now = new Date()
    lastCheckRef.current = now

    setOnline(prevOnline => {
      if (newOnline && !prevOnline) {
        // User just became online
        lastOnlineRef.current = now
      }
      return newOnline
    })
  }, [computeOnline])

  useUpdateEffect(() => {
    const prop = online ? 'on' : 'off'
    for (const handler of handlers.current[prop]) {
      handler()
    }
  }, [online])

  // WebSocket connect
  useSocketEvent(
    'connect',
    () => {
      isConnected.current = true
      syncOnlineStatus()
    },
    [online, syncOnlineStatus]
  )

  // WebSocket disconnect
  useSocketEvent(
    'disconnect',
    () => {
      isConnected.current = false
      syncOnlineStatus()
      console.log('socket disconnected')
    },
    [online, syncOnlineStatus]
  )

  // Browser online
  const handleBrowserOnline = useCallback(() => {
    syncOnlineStatus()
  }, [syncOnlineStatus])

  // Browser offline
  const handleBrowserOffline = useCallback(() => {
    syncOnlineStatus()
  }, [syncOnlineStatus])

  useEventListener('online', handleBrowserOnline, window)
  useEventListener('offline', handleBrowserOffline, window)

  // React to isUserLoggedIn changes
  useEffect(() => {
    syncOnlineStatus()
  }, [isUserLoggedIn, syncOnlineStatus])

  // React to online status changes
  useEffect(() => {
    if (online) {
      OnlineTaskQueue.resume()
    } else {
      OnlineTaskQueue.pause()
    }
  }, [online])

  return (
    <OnlineContext.Provider
      value={{
        isOnline: online && isUserLoggedIn,
        online,
        lastOnline: lastOnlineRef.current,
        lastCheck: lastCheckRef.current
      }}
    >
      <OnlineEventsContext.Provider value={{ onOnline, onOffline }}>
        {children}
      </OnlineEventsContext.Provider>
    </OnlineContext.Provider>
  )
})

export default OnlineProvider
