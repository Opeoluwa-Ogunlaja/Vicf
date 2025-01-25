import { Socket } from 'socket.io-client'

export interface SocketMessage {
  message?: string
  type: string
  data: unknown
}

export interface WebSocketVars {
  socket: Socket | null
  lastMessage: SocketMessage | null
  canSendMessages: boolean
}

export interface WebSocketActions {
  sendMessage: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: unknown,
    customEventName?: string,
    callback?: (...args: unknown[]) => void
  ) => void
  connect: (url: string) => void
  disconnect: () => void
}

export type WebSocketState = WebSocketVars & WebSocketActions
