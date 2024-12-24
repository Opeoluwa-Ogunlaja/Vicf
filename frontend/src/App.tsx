import { FC } from 'react'
import './App.css'

import AppRouter from './AppRouter'
import SidenavProvider from './hoc/SidenavProvider'
import UserProvider from './hoc/UserProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GClient } from './config'

const App: FC = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={GClient}>
        <UserProvider>
          <SidenavProvider>
            <AppRouter />
          </SidenavProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
