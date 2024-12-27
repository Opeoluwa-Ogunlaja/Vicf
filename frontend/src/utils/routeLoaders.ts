import { defer, LoaderFunction } from 'react-router-dom'
import { queryClient } from '@/queryClient'
import { get_profile } from './requestUtils'

export const rootLoader = (async () => {
  try {
    const userData = queryClient.getQueryData(['user', 'logged_in'])
    if (userData) {
      return defer({ user_promise: Promise.resolve(userData) })
    }

    const fetching_promise = queryClient.fetchQuery({
      queryKey: ['user', 'logged_in'],
      queryFn: get_profile
    })

    return defer({ user_promise: fetching_promise })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return defer({ user_promise: Promise.reject(error) })
  }
}) satisfies LoaderFunction

export type rootLoaderType = typeof rootLoader
