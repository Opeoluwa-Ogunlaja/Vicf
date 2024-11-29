import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
import Layout from './hoc/Layout'
import { checkAuthLoader } from './utils/routeLoaders'
import Create from './pages/Create'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthWrapper from './hoc/AuthWrapper'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    id: 'root',
    loader: checkAuthLoader,
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
    element: <AuthWrapper />,
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
