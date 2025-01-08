import { defer, LoaderFunction } from 'react-router-dom'
import { queryClient } from '@/queryClient'
import { get_contacts_manager, get_profile } from './requestUtils'
// import { useContactManagerStore } from '@/stores/contactsManagerStore'
// import { ContactManagerEntry } from '@/types/contacts_manager'

export const rootLoader = (async () => {
  let userPromise!: Promise<unknown>
  userPromise = Promise.resolve(null)
  try {
    const userData = queryClient.getQueryData(['user', 'logged_in'])
    if (userData) {
      userPromise = Promise.resolve(userData)
    } else {
      const fetching_promise = queryClient.fetchQuery({
        queryKey: ['user', 'logged_in'],
        queryFn: get_profile
      })

      userPromise = fetching_promise
    }
  } catch (error) {
    userPromise = Promise.reject(error)
  }

  let contactsManagerPromise!: Promise<unknown>
  contactsManagerPromise = Promise.resolve(null)
  try {
    const contactsManagerData = queryClient.getQueryData(['contacts_manager'])
    if (contactsManagerData) {
      contactsManagerPromise = Promise.resolve(contactsManagerData)
    } else {
      const fetching_promise = queryClient.fetchQuery({
        queryKey: ['contacts_manager'],
        queryFn: get_contacts_manager
      })

      contactsManagerPromise = fetching_promise
    }
  } catch (error) {
    contactsManagerPromise = Promise.reject(error)
  }

  contactsManagerPromise.then(() => {
    // const setManager = useContactManagerStore.getState().actions.setManager
    // setManager(contacts_manager as ContactManagerEntry[])
  })

  return defer({ user_promise: userPromise, contacts_manager_promise: contactsManagerPromise })
}) satisfies LoaderFunction

export type rootLoaderType = typeof rootLoader
