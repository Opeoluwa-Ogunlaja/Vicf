import { defer, LoaderFunction } from 'react-router-dom'
import { wait } from './promiseUtils'

export const checkAuthLoader = (async () => {
  const promise = wait(2000, { name: 'Opeoluwa' })

  return defer({ promise })
}) satisfies LoaderFunction

export type checkAuthLoaderType = typeof checkAuthLoader
