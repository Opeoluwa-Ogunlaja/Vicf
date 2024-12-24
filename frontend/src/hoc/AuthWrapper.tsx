import { BgPatternImage } from '@/assets/images'
import { Suspense } from 'react'
import { Await, Navigate, Outlet, useRouteLoaderData } from 'react-router-dom'
import { IUser } from '@/types/user'
import LoadingScreen from '@/components/LoadingScreen'

const AuthWrapper = () => {
  const { user_promise } = useRouteLoaderData('auth') as { user_promise: Promise<IUser | null> }

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Await
          resolve={user_promise}
          errorElement={
            <main className="auth-wrapper grid h-full self-stretch max-md:order-2">
              <Outlet />
              <div
                className="patterns-bg relative bg-secondary max-lg:-z-30 max-lg:opacity-15 max-md:order-1"
                style={{ background: `url(${BgPatternImage})` }}
              ></div>
            </main>
          }
        >
          {() => {
            return <Navigate replace to={'/'} />
          }}
        </Await>
      </Suspense>
    </>
  )
}

export default AuthWrapper
