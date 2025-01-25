import { SocketActionsContext } from '@/contexts/SocketActionsContext'
import { SocketVarsContext } from '@/contexts/SocketVarsContext'
import useEffectEvent from '@/hooks/useEffectEvent'
import { useWebSocketStore } from '@/hooks/useWebsocketStore'
import { FC, memo, ReactNode, useEffect, useMemo } from 'react'

const SocketProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  const { socket, lastMessage, canSendMessages, sendMessage, connect, disconnect } =
    useWebSocketStore()

  const socketVars = useMemo(() => {
    return { socket, lastMessage, canSendMessages }
  }, [socket, lastMessage, canSendMessages])

  const socketActions = useMemo(() => {
    return { sendMessage, connect, disconnect }
  }, [sendMessage, connect, disconnect])

  const connectOnEntry = useEffectEvent(() => {
    connect('http://localhost:3002')
  })

  useEffect(() => {
    connectOnEntry('http://localhost:3002')
  }, [connect, connectOnEntry])

  return (
    <SocketVarsContext.Provider value={socketVars}>
      <SocketActionsContext.Provider value={socketActions}>
        {children}
      </SocketActionsContext.Provider>
    </SocketVarsContext.Provider>
  )
})

export default SocketProvider
