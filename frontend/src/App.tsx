import { FC, useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import LoadingScreen from './components/LoadingScreen'
import SyncProvider from './hoc/SyncProvider';


const App: FC = () => {
  const [ready, setReady] = useState(false)
  return (
    <>
      {!ready && <LoadingScreen />}
      <GoogleOAuthProvider clientId={GClient}>
        <UserProvider>
          <SocketProvider>
              <OnlineProvider>
                <SyncProvider>
                <SidenavProvider>
                  <AppRouter setReady={setReady} />
                  <Toaster />
                </SidenavProvider>
                </SyncProvider>
            </OnlineProvider>
          </SocketProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
