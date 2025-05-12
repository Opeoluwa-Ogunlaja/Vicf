import OnlineEventsContext from '@/contexts/OnlineEventsContext'
import { useContext } from 'react'

export const useOnlineEvents = () => {
  if (!OnlineEventsContext)
    throw new Error('Use Online must be called in an online events provider')
  return useContext(OnlineEventsContext)
}
