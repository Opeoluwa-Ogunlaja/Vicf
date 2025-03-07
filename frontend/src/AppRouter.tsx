import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
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

const router = createBrowserRouter([
  {
    path: '/auth',
    loader: authLoader,
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
    loader: rootLoader,
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
