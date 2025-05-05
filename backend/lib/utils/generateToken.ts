import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../config'

const generateToken = (_id: string): string => {
  const token = jwt.sign({ _id }, jwtSecret ?? 'hehehehe', {
    expiresIn: '20d',
    algorithm: 'HS256'
  })

  return token
}

export default generateToken
