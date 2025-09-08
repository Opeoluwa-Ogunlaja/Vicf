import { BgPatternImage } from '@/assets/images'
import { Suspense, useLayoutEffect } from 'react'
import { Await, Navigate, Outlet, useRouteLoaderData } from 'react-router-dom'
import { IUser } from '@/types/user'
import LoadingScreen from '@/components/LoadingScreen'
import { useUserUpdate } from '@/hooks/useUserUpdate'

const AuthWrapper = () => {
  const { user_promise } = useRouteLoaderData('auth') as { user_promise: Promise<IUser | null> }

  const { login_user } = useUserUpdate()
  useLayoutEffect(() => {
  
    document.body.classList.replace('blockLayout', 'authLayout')
    document.body.classList.add('authLayout')

  })
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
          {({ user }) => {
            login_user({ email: user.email, _id: user._id, name: user.name, profile_photo: user.profile_photo })
            return <Navigate replace to={'/home'} />
        }}
        </Await>
      </Suspense>
    </>
  )
}

export default AuthWrapper
