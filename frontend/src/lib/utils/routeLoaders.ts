import { defer, LoaderFunction } from 'react-router-dom'
import { queryClient } from '@/queryClient'
import { get_contacts_manager, get_profile, getAccessToken } from './requestUtils'
import { ContactManagerActions, ContactManagerEntry } from '@/types/contacts_manager'
import { Dispatch } from 'react'
import { useUserUpdate } from '@/hooks/useUserUpdate'
import { IUser } from '@/types'
import { axiosInstance as api } from '@/lib/utils/axiosInstance'
// import { db } from '@/stores/dexie/db'

export const rootLoader = (
  _onlineStatus: boolean,
  setters: {
    setManager: ContactManagerActions['setManager']
    setToken: Dispatch<string | null>
  } & Pick<ReturnType<typeof useUserUpdate>, 'login_user' | 'set_loaded'>
) =>
  (async () => {
    let token_cache!: string

    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken()
        token_cache = token.token
        setters.setToken(token.token)
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error) {
        setters.setToken(null)
      }
    }

    await fetchAccessToken()

    api.interceptors.request.use(config => {
      config.headers.Authorization = !(config as typeof config & { _retry: boolean })._retry
        ? `Bearer ${token_cache}`
        : config.headers.Authorization
      return config
    })

    api.interceptors.response.use(
      response => response,
      async function (error) {
        const originalRequest = error.config
        if (error.response.status === 403 && error.response.data.message === 'Access Expired') {
          try {
            const tokenResponse = await getAccessToken()
            setters.setToken(tokenResponse.token)

            originalRequest.headers.Authorization = `Bearer ${tokenResponse.token}`
            originalRequest._retry = true
            return api(originalRequest)
          } catch (err) {
            setters.setToken(null)
            return Promise.reject(err)
          }
        } else {
          return Promise.reject(error)
        }
      }
    )

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
        userPromise
          .then(
            data => {
              const user = data as IUser
              setters.login_user({
                name: user?.name,
                email: user?.email
              })
            },
            () => {}
          )
          .finally(() => {
            setters.set_loaded()
          })
      }
    } catch (error) {
      userPromise = Promise.reject(error)
    }

    let localContactsManagerPromise!: Promise<unknown>
    localContactsManagerPromise = Promise.resolve(null)
    try {
      const fetching_promise = queryClient.fetchQuery({
        queryKey: ['contacts_manager'],
        queryFn: get_contacts_manager,
        staleTime: Infinity
      })
      fetching_promise.then(contacts_manager => {
        if ((contacts_manager as Array<unknown>)?.length > 0) {
          setters?.setManager(contacts_manager as ContactManagerEntry[])
        }
      })

      localContactsManagerPromise = fetching_promise
    } catch (error) {
      localContactsManagerPromise = Promise.reject(error)
    }

    return defer({
      user_promise: Promise.resolve().then(() => userPromise),
      contacts_manager_promise: localContactsManagerPromise
    })
  }) satisfies LoaderFunction

export type rootLoaderType = typeof rootLoader

export const authLoader = (onlineStatus: boolean) =>
  (async () => {
    console.log(onlineStatus)
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
