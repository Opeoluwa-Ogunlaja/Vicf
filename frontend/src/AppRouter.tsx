import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <>Na so una dey do for here?</>
  }
])

const AppRouter: FC = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
