import { FC } from 'react'
import './App.css'

import AppRouter from './AppRouter'
import SidenavProvider from './hoc/SidenavProvider'
import UserProvider from './hoc/UserProvider'

const App: FC = () => {
  return (
    <>
      <UserProvider>
        <SidenavProvider>
          <AppRouter />
        </SidenavProvider>
      </UserProvider>
    </>
  )
}

export default App
