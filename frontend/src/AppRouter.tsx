import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
import Layout from './hoc/Layout'
import { rootLoader } from './lib/utils/routeLoaders'
import Save from './pages/save/Save'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import AuthWrapper from './hoc/AuthWrapper'
import { saveLoader } from './pages/save/saveLoaders'
import { redirect } from 'react-router-dom'
import { generateListingId } from './lib/utils/idUtils'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    id: 'root',
    loader: rootLoader,
    shouldRevalidate: ({ currentUrl, nextUrl, defaultShouldRevalidate }) => {
      if (currentUrl.pathname == '/save' && nextUrl.pathname == '/save') return false
      return defaultShouldRevalidate
    },
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
        path: '',
        element: <Home />
      }
    ]
  },
  {
    path: '/auth',
    loader: rootLoader,
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
    path: '*',
    element: <>How you take dey loss for this level</>
  }
])

const AppRouter: FC = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
