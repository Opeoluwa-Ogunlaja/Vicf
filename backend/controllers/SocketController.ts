import { Socket } from 'socket.io'
import asyncMiddleware from '../lib/asyncMiddleware'
import { SocketClients, SocketHandlerFn, SocketUsers } from '../types'

export default class SocketsController {
  socket?: Socket
  clients?: SocketClients
  userSockets?: SocketUsers
  handlers: Record<string, any>
  constructor() {
    this.handlers = []
  }

  attach(socket: Socket, clients: SocketClients, userSockets: SocketUsers) {
    this.socket = socket
    this.clients = clients
    this.userSockets = userSockets

    for (const event in this.handlers) {
      this.listen(event, ...this.handlers[event])
    }
  }

  listen(event: string, ...callbacks: any[]) {
    this.socket!.on(event, message =>
      asyncMiddleware(
        callbacks,
        this.socket as Socket,
        this.clients as SocketClients,
        this.userSockets as SocketUsers
      )(JSON.parse(message))
    )
  }

  registerHandler(event: string, ...args: SocketHandlerFn[]) {
    if (args.length == 0) throw new Error('No handler for socket event')
    this.handlers[event] = args
  }
}

export const socketsController = new SocketsController()
