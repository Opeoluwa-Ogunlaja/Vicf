import { Document } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  verified: boolean
  provider?: string
  drive_linked: boolean
  contact_groupings: RefType[]
  refreshToken: string
  profile_photo: string
  g_refreshToken: string
}

export interface IUserDocument extends IUser, Document {}
