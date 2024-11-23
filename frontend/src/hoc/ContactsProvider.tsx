import { ContactsContext } from '@/contexts/ContactsContext'
import { useArray } from '@/hooks/useArray'
import { IContact } from '@/types/contacts'
import { FC, ReactNode } from 'react'

const ContactsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const contacts = useArray<IContact>()
  return (
    <ContactsContext.Provider
      value={{
        contacts: contacts.values,
        add: contact => {
          contacts.push(contact)
          return contacts.values
        }
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export default ContactsProvider
