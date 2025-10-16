import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { userRepository } from '../../../repositories/UserRepository'
import { AccessError, ForbiddenError } from '../../utils/AppErrors'
import { loginTokenName, jwtSecret, nodeEnv } from './../../../config/index'
import validateMongodbId from '../../validators/validateMongodbId'
import { SocketClients, SocketHandlerFn, SocketUsers } from '../../../types'
import * as cookie from 'cookie'
import { Socket } from 'socket.io'
import { verifyAccessToken, verifyRefreshToken } from '../../utils/generateToken'

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
   // ✅ If already authenticated, skip
  if (req.user) return next()

  const refreshToken = req.cookies?.[loginTokenName]
  const accessToken = req.headers.authorization?.replace('Bearer ', '') || ''

  if (!refreshToken) return next()

  try {
    const userInfo = await verifyAccessToken(accessToken, refreshToken)

    if (userInfo) {
      const user = await userRepository.findById(userInfo.id)
      if (!user) return next()

      req.user = user
      return next()
    }
    
    const tokenContent = verifyRefreshToken(refreshToken)
    const victimId = tokenContent?._id

    if (victimId) {
      // Optionally clear refresh token from DB
      // await userRepository.updateById(victimId, { $unset: { refreshToken: 1 } })

      // Optionally clear cookie
      // res.cookie(loginTokenName, '', {
      //   expires: new Date(0),
      //   httpOnly: true,
      //   path: '/',
      //   secure: nodeEnv === 'production',
      //   sameSite: nodeEnv === 'production' ? 'lax' : undefined
      // })

      res.setHeader('hijack', 'true')
    }

    return next()
  } catch (err) {
    console.log(req.path)
    if (err instanceof ForbiddenError && req.path != "/api/users/token") throw err
    return next()
  }
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

  const refreshToken = loggedInToken
  let decoded!: any
  decoded = jwt.verify(refreshToken, jwtSecret ?? 'hehehehe', { algorithms: ['HS256'] })
  const isValidId = validateMongodbId(decoded?._id ?? '')

  const user = await userRepository.findById(decoded?._id)
  if (!user || !isValidId) return next()

  // Clone user object to avoid shared references
  const userObj = user.toObject?.() ?? { ...user }

  clients.set(socket.id, {
    socket,
    user: userObj,
    socketId: socket.id
  })

  // Support multiple sockets per user
  if (!userSockets.has(userObj._id as string)) {
    userSockets.set(String(userObj._id), [socket.id])
  } else {
    userSockets.get(String(userObj._id))!.push(socket.id)
  }

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
