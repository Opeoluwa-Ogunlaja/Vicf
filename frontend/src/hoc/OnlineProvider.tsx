import OnlineContext from '@/contexts/OnlineContext'
import { useEventListener } from '@/hooks/useEventListener'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { ReactNode, useRef, useState } from 'react'

const OnlineProvider = ({ children }: { children: ReactNode }) => {
  const lastOnlineRef = useRef<Date | null>(null)
  const lastCheckRef = useRef<Date | null>(null)
  const isConnected = useRef<boolean>(false)
  const [online, setOnline] = useState<boolean>(false)

  useSocketEvent(
    'connect',
    () => {
      isConnected.current = true
      if (!online) setOnline(true)
      // console.log('connect')
    },
    [online]
  )

  useSocketEvent(
    'disconnect',
    () => {
      isConnected.current = false
      setOnline(false)
      console.log('disconnect', online)
    },
    [online]
  )

  const onlineHandler = () => {
    if (isConnected.current) setOnline(true)
    // console.log('online')
  }
  const offlineHandler = () => {
    if (!isConnected.current) setOnline(false)
    // console.log('offline')
  }
  useEventListener('online', onlineHandler, window)
  useEventListener('offline', offlineHandler, window)

  return (
    <OnlineContext.Provider
      value={{
        isOnline: online,
        lastOnline: lastOnlineRef.current,
        lastCheck: lastCheckRef.current
      }}
    >
      {' '}
      {children}{' '}
    </OnlineContext.Provider>
  )
}

export default OnlineProvider
