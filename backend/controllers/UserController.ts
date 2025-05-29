import expressAsyncHandler from 'express-async-handler'
import userService, { UserService } from './../services/UserService'
import { AsyncHandler } from '../types'
import { userRegisterSchema, userRegisterType } from '../lib/validators/zodSchemas'
// import { z } from 'zod'
import { flattenZodErrorMessage } from '../lib/utils/zodErrors'
import { AccessError, NotFoundError, RequestError } from '../lib/utils/AppErrors'
import { verifyGoogleToken } from '../lib/utils/tokenVerifications'
import generateToken, { generateAccessToken, verifyRefreshToken } from '../lib/utils/generateToken'
import { loginTokenName, nodeEnv } from '../config'
import { newId } from '../lib/utils/mongooseUtils'

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

    const refreshToken: string = generateToken(userExists?.id as string)

    await this.service.updateRefreshToken(userExists?.id, refreshToken)

    res.cookie('LIT', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production',
      sameSite: nodeEnv == 'production' ? 'none' : undefined,
      partitioned: true
    })

    const accessToken = generateAccessToken(refreshToken)

    res.json({
      ok: true,
      data: {
        id: userExists.id,
        email: userExists.email,
        name: userExists.name,
        token: accessToken
      }
    })
  }

  get_token: AsyncHandler<{}, {}> = async (req, res) => {
    const refreshToken = req.cookies[<string>loginTokenName]
    const refreshTokenContent: { _id: string } = verifyRefreshToken(refreshToken)!

    if (!refreshTokenContent?._id) throw new AccessError()

    const user = await this.service.get_user({
      refreshToken: refreshToken,
      _id: refreshTokenContent._id
    })

    if (!user) throw new AccessError()

    const newRefreshToken = generateToken(user.id)

    await this.service.updateRefreshToken(user.id, newRefreshToken)

    const accessToken = generateAccessToken(newRefreshToken)

    res.cookie('LIT', newRefreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production',
      sameSite: nodeEnv == 'production' ? 'none' : undefined,
      partitioned: true
    })

    res.json({
      ok: true,
      data: {
        token: accessToken
      }
    })
  }

  get_profile: AsyncHandler<{}, {}> = async (req, res) => {
    const user = req?.user!

    res.json({
      ok: true,
      data: { id: user.id, email: user.email, name: user.name }
    })
  }

  social_signup_google: AsyncHandler<{ code: string }, {}> = async (req, res) => {
    const { code } = req.body

    const validated_user = await verifyGoogleToken(code)
    if (!validated_user || !validated_user.email) {
      throw new RequestError('Invalid Google token')
    }

    let user = (await this.service.get_user({ email: validated_user.email })) as any

    if (!user) {
      // Create a new user with social login
      const newUserId = newId().toString()
      const newUser = {
        _id: newUserId,
        email: validated_user.email,
        provider: 'google',
        name: `${validated_user.given_name} ${validated_user.family_name}`.trim(),
        verified: validated_user.email_verified
      }
      await this.service.create_user(newUser)
      user = newUser
    }

    // Finalize login
    if (!user.verified && validated_user.email_verified) {
      await this.service.complete_verification(user._id)
    }

    const refreshToken = generateToken(user._id)
    await this.service.updateRefreshToken(user._id, refreshToken)

    res.cookie('LIT', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production',
      sameSite: nodeEnv == 'production' ? 'none' : undefined,
      partitioned: true
    })
    const accessToken = generateAccessToken(refreshToken)
    res.json({
      ok: true,
      data: { _id: user._id, email: user.email, name: user.name, token: accessToken }
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
