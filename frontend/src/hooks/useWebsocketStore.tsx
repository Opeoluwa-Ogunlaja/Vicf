import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface Message {
  type: string
  data: unknown
}

interface WebSocketState {
  socket: Socket | null
  lastMessage: Message | null
  canSendMessages: boolean
  sendMessage: (content: Record<string, unknown>, customEventName?: string) => void
  connect: (url: string) => void
  disconnect: () => void
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  lastMessage: null,
  canSendMessages: false,

  sendMessage: (content, customEventName) => {
    const { socket } = get()
    if (!socket) return

    const message = JSON.stringify(content)
    if (customEventName) {
      socket.emit(customEventName, message)
    } else {
      socket.send(message)
    }
  },

  connect: url => {
    const socket = io(url, { withCredentials: true, retries: 5 })
    set({ socket })

    socket.onAny((message, response) => {
      set({ lastMessage: response })
    })

    socket.on('connect', () => {
      set({ canSendMessages: true })
    })

    socket.on('disconnect', () => {
      set({ canSendMessages: false })
    })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.offAny()
      socket.disconnect()
      set({ socket: null, canSendMessages: false })
    }
  }
}))
