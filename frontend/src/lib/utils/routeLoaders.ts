import { defer, LoaderFunction } from 'react-router-dom'
import { queryClient } from '@/queryClient'
import { get_contacts_manager, get_profile, getAccessToken } from './requestUtils'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { IUser, RouteDataType } from '@/types'
import { waitForInterceptor } from './tokenReady'
import { db } from '@/stores/dexie/db'
// import { db } from '@/stores/dexie/db'

export const rootLoader = (_onlineStatus: boolean, setters: RouteDataType) =>
  (async () => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken()
        setters.setToken(token?.token as string)
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error) {
        setters.setToken(' ')
      }
    }

    if (!setters.currentToken.current.trim()) {
      await fetchAccessToken()
      await waitForInterceptor()
    } else console.log('skipped token check')

    let userPromise!: Promise<unknown>
    userPromise = Promise.resolve(null)
    try {
      const userData = queryClient.getQueryData(['user', 'logged_in'])
      if (userData) {
        userPromise = Promise.resolve(userData)
      } else {
        const fetching_promise = _onlineStatus
          ? db.last_user.toCollection().first()
          : queryClient.fetchQuery({
              queryKey: ['user', 'logged_in'],
              queryFn: get_profile
            })

        userPromise = fetching_promise
        userPromise
          .then(
            async data => {
              const user = data as IUser
              setters.login_user({
                _id: user._id,
                name: user?.name,
                email: user?.email,
                profile_photo: user?.profile_photo,
                drive_linked: user?.drive_linked
              })
              await db.last_user.put({
                _id: user._id,
                name: user?.name,
                email: user?.email,
                profile_photo: user?.profile_photo,
                drive_linked: user?.drive_linked
              })
            },
            () => {}
          )
          .finally(() => {
            setters.set_loaded()
            setters.setReady(true)
          })
      }
    } catch (error) {
      userPromise = Promise.reject(error)
    }

    let localContactsManagerPromise!: Promise<unknown>
    localContactsManagerPromise = Promise.resolve(null)
    try {
      const cachedPromise = () => db.managers.toArray()
      const fetching_promise = queryClient.fetchQuery({
        queryKey: ['contacts_manager', Math.random()],
        queryFn: () => get_contacts_manager(setters.currentToken.current),
        networkMode: 'always'
      })

      fetching_promise
        .then(async contact_managers => {
          let myContactManagers: ContactManagerEntry[] = []
          const cachedManagers = await cachedPromise()
          if (Array.isArray(contact_managers) && contact_managers.length > 0) {
            for (const cachedManager of cachedManagers) {
              const presentManager = contact_managers.find(man => man._id == cachedManager._id)
              if (presentManager) {
                await db.managers.update(presentManager._id, {
                  synced: true
                })

                myContactManagers.push(presentManager)
              } else {
                myContactManagers.push(cachedManager)
              }
            }
          } else {
            contact_managers = []
            myContactManagers = cachedManagers
          }
          const merged = Object.values(
            [
              ...contact_managers.map(m => ({ ...m, synced: true })),
              ...myContactManagers.map(m => ({ ...m }))
            ].reduce<Record<string, ContactManagerEntry>>((acc, man) => {
              acc[man._id] = man
              return acc
            }, {})
          )

          // Update state and optionally IndexedDB
          setters?.setManager(merged)
          await db.managers.bulkPut(merged as ContactManagerEntry[])
        })
        .catch(async () => {
          const managers = await cachedPromise()
          setters?.setManager(managers)
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

export const authLoader = (onlineStatus: boolean, setters: RouteDataType) =>
  (async () => {
    console.log(onlineStatus)
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken()
        setters.setToken(token?.token as string)
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error) {
        setters.setToken(' ')
      }
    }

    if (!setters.currentToken.current.trim()) {
      await fetchAccessToken()
      await waitForInterceptor()
    } else console.log('skipped token check')

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

        fetching_promise.finally(() => {
          setters.setReady(true)
        })

        userPromise = fetching_promise
      }
    } catch (error) {
      userPromise = Promise.reject(error)
    }

    return defer({ user_promise: userPromise })
  }) satisfies LoaderFunction

export type authLoaderType = typeof authLoader
