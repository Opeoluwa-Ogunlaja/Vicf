import { Document } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  verified: boolean
  provider?: string
  contact_groupings: RefType[]
  refreshToken: string
}

export interface IUserDocument extends IUser, Document {}
