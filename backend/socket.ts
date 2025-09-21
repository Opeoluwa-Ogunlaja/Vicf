import { Server, Socket } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import { server } from './server'
import { socketsController } from './controllers/SocketController'
import { SocketClients, SocketUsers } from './types'
import { socketAuthMiddleware } from './lib/middleware/users/authMiddleware'
import { contactUseCases } from './use cases/ContactUseCases'

const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:5173', 'https://vicf.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

instrument(io, {
  auth: false,
  namespaceName: '/admin',
  mode: 'development'
})

class SocketIOHandler {
  private io: Server
  clients: SocketClients
  usersSockets: SocketUsers
  constructor(io: Server) {
    this.io = io
    this.clients = new Map()
    this.usersSockets = new Map()
  }

  connect() {
    this.io.use(async (socket: Socket, next) => {
      await socketAuthMiddleware(socket, this.clients, this.usersSockets, next)
    })

    this.io.on('connect', async socket => {
      socketsController.attach(socket, this.clients, this.usersSockets)

      // Handle disconnection
      socket.on('disconnect', async () => {
        const userId = this.clients.get(socket.id)?.user?.id
        if (userId) {
          await contactUseCases.ResetActions(userId)
          const sockets = this.usersSockets.get(userId) || []
          this.usersSockets.set(
            userId,
            sockets.filter(id => id !== socket.id)
          )
          if (this.usersSockets.get(userId)?.length === 0) {
            this.usersSockets.delete(userId)
          }
        }
        this.clients.delete(socket.id)
      })
    })
  }
}

export async function connectSocketIo() {
  try {
    const socketIOHandler = new SocketIOHandler(io)
    socketIOHandler.connect()

    return io
  } catch (error) {
    console.error(error)
  }
}
