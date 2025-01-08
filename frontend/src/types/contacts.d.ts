export type additionalInfoValue = Record<string, string | number>
export interface IContact {
  _id: string
  number: string
  email?: string
  additional_information?: additionalInfoValue
  name: string
}

export type contactsArray = IContact[]

export type contactsReadProperty = 'contacts' | 'url_id'

export type contactsContext = {
  url_id?: string
  contacts: contactsArray
  add?: (contact: IContact) => contactsArray
  remove?: (id: IContact['id']) => IContact
  edit?: (id: string, data: IContact) => IContact
  delete?: (number: string) => contactsArray
}
