import { Schema, model, Model } from 'mongoose'
import { IContactGroupDocument } from '../types/'

export type ContactGroupModelType = Model<IContactGroupDocument>

const contactGroupSchema = new Schema<IContactGroupDocument, ContactGroupModelType>({
  name: String,
  contacts: [{ ref: 'Contact', type: 'ObjectId' }],
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  organisation: {
    type: 'ObjectId',
    ref: 'Organisations'
  },
  url_id: { type: String, unique: true },
  contacts_count: {
    type: Number,
    default: 0
  },
  backed_up: {
    type: Boolean,
    default: false
  },
  input_backup: {
    type: String,
    default: JSON.stringify({
      number: '',
      email: '',
      additional_information: {},
      overwrite: false,
      overwrite_name: ''
    })
  },
  last_backup: {
    type: Date
  },
  preferences: {
    slug_type: {
      type: String,
      enum: ['title_number', 'title_hash'],
      default: 'title_number'
    }
  },
  users_editing: [{
    type: 'ObjectId',
    ref: 'User'
  }]
})

const ContactGroup = model<IContactGroupDocument, ContactGroupModelType>(
  'Contact_Group',
  contactGroupSchema
)

export default ContactGroup
