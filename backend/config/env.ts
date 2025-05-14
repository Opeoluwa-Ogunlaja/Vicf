import { z } from 'zod'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
})

const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']).default('development'),
  PORT: z.coerce.number().default(3002),
  GCLIENT_ID: z.string(),
  GSECRET: z.string(),
  JWT_SECRET: z.string(),
  MONGO_URL: z.string(),
  LOGIN_TOKEN_NAME: z.string().default('LIT'),
  FRONTEND_URL: z.string().default('http://localhost:5173')
})

export type EnvSchema = z.infer<typeof envSchema>

const { data: env, error } = envSchema.safeParse(process.env)

if (error) {
  console.error('X invalid Env')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export default env!
