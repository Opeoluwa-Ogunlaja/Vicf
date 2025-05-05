import mongoose, { Model, Schema } from 'mongoose'
import { IOrganisationDocument } from '../types/'

export type OrganisationModelType = Model<IOrganisationDocument>

const organisationSchema = new Schema<IOrganisationDocument, OrganisationModelType>({
  name: String,
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  contact_groupings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Contact_Group'
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Organisation = mongoose.model('Organisation', organisationSchema)

export default Organisation
