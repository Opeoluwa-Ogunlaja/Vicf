import { useEffect, useRef } from 'react'
import { useSocketVars } from './useSocketVars'
import { SocketMessage } from '@/types'

export const useSocketEvent = (eventname: string, callback: (message: SocketMessage) => void) => {
  const callbackRef = useRef<typeof callback>(() => {})
  const { socket } = useSocketVars()
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (socket) {
      socket.on(eventname, callbackRef.current)
    }

    return () => {
      if (socket) socket.off(eventname, callbackRef.current)
    }
  }, [socket, eventname])
}
