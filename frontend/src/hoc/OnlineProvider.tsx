import OnlineContext from '@/contexts/OnlineContext'
import OnlineEventsContext, { type Handler } from '@/contexts/OnlineEventsContext'
import { useEventListener } from '@/hooks/useEventListener'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { useUser } from '@/hooks/useUser'
import { OnlineTaskQueue } from '@/queue'
import { ReactNode, useEffect, useRef, useState, useCallback } from 'react'

const OnlineProvider = ({ children }: { children: ReactNode }) => {
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

  const computeOnline = () => isConnected.current && navigator.onLine && isUserLoggedIn

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
  }, [isUserLoggedIn])

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
      console.log('socket connected')
    },
    []
  )

  // WebSocket disconnect
  useSocketEvent(
    'disconnect',
    () => {
      isConnected.current = false
      syncOnlineStatus()
      console.log('socket disconnected')
    },
    []
  )

  // Browser online
  const handleBrowserOnline = useCallback(() => {
    syncOnlineStatus()
    console.log('browser online')
  }, [syncOnlineStatus])

  // Browser offline
  const handleBrowserOffline = useCallback(() => {
    syncOnlineStatus()
    console.log('browser offline')
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
        isOnline: online,
        lastOnline: lastOnlineRef.current,
        lastCheck: lastCheckRef.current
      }}
    >
      <OnlineEventsContext.Provider value={{ onOnline, onOffline }}>
        {children}
      </OnlineEventsContext.Provider>
    </OnlineContext.Provider>
  )
}

export default OnlineProvider
