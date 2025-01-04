import { ContactsContext } from '@/contexts/ContactsContext'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'
import { useArray } from '@/hooks/useArray'
import { IContact } from '@/types/contacts'
import { FC, ReactNode } from 'react'
import { useParams } from 'react-router-dom'

const ContactsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { id } = useParams()
  const contacts = useArray<IContact>([])

  return (
    <ContactsContext.Provider value={{ url_id: id, contacts: contacts.values }}>
      <ContactsUpdateContext.Provider
        value={{
          add: contact => {
            contacts.push({ ...contact })
            return contacts.values
          },
          edit: (id, data) => {
            const newContacts = contacts.values.map(contact => {
              if (id === contact.contact_id) return data
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
