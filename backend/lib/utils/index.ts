import { IContact } from '../../types'

export const filteredContacts = (contacts: Partial<{ _id: string } & IContact>[]): ({_id: string, tel: string} & Pick<IContact, 'additional_information' | 'email' | 'name' | 'time_added' | 'time_updated'>)[] => {
  return contacts.map(contact => {
    return {
      _id: contact._id!,
      additional_information: contact.additional_information!,
      name: contact.overwrite_name ?? contact.name!,
      time_added: contact.time_added!,
      email: contact.email!,
      time_updated: contact.time_updated!,
      tel: contact.number!
    }
  })
}