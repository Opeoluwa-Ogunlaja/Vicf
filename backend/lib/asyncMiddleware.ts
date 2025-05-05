import { Socket } from 'socket.io'
import { SocketClients, SocketUsers, SocketHandlerFn } from './../types'

function asyncMiddleware(
  fns: SocketHandlerFn[],
  socket: Socket,
  clients: SocketClients,
  userSockets: SocketUsers
) {
  return function (message: any) {
    let idx = 0
    const next = (err?: any) => {
      if (err) {
        return socket.emit('error', {
          message: err.message,
          stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined
        })
      }

      if (idx == fns.length) return

      const fn = fns[idx++]

      fn(message, socket, clients, userSockets, next).catch((err: Error) => {
        socket.emit('error', {
          message: err.message,
          stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined
        })
      })
    }

    next()
  }
}

export default asyncMiddleware
