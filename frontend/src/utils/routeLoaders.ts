import { defer, LoaderFunction, redirect } from 'react-router-dom'
import { queryClient } from '@/queryClient'
import { get_profile_function } from './requestUtils'

export const checkAuthLoader = (() => {
  const userData = queryClient.getQueryData(['user', 'logged_in'])
  if (userData) {
    return defer({ user_promise: Promise.resolve(userData) })
  }

  const fetching_promise = queryClient.fetchQuery({
    queryKey: ['user', 'logged_in'],
    queryFn: get_profile_function
  })

  return defer({ user_promise: fetching_promise.catch(() => redirect('/auth')) })
}) satisfies LoaderFunction

export type checkAuthLoaderType = typeof checkAuthLoader
