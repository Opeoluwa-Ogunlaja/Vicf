import { WebSocketActions } from '@/types'
import { createContext } from 'react'

export const SocketActionsContext = createContext<WebSocketActions>({
  sendMessage: () => {},
  connect: () => {},
  disconnect: () => {}
})
