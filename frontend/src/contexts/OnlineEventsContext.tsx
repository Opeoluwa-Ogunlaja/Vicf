import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (...args: any[]) => void
const OnlineEventsContext = createContext<{
  onOnline: (handler: Handler) => void
  onOffline: (handler: Handler) => void
}>({ onOnline: () => {}, onOffline: () => {} })

export default OnlineEventsContext
