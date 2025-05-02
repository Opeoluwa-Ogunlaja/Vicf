import { FC } from 'react'
import './App.css'
import AppRouter from './AppRouter'
import SidenavProvider from './hoc/SidenavProvider'
import UserProvider from './hoc/UserProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GClient } from './config'
import 'react-loading-skeleton/dist/skeleton.css'
import { Toaster } from './components/ui/toaster'
import OnlineProvider from './hoc/OnlineProvider'
import SocketProvider from './hoc/SocketProvider'

const App: FC = () => {
  return (
    <GoogleOAuthProvider clientId={GClient}>
      <UserProvider>
        <SocketProvider>
          <OnlineProvider>
            <SidenavProvider>
              <AppRouter />
              <Toaster />
            </SidenavProvider>
          </OnlineProvider>
        </SocketProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  )
}

export default App
