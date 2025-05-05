import expressAsyncHandler from 'express-async-handler'
import userService, { UserService } from './../services/UserService'
import { AsyncHandler } from '../types'
import { userRegisterSchema, userRegisterType } from '../lib/validators/zodSchemas'
// import { z } from 'zod'
import { flattenZodErrorMessage } from '../lib/utils/zodErrors'
import { AccessError, NotFoundError, RequestError } from '../lib/utils/AppErrors'
import { verifyGoogleToken } from '../lib/utils/tokenVerifications'
import generateToken from '../lib/utils/generateToken'
import { nodeEnv } from '../config'

class UserController {
  service: UserService

  constructor(service: UserService) {
    this.service = service
  }

  register_user: AsyncHandler<userRegisterType, {}> = async (req, res) => {
    let validation = userRegisterSchema.safeParse(req?.body)
    if (!validation.success) throw new RequestError(flattenZodErrorMessage(validation.error.errors))

    const userExists = await this.service.get_user(validation.data)
    if (userExists) {
      throw new RequestError('User Already Exists')
    }

    const newUser = await this.service.create_user(validation.data)

    res.json({ ok: true, data: newUser })
  }

  login_user: AsyncHandler<{ email: string; password: string }, {}> = async (req, res) => {
    const { email, password } = req.body
    const userExists = await this.service.get_user({ email })
    if (!userExists) {
      throw new NotFoundError('User')
    }

    if (password !== userExists.password) {
      throw new RequestError('Invalid User information')
    }

    const jwt = generateToken(userExists?.id as string)
    res.cookie('LIT', jwt, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      path: '/',
      secure: false
    })

    res.json({
      ok: true,
      data: { id: userExists.id, email: userExists.email, name: userExists.name }
    })
  }

  get_profile: AsyncHandler<{}, {}> = async (req, res) => {
    const user = req?.user
    if (!user) {
      throw new AccessError('Not authenticated')
    }

    res.json({
      ok: true,
      data: { id: user.id, email: user.email, name: user.name }
    })
  }

  social_signup_google: AsyncHandler<{ code: string }, {}> = async (req, res) => {
    const { code } = req.body
    let jwt

    const validated_user = await verifyGoogleToken(code as string)

    const user = await this.service.get_user({ provider: 'google', email: validated_user?.email })
    jwt = generateToken(user?.id as string)

    if (user) {
      if (!user.verified && validated_user.email_verified)
        await this.service.complete_verification(user.id)

      res.cookie('LIT', jwt, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        path: '/',
        secure: nodeEnv == 'production'
      })
      res.json({
        ok: true,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          token: jwt
        }
      })
      return
    }

    const createdUser = await this.service.create_user({
      email: validated_user?.email,
      provider: 'google',
      name: `${validated_user?.given_name} ${validated_user?.family_name}`.trim(),
      verified: validated_user.email_verified
    })
    jwt = generateToken(createdUser.id as string)

    res.cookie('LIT', jwt, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production'
    })
    res.json({
      ok: true,
      data: {
        _id: createdUser._id,
        email: validated_user?.email as string,
        name: `${validated_user?.given_name} ${validated_user?.family_name}`.trim(),
        token: jwt
      }
    })
  }
}

export const userController: UserController = new Proxy(new UserController(userService), {
  get(target: UserController, prop: keyof UserController) {
    const obj = target[prop]

    if (typeof obj == 'function') {
      return expressAsyncHandler(obj as (req: any, res: any, next: any) => any)
    }

    return obj
  }
})
