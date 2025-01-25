import { SocketActionsContext } from '@/contexts/SocketActionsContext'

import { useContext } from 'react'

export const useSocketActions = () => {
  const ctx = useContext(SocketActionsContext)

  if (!ctx) throw new Error('You have to be in a context provider to use this context')

  return ctx
}
