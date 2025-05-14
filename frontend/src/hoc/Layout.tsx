import LoadingScreen from '@/components/LoadingScreen'
import { Suspense } from 'react'
import { Await, Outlet, useRouteLoaderData } from 'react-router-dom'
import { IUser } from '@/types/user'

const LayoutContent = () => {
  return <Outlet />
}

const Layout = () => {
  const { user_promise } = useRouteLoaderData('root') as { user_promise: Promise<IUser | null> }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={user_promise} errorElement={<LayoutContent />}>
        {() => {
          return <LayoutContent />
        }}
      </Await>
    </Suspense>
  )
}

export default Layout
