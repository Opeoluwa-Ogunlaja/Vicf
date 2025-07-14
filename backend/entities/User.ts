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
  refreshToken: String,
  profile_photo: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  }
})

const User = mongoose.model('User', userSchema)

export default User
