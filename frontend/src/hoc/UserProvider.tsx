import { TokenContext } from '@/contexts/TokenContext'
import { UserContext } from '@/contexts/UserContext'
import usersStore from '@/stores/usersStore'
import { useState, FC, ReactNode, useLayoutEffect } from 'react'
import { axiosInstance as api } from '@/lib/utils/axiosInstance'
import { getAccessToken } from '@/lib/utils/requestUtils'
import { markInterceptorReady } from '@/lib/utils/tokenReady'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'

const UserProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>('')
  const [store] = useState(usersStore)

  useUpdateEffect(() => {
    const handler = api.interceptors.request.use(config => {
      config.headers.Authorization = !(config as typeof config & { _retry: boolean })._retry
        ? `Bearer ${token}`
        : config.headers.Authorization
      return config
    })

    markInterceptorReady()

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
          } catch (err) {
            setToken(null)
            return Promise.reject(err)
          }
        } else {
          return Promise.reject(error)
        }
      }
    )

    return () => api.interceptors.response.eject(handler)
  }, [token])

  return (
    <UserContext.Provider value={store}>
      <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
    </UserContext.Provider>
  )
}

export default UserProvider
