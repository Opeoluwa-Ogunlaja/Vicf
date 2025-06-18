import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC, lazy, memo, Suspense, useMemo } from 'react'
import { authLoader, rootLoader } from './lib/utils/routeLoaders'
import { saveLoader } from './pages/save/saveLoaders'
import { redirect } from 'react-router-dom'
import { generateListingId } from './lib/utils/idUtils'

// import { useOnline } from './hooks/useOnline'

import { useContactManagerStore } from './stores/contactsManagerStore'
import useToken from './hooks/useToken'
import { useUserUpdate } from './hooks/useUserUpdate'
import { RouteDataType } from './types'
import LoadingScreen from './components/LoadingScreen'

const Layout = lazy(() => import('./hoc/Layout'))
const Save = lazy(() => import('./pages/save/Save'))
const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/login/Login'))
const Signup = lazy(() => import('./pages/signup/Signup'))
const AuthWrapper = lazy(() => import('./hoc/AuthWrapper'))
const Landing = lazy(() => import('./pages/landing/Landing'))
const Organisations = lazy(() => import('./pages/organisations/Organisations'))

const router = (onlineStatus: boolean, setters: RouteDataType) =>
  createBrowserRouter(
    [
      {
        path: '/auth',
        loader: authLoader(onlineStatus),
        element: <AuthWrapper />,
        id: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'signup',
            element: <Signup />
          },
          {
            path: '',
            element: <Login />
          }
        ]
      },
      {
        path: '/',
        element: <Layout />,
        id: 'root',
        loader: rootLoader(onlineStatus, setters),
        // shouldRevalidate: () => {
        //   return true
        // },
        children: [
          {
            path: 'save',
            children: [
              {
                path: ':id',
                loader: saveLoader,
                element: <Save key={window.location.pathname} />
              },
              {
                path: '',
                loader: () => redirect(`/save/${generateListingId()}?new=true`)
              }
            ]
          },
          {
            path: 'organisations',
            element: <Organisations />
          },
          {
            path: 'home',
            element: <Home />
          },
          {
            path: '',
            element: <Landing />
          }
        ]
      },
      {
        path: '*',
        element: <>How you take dey loss for this level</>
      }
    ],
    {}
  )

const AppRouter: FC = () => {
  // const { isOnline } = useOnline()
  const setManager = useContactManagerStore(state => state.actions.setManager)
  const { setToken, token } = useToken()
  const { login_user, set_loaded } = useUserUpdate()
  const routerMemoized = useMemo(() => {
    return router(true, {
      currentToken: token!,
      setManager: setManager,
      setToken: setToken,
      login_user,
      set_loaded
    })
  }, [setToken, setManager, login_user, set_loaded, token])

  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={routerMemoized} />
    </Suspense>
  )
}

export default memo(AppRouter)
