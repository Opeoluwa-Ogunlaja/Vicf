import { frontendUrl, GClientId, GSecret } from '../../config'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { OAuth2Client } from 'google-auth-library'
import { RequestError } from './AppErrors'

export type GoogleUserResponse = Partial<{
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}>

console.log(GClientId, GSecret, frontendUrl)

export async function verifyGoogleToken(code: string) {
  const client = new OAuth2Client({
    clientId: GClientId ?? '',
    clientSecret: GSecret ?? '',
    redirectUri: frontendUrl
  })

  try {
    const { tokens } = await client.getToken({
      code
    })

    client.setCredentials(tokens)
    ;(client as any).scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/contacts',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/directory.readonly',
      'openid'
    ]

    const userInfoResponse = await client.request({
      url: 'https://openidconnect.googleapis.com/v1/userinfo'
    })
    // Payload contains user information (sub, name, email, etc.)
    return {...Object(userInfoResponse.data), refreshToken: tokens.refresh_token } as GoogleUserResponse & { refreshToken: typeof tokens.refresh_token }
  } catch (error) {
    throw new RequestError((error as { message: string })?.message ?? 'Invalid Google Token')
  }
}

export async function verifyAppleToken(idToken: string) {
  try {
    // Decode the token to get the header
    const decodedToken = jwt.decode(idToken, { complete: true })
    const kid = decodedToken!.header.kid

    // Fetch Apple's public key
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys'
    })

    const key = await client.getSigningKey(kid)
    const signingKey = key.getPublicKey()

    // Verify the token
    const payload = jwt.verify(idToken, signingKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: 'YOUR_CLIENT_ID' // replace with your client ID
    }) as { email: string; email_verified: string }

    // Extract the user's email
    const email = payload.email
    const isEmailVerified = payload.email_verified // This is typically a string "true" or "false"

    if (email && isEmailVerified === 'true') {
      return { email, payload }
    } else {
      throw new RequestError('Email not provided or not verified')
    }
  } catch (error) {
    if (error instanceof Error) throw new RequestError(`Invalid Apple token: ${error.message}`)
  }
}
