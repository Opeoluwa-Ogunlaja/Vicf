import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../config'
import { AccessError } from './AppErrors'
import { userRepository } from '../../repositories/UserRepository'

export const jwtAlgo = 'HS256'
const generateRefreshToken = (_id: string): string => {
  const token = jwt.sign({ _id }, jwtSecret ?? 'hehehehe', {
    expiresIn: '20d',
    algorithm: jwtAlgo
  })

  return token
}

export const generateAccessToken = (refreshToken: string, duration: number = 10) => {
  const token = jwt.sign(
    { refreshToken, expires: new Date(Date.now() + duration * 1000) },
    jwtSecret ?? 'hehehehe',
    {
      expiresIn: '30s',
      algorithm: jwtAlgo
    }
  )

  return token
}

export const verifyRefreshToken = (refreshToken: string): { _id: string } | null => {
  try {
    const refreshContent = jwt.verify(refreshToken, jwtSecret ?? 'hehehehe', {
      algorithms: [jwtAlgo]
    }) as { _id: string }

    return refreshContent
  } catch (error) {
    return null
  }
}

export const verifyAccessToken = async (accessToken: string, refreshToken: string) => {
  let tokenAccess: { refreshToken: string; expires: number } | null
  try {
    tokenAccess = jwt.verify(accessToken, jwtSecret ?? 'hehehehe', {
      algorithms: [jwtAlgo]
    }) as { refreshToken: string; expires: number }
  } catch (e) {
    tokenAccess = null
  }

  if (
    !tokenAccess ||
    tokenAccess?.refreshToken != refreshToken ||
    Date.now() > new Date(tokenAccess?.expires).getTime()
  )
    throw new AccessError('Access Expired')

  const refreshTokenContents = verifyRefreshToken(refreshToken)
  const user = await userRepository.dal
    .getModel()
    .findOne({ refreshToken, _id: refreshTokenContents?._id })
    .select('_id')
  return user ? user : null
}

export default generateRefreshToken
