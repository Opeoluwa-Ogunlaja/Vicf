import { defer, LoaderFunction } from 'react-router-dom'
import { queryClient } from '@/queryClient'
import { get_contacts_manager, get_profile } from './requestUtils'
import { useContactManagerStore } from '@/stores/contactsManagerStore'
import { ContactManagerEntry } from '@/types/contacts_manager'

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
    const fetching_promise = queryClient.fetchQuery({
      queryKey: ['contacts_manager'],
      queryFn: get_contacts_manager,
      staleTime: 0
    })
    fetching_promise.then(contacts_manager => {
      if ((contacts_manager as Array<unknown>)?.length > 0) {
        const setManager = useContactManagerStore.getState().actions.setManager
        setManager(contacts_manager as ContactManagerEntry[])
      }
    })

    contactsManagerPromise = fetching_promise
  } catch (error) {
    contactsManagerPromise = Promise.reject(error)
  }

  return defer({ user_promise: userPromise, contacts_manager_promise: contactsManagerPromise })
}) satisfies LoaderFunction

export type rootLoaderType = typeof rootLoader

export const authLoader = (async () => {
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

  return defer({ user_promise: userPromise })
}) satisfies LoaderFunction

export type authLoaderType = typeof authLoader
