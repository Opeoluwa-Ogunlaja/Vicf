import mongoose, { Model, Schema } from 'mongoose'
import { IUserDocument } from '../types/'
import { encryptedFieldPlugin } from '../lib/utils/mongooseEncryptedFieldPlugin'
import bcrypt from 'bcrypt'

export type UserModelType = Model<IUserDocument>

const userSchema = new Schema<IUserDocument, UserModelType, { isPasswordMatched: (enteredPassword: string) => void }>({
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
  },
  g_refreshToken: String
})

userSchema.methods.isPasswordMatched = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    if(this.password && typeof this.password == 'string'){
      console.log(this.password)
      this.password = await bcrypt.hash(this.password, salt)
    }
});

userSchema.plugin(encryptedFieldPlugin, {fields: [{ field: "email" }, { field: "g_refreshToken" }]});

// userSchema.pre('findOne', function(next){
//   console.log(this.getQuery())
//   next()
// })

const User = mongoose.model('User', userSchema)

export default User
