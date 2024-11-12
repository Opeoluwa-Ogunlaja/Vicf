import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
import Layout from './hoc/Layout'
import { checkAuthLoader } from './utils/routeLoaders'
import Create from './pages/Create'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    id: 'root',
    loader: checkAuthLoader,
    children: [
      {
        path: 'create',
        element: <Create />
      }
    ]
  },
  {
    path: '/auth',
    element: <>Dont play</>,
    children: [
      {
        path: 'login',
        element: <>Dont play</>
      },
      {
        path: 'login',
        element: <>Dont play</>
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
