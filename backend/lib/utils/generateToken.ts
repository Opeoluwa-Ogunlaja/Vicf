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

export const generateAccessToken = (refreshToken: string) => {
  const token = jwt.sign({ refreshToken }, jwtSecret ?? 'hehehehe', {
    expiresIn: '5m',
    algorithm: jwtAlgo
  })

  return token
}

export const verifyRefreshToken = (refreshToken: string): { _id: string } => {
  const refreshContent = jwt.verify(refreshToken, jwtSecret ?? 'hehehehe', {
    algorithms: [jwtAlgo]
  }) as { _id: string }

  return refreshContent
}

export const verifyAccessToken = async (accessToken: string, refreshToken: string) => {
  const tokenAccess = jwt.verify(accessToken, jwtSecret ?? 'hehehehe', {
    algorithms: [jwtAlgo]
  }) as { refreshToken: string }

  if (tokenAccess.refreshToken != refreshToken) throw new AccessError('Access Expired')

  const { _id } = verifyRefreshToken(refreshToken)
  const user = await userRepository.dal.getModel().findOne({ refreshToken, _id }).select('_id')
  return user ? user : null
}

export default generateRefreshToken
