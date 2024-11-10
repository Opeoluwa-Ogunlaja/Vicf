import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <>Na so una dey do for here?</>
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
