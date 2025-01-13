import { FC } from 'react'
import './App.css'
import AppRouter from './AppRouter'
import SidenavProvider from './hoc/SidenavProvider'
import UserProvider from './hoc/UserProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GClient } from './config'
import 'react-loading-skeleton/dist/skeleton.css'
import { Toaster } from './components/ui/toaster'

const App: FC = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={GClient}>
        <UserProvider>
          <SidenavProvider>
            <AppRouter />
            <Toaster />
          </SidenavProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
