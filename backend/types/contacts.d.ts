import { Date, Document, RefType } from 'mongoose'

export interface IContact {
  name: string
  email?: string
  number: string
  additional_information?: Record<string, string>
  overwrite: boolean
  overwrite_name: string
  contact_group: RefType
  locked: boolean
  locked_by: RefType
  last_updated_by: RefType
  time_added: Date
  time_updated: Date
}

export interface IContactDocument extends IContact, Document {}

export interface IContactGroup {
  name: string
  userId: RefType
  description: string
  contacts: IContact[]
  contacts_count: number
  backed_up: boolean
  url_id: string
  last_backup: Date
  input_backup: string
  preferences: {
    slug_type: 'title_number' | 'title_hash'
  }
  organisation: RefType
  users_editing: RefType[]
}

export interface IContactGroupDocument extends IContactGroup, Document {}
