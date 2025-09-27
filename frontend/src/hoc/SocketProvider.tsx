import { SocketActionsContext } from '@/contexts/SocketActionsContext'
import { SocketVarsContext } from '@/contexts/SocketVarsContext'
import useEffectEvent from '@/hooks/useEffectEvent'
import { useUser } from '@/hooks/useUser'
import { useWebSocketStore } from '@/hooks/useWebsocketStore'
import { FC, memo, ReactNode, useEffect, useMemo } from 'react'

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

  const connectOnEntry = useEffectEvent(() => {
    connect(import.meta.env.VITE_BACKEND_URL)
  })

  useEffect(() => {
    if(loggedIn) connectOnEntry(import.meta.env.VITE_BACKEND_URL)
  }, [connect, connectOnEntry, loggedIn])

  return (
    <SocketVarsContext.Provider value={socketVars}>
      <SocketActionsContext.Provider value={socketActions}>
        {children}
      </SocketActionsContext.Provider>
    </SocketVarsContext.Provider>
  )
})

export default SocketProvider
