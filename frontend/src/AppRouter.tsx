import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC, useMemo } from 'react'
import Layout from './hoc/Layout'
import { authLoader, rootLoader } from './lib/utils/routeLoaders'
import Save from './pages/save/Save'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import AuthWrapper from './hoc/AuthWrapper'
import { saveLoader } from './pages/save/saveLoaders'
import { redirect } from 'react-router-dom'
import { generateListingId } from './lib/utils/idUtils'
import Organisations from './pages/organisations/Organisations'
import { useOnline } from './hooks/useOnline'
import Landing from './pages/landing/Landing'
import { useContactManagerStore } from './stores/contactsManagerStore'
import { ContactManagerActions } from '@/types/contacts_manager'

const router = (
  onlineStatus: boolean,
  setters: { setManager: ContactManagerActions['setManager'] }
) =>
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
  const { isOnline } = useOnline()
  const setManager = useContactManagerStore(state => state.actions.setManager)
  const routerMemoized = useMemo(() => {
    return router(isOnline, {
      setManager: setManager
    })
  }, [isOnline])
  return <RouterProvider router={routerMemoized} />
}

export default AppRouter
