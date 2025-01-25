import { ContactsContext } from '@/contexts/ContactsContext'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'
import { useToast } from '@/hooks/use-toast'
import { useArray } from '@/hooks/useArray'
import { useSocketActions } from '@/hooks/useSocketActions'
import { useUser } from '@/hooks/useUser'
import { IContact } from '@/types/contacts'
import { FC, ReactNode } from 'react'

const ContactsProvider: FC<{ children: ReactNode; url_id: string }> = ({ children, url_id }) => {
  const contacts = useArray<IContact>([])
  const { sendMessage } = useSocketActions()
  const { toast } = useToast()
  const { loggedIn } = useUser()

  return (
    <ContactsContext.Provider value={{ url_id, contacts: contacts.values }}>
      <ContactsUpdateContext.Provider
        value={{
          add: contact => {
            if (loggedIn) {
              sendMessage(contact, 'contacts', contact => {
                toast({
                  title: 'Contacts synced',
                  description: `${(contact as IContact).number} Synced`
                })
              })
            }
            contacts.push({ ...contact })
            return contacts.values
          },
          edit: (id, data) => {
            const newContacts = contacts.values.map(contact => {
              if (id === contact._id) return data
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
