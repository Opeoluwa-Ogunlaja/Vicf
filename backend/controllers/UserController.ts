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
import { google } from "googleapis";
import { frontendUrl, GClientId, GSecret } from '../config'

class UserController {
  // --- TEMPLATE: Add User CRUD/Feature Methods ---
  update_user: AsyncHandler<any, any, { userId: string }> = async (req, res) => {
    // TODO: Implement update user
    res.json({ ok: true, data: null })
  }

  delete_user: AsyncHandler<any, any, { userId: string }> = async (req, res) => {
    // TODO: Implement delete user
    res.json({ ok: true, data: null })
  }

  change_password: AsyncHandler<any, any, { userId: string }> = async (req, res) => {
    // TODO: Implement change password
    res.json({ ok: true, data: null })
  }

  // --- END TEMPLATE ---
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
      throw new RequestError('Invalid Credentials')
    }

    if (!(await this.service.verifyPassword(userExists, password))) {
      throw new RequestError('Invalid User credentials')
    }

    const refreshToken: string = generateToken(userExists?.id as string)

    await this.service.updateRefreshToken(userExists?.id, refreshToken)

    res.cookie('LIT', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production',
      sameSite: nodeEnv == 'production' ? 'lax' : undefined
      // partitioned: nodeEnv == 'production'
    })

    const accessToken = generateAccessToken(refreshToken)

    res.json({
      ok: true,
      data: {
        _id: userExists._id,
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
      maxAge: 1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production',
      sameSite: nodeEnv == 'production' ? 'lax' : undefined
      // partitioned: nodeEnv == 'production'
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
      data: { _id: user._id, id: user.id, email: user.email, name: user.name, profile_photo: user.profile_photo, drive_linked: user.drive_linked }
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
      const newUser = {
        email: validated_user.email,
        provider: 'google',
        name: `${validated_user.given_name} ${validated_user.family_name}`.trim(),
        verified: validated_user.email_verified,
        profile_photo: validated_user.picture,
        g_refreshToken: validated_user.refreshToken!
      }
      user = await this.service.create_user(newUser)
    }

    // Finalize login
    if (!user.verified && validated_user.email_verified) {
      await this.service.complete_verification(user._id)
    }

    const refreshToken = generateToken(user._id)
    await this.service.updateRefreshToken(user._id, refreshToken, validated_user.refreshToken!)

    res.cookie('LIT', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
      path: '/',
      secure: nodeEnv == 'production',
      sameSite: nodeEnv == 'production' ? 'lax' : undefined
      // partitioned: nodeEnv == 'production'
    })
    const accessToken = generateAccessToken(refreshToken)
    res.json({
      ok: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profile_photo: user.profile_photo,
        token: accessToken
      }
    })
  }

  ack_permissions:  AsyncHandler<any, any> = async (req, res) => {

  }

  gain_permissions: AsyncHandler<any, any> = async (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
      GClientId ?? '',
      GSecret ?? '',
      'http://localhost:3002/users/ack-permissions'
    );

    // Define scopes (whatever your app needs)
    const scopes = [
      "https://www.googleapis.com/auth/drive.file",  
      "https://www.googleapis.com/auth/drive",
      'https://www.googleapis.com/auth/contacts',
    ];

    // Generate the consent URL
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", // ensures we get refresh_token
      prompt: "consent",      // forces Google to show the consent screen every time
      scope: scopes,
    });

    // Redirect user to Google
    res.redirect(url);
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
