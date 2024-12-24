import LoadingScreen from '@/components/LoadingScreen'
import { useUser } from '@/hooks/useUser'
import { useUserUpdate } from '@/hooks/useUserUpdate'
import { useWebSocketStore } from '@/hooks/useWebsocketStore'
import { IUser, PartialUser } from '@/types/user'
import { Suspense, FC, useLayoutEffect, useRef, useEffect } from 'react'
import { Await, Outlet, useRouteLoaderData } from 'react-router-dom'

const LayoutContent: FC<{ user?: PartialUser }> = () => {
  const { isPending } = useUser()
  const { connect } = useWebSocketStore()

  useEffect(() => {
    connect('http://localhost:3002')
  }, [connect])

  return !isPending ? <Outlet /> : <LoadingScreen />
  // return <Outlet />
}

const Layout = () => {
  const { user_promise } = useRouteLoaderData('root') as { user_promise: Promise<IUser | null> }
  const { login_user, set_loaded } = useUserUpdate()

  const isMounted = useRef(true)

  useLayoutEffect(() => {
    isMounted.current = true
    if (user_promise) {
      user_promise
        .then(user => {
          if (isMounted.current && user) {
            // Update global state only if component is mounted
            login_user({
              name: user?.name,
              email: user?.email
            })
          }
        })
        .catch(() => set_loaded())
    }
    return () => {
      isMounted.current = false
    }
  }, [user_promise, login_user, set_loaded])
  // }, [])

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={user_promise} errorElement={<LayoutContent />}>
        {({ user }: { user: PartialUser }) => {
          return <LayoutContent user={user} />
        }}
      </Await>
    </Suspense>
  )
}

export default Layout
