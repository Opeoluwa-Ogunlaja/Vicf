import { queryClient } from '@/queryClient'
import { get_contact_listing } from '@/lib/utils/requestUtils'
import { defer, LoaderFunction } from 'react-router-dom'
// import { waitForInterceptor } from '@/lib/utils/tokenReady'

export const saveLoader = (async ({ params }) => {
  let contactPromise!: Promise<unknown>
  contactPromise = Promise.resolve(null)
  try {
    const contactsData = queryClient.getQueryData(['contact_listing', params?.id])
    if (contactsData) {
      contactPromise = Promise.resolve(contactsData)
    } else {
      const fetching_promise = queryClient.fetchQuery({
        queryKey: ['contact_listing', params?.id],
        queryFn: () => get_contact_listing(params?.id as string)
      })

      contactPromise = fetching_promise
    }
  } catch (error) {
    contactPromise = Promise.reject(error)
  }

  return defer({ contactPromise })
}) satisfies LoaderFunction
