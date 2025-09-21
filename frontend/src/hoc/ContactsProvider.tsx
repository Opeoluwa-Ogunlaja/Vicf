import { ContactsContext } from '@/contexts/ContactsContext'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'
import { useToast } from '@/hooks/use-toast'
import { useManager } from '@/hooks/useManager'
import { useManagerActions } from '@/hooks/useManagerActions'
// import { useOnline } from '@/hooks/useOnline'
import { useSocketActions } from '@/hooks/useSocketActions'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { useUser } from '@/hooks/useUser'
import { delete_contact, get_contacts, update_contact } from '@/lib/utils/requestUtils'
// import { db } from '@/stores/dexie/db'
import { contactsArray, IContact } from '@/types/contacts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'
import { ContactManagerEntry } from '@/types/contacts_manager'

const ContactsProvider: FC<{ children: ReactNode; url_id: string }> = ({ children, url_id }) => {
  const { sendMessage } = useSocketActions()
  const { toast } = useToast()
  const { loggedIn } = useUser()
  const manager = useManager()
  const { updateContactCount, setEditors } = useManagerActions()
  // const { isOnline } = useOnline()

  // console.log(isOnline)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSocketEvent('editing', (data: any) => {
    const editorsInfo = data as { listingId: string; editors: ContactManagerEntry['users_editing'] }
    setEditors(editorsInfo.listingId, editorsInfo.editors)
  })


  function remove(contact_id: string) {
    const contacts = queryClient.getQueryData(['contacts', url_id]) as IContact[]
    const currentContacts = contacts.filter(contact => contact._id !== contact_id)
    queryClient.setQueryData(['contacts', url_id], currentContacts)
    updateContactCount(contactManager?._id as string, true)
    return queryClient.getQueryData(['contacts', url_id]) as contactsArray
  }

  function edit(id: string, data: Partial<IContact>) {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSocketEvent('delete-contact', (data: any) => {
    remove(data._id)
  })

  // Listen for contact_locked and contact_unlocked events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSocketEvent('contact-locked', (data: any) => {
    const updated = data.contact
    queryClient.setQueryData(['contacts', url_id], (formerProps: IContact[] = []) =>
      formerProps.map(ct => (ct._id === updated._id ? { ...ct, ...updated } : ct))
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSocketEvent('contact-unlocked', (data: any) => {
    const updated = data.contact
    queryClient.setQueryData(['contacts', url_id], (formerProps: IContact[] = []) =>
      formerProps.map(ct => (ct._id === updated._id ? { ...ct, ...updated } : ct))
    )
  })

  const contactManager = manager.find(mngr => mngr.url_id == url_id)

  const queryClient = useQueryClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSocketEvent('add-contact', (contact: any) => {
      queryClient.setQueryData(['contacts', url_id], (formerProps: IContact[]) => {
        return [...formerProps, contact]
      })
      updateContactCount(contactManager?._id as string)
      return queryClient.getQueryData(['contacts', url_id]) as contactsArray
    },
    [url_id, contactManager]
  )

  

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

            else{
              queryClient.setQueryData(['contacts', url_id], (formerProps: IContact[]) => {
                return [...formerProps, contact]
              })
              updateContactCount(contactManager?._id as string)
              return queryClient.getQueryData(['contacts', url_id]) as contactsArray
            }

            return [...queryClient.getQueryData(['contacts', url_id]) as contactsArray, contact] as contactsArray 
          },
          edit: async (id, data) => {
            try {
              await update_contact(id, data)
              return edit(id, data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              edit(id, data)
              throw new Error("It didn't edit successfully")
            }
            
          },
          delete: async (listing_id: string, contact_id: string) => {

            try {
              await delete_contact(listing_id, contact_id)
              return remove(contact_id)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              remove(contact_id)
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
