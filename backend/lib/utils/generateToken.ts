import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../config'
import { AccessError, ForbiddenError } from './AppErrors'
import { userRepository } from '../../repositories/UserRepository'

export const jwtAlgo = 'HS256'
const generateRefreshToken = (_id: string): string => {
  const token = jwt.sign({ _id }, jwtSecret ?? 'hehehehe', {
    expiresIn: '10d',
    algorithm: jwtAlgo
  })

  return token
}

export const generateAccessToken = (refreshToken: string, duration: number = 60 * 2) => {
  const token = jwt.sign(
    { refreshToken, expires: new Date(Date.now() + duration * 1000) },
    jwtSecret ?? 'hehehehe',
    {
      expiresIn: '2m',
      algorithm: jwtAlgo
    }
  )

  return token
}

export const verifyRefreshToken = (refreshToken: string): { _id: string } | null => {
  try {
    return jwt.verify(refreshToken, jwtSecret ?? 'hehehehe', { algorithms: [jwtAlgo] }) as { _id: string }
  } catch {
    return null
  }
}

export const verifyAccessToken = async (accessToken: string, refreshToken: string) => {
    let payload!: { refreshToken: string; expires: number }
    try {
      payload = jwt.verify(accessToken, jwtSecret ?? 'hehehehe', {
        algorithms: [jwtAlgo],
      }) as { refreshToken: string; expires: number }
    }
    catch(e){
      if(e instanceof jwt.TokenExpiredError)  throw new ForbiddenError('Access Expired')
    }

    // Ensure linked refresh token is consistent
    if (payload.refreshToken !== refreshToken) return null
    if (Date.now() > new Date(payload.expires).getTime()) throw new ForbiddenError('Access Expired')

    const refreshData = verifyRefreshToken(refreshToken)
    if (!refreshData?._id) return null

    const user = await userRepository.dal
      .getModel()
      .findOne({ _id: refreshData._id, refreshToken })
      .select('_id')

    return user || null
}

export default generateRefreshToken