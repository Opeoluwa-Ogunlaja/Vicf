import { SocketActionsContext } from '@/contexts/SocketActionsContext'
import { SocketVarsContext } from '@/contexts/SocketVarsContext'
import { useUser } from '@/hooks/useUser'
import { useWebSocketStore } from '@/hooks/useWebsocketStore'
import { FC, memo, ReactNode, useEffect, useMemo, useRef } from 'react'

const SocketProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  const { loggedIn } = useUser()
  const { socket, lastMessage, canSendMessages, sendMessage, connect, disconnect } =
    useWebSocketStore()

  const socketVars = useMemo(() => {
    return { socket, lastMessage, canSendMessages }
  }, [socket, lastMessage, canSendMessages])

  const socketActions = useMemo(() => {
    return { sendMessage, connect, disconnect }
  }, [sendMessage, connect, disconnect])

  const isConnected = useRef(false)
  useEffect(() => {
    if(loggedIn && !isConnected.current) {
      connect(import.meta.env.VITE_BACKEND_URL)
      isConnected.current = true
    }

    return () => {
      disconnect()
    }
  }, [loggedIn, connect, disconnect])

  return (
    <SocketVarsContext.Provider value={socketVars}>
      <SocketActionsContext.Provider value={socketActions}>
        {children}
      </SocketActionsContext.Provider>
    </SocketVarsContext.Provider>
  )
})

export default SocketProvider
