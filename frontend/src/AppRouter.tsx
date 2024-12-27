import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
import Layout from './hoc/Layout'
import { rootLoader } from './utils/routeLoaders'
import Create from './pages/create/Create'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import AuthWrapper from './hoc/AuthWrapper'

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
        element: <Create />
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
