import env from './env'

export const port = env.PORT
export const mongoUrl = env.MONGO_URL
export const GClientId = env.GCLIENT_ID
export const GSecret = env.GSECRET
export const jwtSecret = env.JWT_SECRET
export const loginTokenName = env.LOGIN_TOKEN_NAME || 'LIT'
export const nodeEnv = env.NODE_ENV
export const frontendUrl = env.FRONTEND_URL
export const hmacKey = env.HMAC_KEY
export const encKey = env.ENC_KEY

