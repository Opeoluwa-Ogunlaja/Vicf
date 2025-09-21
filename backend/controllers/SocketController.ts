import { Socket } from 'socket.io'
import asyncMiddleware from '../lib/asyncMiddleware'
import { SocketClients, SocketHandlerFn, SocketUsers } from '../types'

export default class SocketsController {
  handlers: Record<string, any>
  constructor() {
    this.handlers = {}
  }

  attach(socket: Socket, clients: SocketClients, userSockets: SocketUsers) {
    for (const event in this.handlers) {
      socket!.on(event, message =>
        asyncMiddleware(
          this.handlers[event],
          socket as Socket,
          clients as SocketClients,
          userSockets as SocketUsers
        )(JSON.parse(message))
      )
    }
  }


  registerHandler(event: string, ...args: SocketHandlerFn[]) {
    if (args.length == 0) throw new Error('No handler for socket event')
    this.handlers[event] = args
  }
}

export const socketsController = new SocketsController()
