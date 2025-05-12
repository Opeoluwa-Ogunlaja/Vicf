import { TokenContext } from '@/contexts/TokenContext'
import { UserContext } from '@/contexts/UserContext'
import { axiosInstance as api } from '@/lib/utils/axiosInstance'
import { get_profile, getAccessToken } from '@/lib/utils/requestUtils'
import usersStore from '@/stores/usersStore'
import { useQuery } from '@tanstack/react-query'
import { useState, FC, ReactNode, useLayoutEffect, useEffect } from 'react'
import { useStore } from 'zustand'

const UserProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>('')
  const [store] = useState(usersStore)
  const { login_user, set_loaded } = useStore(usersStore, state => state.actions)
  const [requestEnabled, enableRequest] = useState(false)
  const { data, error, isPending } = useQuery({
    queryKey: ['user', 'logged_in'],
    queryFn: get_profile,
    staleTime: Infinity,
    enabled: requestEnabled,
    retry: false
  })

  console.log(isPending)

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken()
        setToken(token.token)
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error) {
        setToken(null)
      }
      enableRequest(true)
    }

    fetchAccessToken()
  }, [])

  useEffect(() => {
    if (!isPending) {
      if (!error) {
        login_user({
          name: data?.name,
          email: data?.email
        })
      }
      set_loaded()
    }
  }, [isPending, error, data, login_user, set_loaded])

  useLayoutEffect(() => {
    const handler = api.interceptors.request.use(config => {
      config.headers.Authorization = !(config as typeof config & { _retry: boolean })._retry
        ? `Bearer ${token}`
        : config.headers.Authorization
      return config
    })

    return () => {
      api.interceptors.request.eject(handler)
    }
  }, [token])

  useLayoutEffect(() => {
    const handler = api.interceptors.response.use(
      response => response,
      async function (error) {
        const originalRequest = error.config
        if (error.response.status === 403 && error.response.data.message === 'Access Expired') {
          try {
            const tokenResponse = await getAccessToken()
            setToken(tokenResponse.token)

            originalRequest.headers.Authorization = `Bearer ${tokenResponse.token}`
            originalRequest._retry = true
            return api(originalRequest)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            setToken(null)
          }
        }
      }
    )

    return () => {
      api.interceptors.response.eject(handler)
    }
  }, [token])

  return (
    <UserContext.Provider value={store}>
      <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
    </UserContext.Provider>
  )
}

export default UserProvider
