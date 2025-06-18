import { ContactsContext } from '@/contexts/ContactsContext'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'
import { useToast } from '@/hooks/use-toast'
import { useManager } from '@/hooks/useManager'
import { useManagerActions } from '@/hooks/useManagerActions'
// import { useOnline } from '@/hooks/useOnline'
import { useSocketActions } from '@/hooks/useSocketActions'
import { useUser } from '@/hooks/useUser'
import { delete_contact, get_contacts } from '@/lib/utils/requestUtils'
// import { db } from '@/stores/dexie/db'
import { contactsArray, IContact } from '@/types/contacts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

const ContactsProvider: FC<{ children: ReactNode; url_id: string }> = ({ children, url_id }) => {
  const { sendMessage } = useSocketActions()
  const { toast } = useToast()
  const { loggedIn } = useUser()
  const manager = useManager()
  const { updateContactCount } = useManagerActions()
  // const { isOnline } = useOnline()

  // console.log(isOnline)

  const contactManager = manager.find(mngr => mngr.url_id == url_id)

  const queryClient = useQueryClient()

  const { isLoading, data: contacts } = useQuery({
    queryKey: ['contacts', url_id],
    queryFn: () => get_contacts(contactManager?._id || ''),
    staleTime: Infinity,
    placeholderData: [],
    initialData: contactManager && contactManager?.contacts_count > 0 ? undefined : [],
    enabled: !!contactManager?._id,
    retry: 5,
    networkMode: 'always'
  })

  return (
    <ContactsContext.Provider
      value={{ loading: isLoading, url_id, contacts: contacts as IContact[] }}
    >
      <ContactsUpdateContext.Provider
        value={{
          add: contact => {
            if (loggedIn) {
              sendMessage(
                { listingId: contactManager?._id, ...contact },
                'add-contacts',
                contact => {
                  toast({
                    title: 'Contacts synced',
                    description: `${(contact as IContact).number} Synced`
                  })
                }
              )
            }

            queryClient.setQueryData(['contacts', url_id], (formerProps: IContact[]) => {
              return [...formerProps, contact]
            })
            updateContactCount(contactManager?._id as string)
            return queryClient.getQueryData(['contacts', url_id]) as contactsArray
          },
          edit: async (id, data) => {
            let contact!: IContact
            queryClient.setQueryData(['contacts', url_id], (formerProps: IContact[]) => {
              return formerProps.map(ct => {
                if (ct._id !== id) return ct
                else {
                  contact = { ...ct, ...data }
                  return contact
                }
              })
            })
            return contact
          },
          delete: async (listing_id: string, contact_id: string) => {
            console.log(contact_id)
            function remove() {
              const contacts = queryClient.getQueryData(['contacts', url_id]) as IContact[]
              const currentContacts = contacts.filter(contact => contact._id !== contact_id)
              queryClient.setQueryData(['contacts', url_id], currentContacts)
              updateContactCount(contactManager?._id as string, true)
              return queryClient.getQueryData(['contacts', url_id]) as contactsArray
            }

            try {
              await delete_contact(listing_id, contact_id)
              return remove()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              remove()
              throw new Error("It didn't  delete successfully")
            }
          }
        }}
      >
        {children}
      </ContactsUpdateContext.Provider>
    </ContactsContext.Provider>
  )
}

export default ContactsProvider
