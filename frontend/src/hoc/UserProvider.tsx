import { TokenContext } from '@/contexts/TokenContext'
import { UserContext } from '@/contexts/UserContext'
import usersStore from '@/stores/usersStore'
import { useState, FC, ReactNode, useLayoutEffect, useEffect, useRef } from 'react'
import { axiosInstance as api } from '@/lib/utils/axiosInstance'
import { getAccessToken } from '@/lib/utils/requestUtils'
import { markInterceptorReady } from '@/lib/utils/tokenReady'

const UserProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [token, setToken] = useState<string>('')
  const [store] = useState(usersStore)
  const tokenRef = useRef<typeof token>(token)

  useEffect(() => {
    tokenRef.current = token
  }, [token])

  useEffect(() => {
    let handler: number | undefined
    if (token) {
      handler = api.interceptors.request.use(config => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.headers.Authorization = !(config as any)._retry
          ? `Bearer ${tokenRef.current}`
          : config.headers.Authorization
        return config
      })
      console.log('whatsup na')
      markInterceptorReady()
    }

    return () => {
      if (handler !== undefined) {
        api.interceptors.request.eject(handler)
      }
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
            setToken(tokenResponse?.token || ' ')

            originalRequest.headers.Authorization = `Bearer ${tokenResponse?.token}`
            originalRequest._retry = true
            return api(originalRequest)
          } catch (err) {
            setToken('')
            return Promise.reject(err)
          }
        } else {
          return Promise.reject(error)
        }
      }
    )

    return () => api.interceptors.response.eject(handler)
  }, [setToken])

  return (
    <UserContext.Provider value={store}>
      <TokenContext.Provider value={{ token: tokenRef, setToken }}>
        {children}
      </TokenContext.Provider>
    </UserContext.Provider>
  )
}

export default UserProvider
