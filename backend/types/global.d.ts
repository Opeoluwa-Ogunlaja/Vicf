import { Server } from "socket.io"

declare global {
  namespace NodeJS {
    interface Global {
      io: Server
    }
  }
}

export {}
