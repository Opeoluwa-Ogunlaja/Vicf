import { addInfoFormSchemaType } from '@/utils/form-schemas'

export interface IContact {
  id?: string
  number: string
  slug?: string
  email?: string
  additional_information?: addInfoFormSchemaType
  overwrite?: boolean
  overwrite_name?: string
}

export type contactsArray = IContact[]

export type contactsContext = {
  contacts: contactsArray
  add?: (contact: IContact) => contactsArray
  remove?: (id: IContact['id']) => IContact
  edit?: (id: string, data: IContact) => IContact
  delete?: (number: string) => contactsArray
}
