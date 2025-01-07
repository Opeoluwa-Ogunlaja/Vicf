import { queryClient } from '@/queryClient'
import { get_contacts } from '@/utils/requestUtils'
import { defer, LoaderFunction } from 'react-router-dom'

export const saveLoader = (({ params }) => {
  let contactPromise!: Promise<unknown>
  contactPromise = Promise.resolve(null)
  try {
    const contactsData = queryClient.getQueryData(['user', 'logged_in'])
    if (contactsData) {
      contactPromise = Promise.resolve(contactsData)
    } else {
      const fetching_promise = queryClient.fetchQuery({
        queryKey: ['user', 'logged_in'],
        queryFn: () => get_contacts(params?.id as string)
      })

      contactPromise = fetching_promise
    }
  } catch (error) {
    contactPromise = Promise.reject(error)
  }

  return defer({ contactPromise })
}) satisfies LoaderFunction
