import express from 'express'
import { userController } from '../controllers/UserController'
import { authMiddleware } from '../lib/middleware/users/authMiddleware'

const userRouter = express.Router()

userRouter.post('/register', userController.register_user.bind(userController))

userRouter.post('/login', userController.login_user.bind(userController))

userRouter.post('/google-login', userController.social_signup_google.bind(userController))

userRouter.get('/profile', authMiddleware, userController.get_profile.bind(userController))

export default userRouter
