import { createContext } from 'react'

const OnlineContext = createContext<{
  isOnline: boolean
  online: boolean
  lastOnline: Date | null
  lastCheck: Date | null
}>({ isOnline: false, online: false, lastOnline: null, lastCheck: null })

export default OnlineContext
