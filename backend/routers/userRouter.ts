import express from 'express'
import { userController } from '../controllers/UserController'
import { authMiddleware, mustAuthMiddleware } from '../lib/middleware/users/authMiddleware'

const userRouter = express.Router()

userRouter.post('/register', userController.register_user.bind(userController))

userRouter.post('/login', userController.login_user.bind(userController))

userRouter.post('/google-login', userController.social_signup_google.bind(userController))

userRouter.get('/permissions', userController.gain_permissions.bind(userController))
userRouter.get('/ack-permissions', userController.gain_permissions.bind(userController))

userRouter.get('/token', userController.get_token.bind(userController))

userRouter.get(
  '/profile',
  authMiddleware,
  mustAuthMiddleware,
  userController.get_profile.bind(userController)
)

export default userRouter
