import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { userRepository } from '../../../repositories/UserRepository'
import { AccessError } from '../../utils/AppErrors'
import { loginTokenName, jwtSecret } from './../../../config/index'
import validateMongodbId from '../../validators/validateMongodbId'
import { SocketClients, SocketHandlerFn, SocketUsers } from '../../../types'
import * as cookie from 'cookie'
import { Socket } from 'socket.io'

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  if (req.user) return next()

  let token

  if ((token = req?.cookies[<string>loginTokenName])) {
    if (!token) return next()
    // Decode token to get Id and verify that Id
    try {
      // find the user by id
      let decoded!: any
      decoded = jwt.verify(token, jwtSecret ?? 'hehehehe', { algorithms: ['HS256'] })
      const isValidId = validateMongodbId(decoded?._id ?? '')

      const user = await userRepository.findById(decoded?._id)

      // Check if Id is valid
      if (!user || !isValidId) return next()

      // Attatch the user to the request object
      req.user = user
      return next()
    } catch (e) {
      return next()
    }
  }

  next()
})

export const socketAuthMiddleware = async (
  socket: Socket,
  clients: SocketClients,
  userSockets: SocketUsers,
  next: (err?: any) => void
) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie ?? '')
  const loggedInToken =
    (loginTokenName && cookies[loginTokenName]) ??
    socket.handshake?.headers.authorization?.replace('Bearer ', '')

  if (!loggedInToken) return next()

  const token = loggedInToken
  let decoded!: any
  decoded = jwt.verify(token, jwtSecret ?? 'hehehehe', { algorithms: ['HS256'] })
  const isValidId = validateMongodbId(decoded?._id ?? '')

  const user = await userRepository.findById(decoded?._id)
  if (!user || !isValidId) return next()

  // Attatch the user to the request object
  clients.set(socket.id, {
    socket,
    user: user,
    socketId: socket.id
  })
  userSockets.set(user?.id, socket.id)

  next()
}

export const mustAuthSocketMiddleware: SocketHandlerFn = async (
  message,
  socket,
  clients,
  userSockets,
  next
) => {
  if (!clients.get(socket.id)?.user) {
    next(new AccessError('Not authenticated'))
    return
  }
  next()
}

export const mustAuthMiddleware = expressAsyncHandler(async (req, res, next) => {
  if (!req.user) throw new AccessError('Not authorized. Please Login Again')
  next()
})

// export const mustNotAuthMiddleware = expressAsyncHandler(async (req, res, next) => {
//     if (req.user) throw new RequestError("Sorry, you have to log out before carrying out this action")
//     next()
// })

// export const mustAdminMiddleware = expressAsyncHandler(async (req, res, next) => {
//     if (req.user && req.user.role !== 'admin') throw new AccessError("Sorry, you don't the permissions to do that")
//     next()
// })
