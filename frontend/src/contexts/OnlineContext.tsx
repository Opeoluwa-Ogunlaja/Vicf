import { createContext } from 'react'

const OnlineContext = createContext<{
  isOnline: boolean
  lastOnline: Date | null
  lastCheck: Date | null
}>({ isOnline: false, lastOnline: null, lastCheck: null })

export default OnlineContext
