import { ContactsContext } from '@/contexts/ContactsContext'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'
import { useArray } from '@/hooks/useArray'
import useDebounce from '@/hooks/useDebounce'
import { IContact } from '@/types/contacts'
import { FC, ReactNode } from 'react'

const ContactsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const contacts = useArray<IContact>([
    { number: '+234 807 2466 0055', email: '', overwrite: false, overwrite_name: '', slug: '1' }
  ])
  useDebounce(
    () => {
      console.log('you don dey lazy')
    },
    3000,
    [contacts]
  )

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
          },
          delete: (number: string) => {
            const foundContact = contacts.values.findIndex(contact => contact.number == number)
            const contactsArr = Array.from(contacts.values)
            const currentContacts = contactsArr.splice(foundContact, 1)
            contacts.setValues(contactsArr)
            return currentContacts
          }
        }}
      >
        {children}
      </ContactsUpdateContext.Provider>
    </ContactsContext.Provider>
  )
}

export default ContactsProvider
