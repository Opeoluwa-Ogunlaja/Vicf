import { Document, RefType } from 'mongoose'

export interface IOrganisation {
  name: string
  members: RefType[]
  contact_groupings: RefType[]
  owner: RefType
}

export interface IOrganisationDocument extends IOrganisation, Document {}
