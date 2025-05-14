import { IUserDocument } from './user'

declare module 'express-serve-static-core' {
  interface Request {
    user: Partial<IUserDocument> | null
  }
}
