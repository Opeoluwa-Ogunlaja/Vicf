import { Schema, model, Model } from 'mongoose'
import { IContactDocument } from '../types/'
import { encryptedFieldPlugin } from '../lib/utils/mongooseEncryptedFieldPlugin'

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
    },
    locked: {
      type: Boolean,
      default: false
    },
    locked_by: {
      type: 'ObjectId',
      ref: 'User'
    },
    last_updated_by: {
      type: 'ObjectId',
      ref: 'User'
    }
  },
  {
    timestamps: {
      createdAt: 'time_added',
      updatedAt: 'time_modified'
    }
  }
)

contactSchema.plugin(encryptedFieldPlugin, { fields: [{field: "email"}, {field: "number"}] });

const Contact = model<IContactDocument, ContactModelType>('Contact', contactSchema)

export default Contact
