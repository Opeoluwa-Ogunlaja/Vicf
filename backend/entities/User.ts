import mongoose, { Model, Schema } from 'mongoose'
import { IUserDocument } from '../types/'

export type UserModelType = Model<IUserDocument>

const userSchema = new Schema<IUserDocument, UserModelType>({
  name: String,
  email: String,
  password: String,
  provider: String,
  verified: {
    type: Boolean,
    default: false
  },
  contact_groupings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Contact_Group'
    }
  ],
  refreshToken: String
})

const User = mongoose.model('User', userSchema)

export default User
