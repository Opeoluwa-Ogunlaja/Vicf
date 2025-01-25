import { WebSocketVars } from '@/types'
import { createContext } from 'react'

export const SocketVarsContext = createContext<WebSocketVars>({
  socket: null,
  lastMessage: null,
  canSendMessages: false
})
