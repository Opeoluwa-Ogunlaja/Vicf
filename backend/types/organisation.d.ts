import { Document, RefType } from 'mongoose'

export interface IOrganisation {
  name: string
  members: RefType[]
  contact_groupings: RefType[]
  creator: RefType
  inviteCode: string
}

export interface IOrganisationDocument extends IOrganisation, Document {}
