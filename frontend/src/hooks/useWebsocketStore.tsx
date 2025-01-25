import { create } from 'zustand'
import { io } from 'socket.io-client'
import { WebSocketState } from '@/types'

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  lastMessage: null,
  canSendMessages: false,

  sendMessage: (content, customEventName, ackCallback) => {
    const { socket } = get()
    if (!socket) return

    const message = JSON.stringify(content)
    if (socket.connected) {
      if (customEventName) {
        if (ackCallback) socket.emit(customEventName, message, ackCallback)
        else socket.emit(customEventName, message)
      } else {
        socket.send(message)
      }
    }
  },

  connect: url => {
    const socket = io(url, {
      withCredentials: true,
      transports: ['websocket']
    })
    set({ socket })

    socket.onAny((...[, response]) => {
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
