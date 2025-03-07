export type additionalInfoValue = Record<string, string | number>
export interface IContact {
  _id: string
  number: string
  email?: string
  additional_information?: additionalInfoValue
  name: string
  overwrite_name?: string
  time_added: string
  time_updated: string
}

export type contactsArray = IContact[]

export type contactsReadProperty = 'contacts' | 'url_id' | 'loading'

export type contactsContext = {
  loading: boolean
  url_id?: string
  contacts: contactsArray
  add?: (contact: Partial<IContact>) => contactsArray
  remove?: (id: IContact['id']) => IContact
  edit?: (id: string, data: Partial<IContact>) => Promise<IContact>
  delete?: (listing_id: string, contact_id: string) => Promise<contactsArray>
}
