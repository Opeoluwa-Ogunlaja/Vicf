import { ContactsContext } from '@/contexts/ContactsContext'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'
import { useArray } from '@/hooks/useArray'
import { IContact } from '@/types/contacts'
import { FC, ReactNode } from 'react'

const ContactsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const contacts = useArray<IContact>()
  return (
    <ContactsContext.Provider value={contacts.values}>
      <ContactsUpdateContext.Provider
        value={{
          add: contact => {
            contacts.push({ ...contact, slug: String(contacts.values.length + 1) })
            return contacts.values
          },
          edit: (id, data) => {
            const newContacts = contacts.values.map(contact => {
              if (id === contact.id) return data
              else return contact
            })
            contacts.setValues(newContacts)
            return data
          }
        }}
      >
        {children}
      </ContactsUpdateContext.Provider>
    </ContactsContext.Provider>
  )
}

export default ContactsProvider
