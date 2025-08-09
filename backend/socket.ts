import { Server, Socket } from 'socket.io'
import { server } from './server'
import { socketsController } from './controllers/SocketController'
import { SocketClients, SocketUsers } from './types'
import { socketAuthMiddleware } from './lib/middleware/users/authMiddleware'

const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:5173', 'https://vicf.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
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
      socket.on('disconnect', () => {
        if (this.clients.get(socket.id)?.user?.id)
          this.usersSockets.delete(this.clients.get(socket.id)?.user?.id)
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
