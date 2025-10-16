import { createContext } from 'react'

const OnlineContext = createContext<{
  isOnline: boolean
  online: boolean
  lastOnline: Date | null
  lastCheck: Date | null
  hasNetwork: boolean
}>({ isOnline: false, online: navigator.onLine, lastOnline: null, lastCheck: null, hasNetwork: navigator.onLine })

export default OnlineContext
