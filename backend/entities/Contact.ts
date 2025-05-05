import { Schema, model, Model } from 'mongoose'
import { IContactDocument } from '../types/'

export type ContactModelType = Model<IContactDocument>

const contactSchema = new Schema<IContactDocument>(
  {
    name: String,
    email: String,
    number: String,
    additional_information: Schema.Types.Mixed,
    overwrite: {
      type: Boolean,
      default: false
    },
    overwrite_name: String,
    contact_group: {
      type: 'ObjectId',
      ref: 'Contact_Group'
    }
  },
  {
    timestamps: {
      createdAt: 'time_added',
      updatedAt: 'time_modified'
    }
  }
)

const Contact = model<IContactDocument, ContactModelType>('Contact', contactSchema)

export default Contact
