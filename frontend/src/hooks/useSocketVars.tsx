import { SocketVarsContext } from '@/contexts/SocketVarsContext'

import { useContext } from 'react'

export const useSocketVars = () => {
  const ctx = useContext(SocketVarsContext)

  if (!ctx) throw new Error('You have to be in a context provider to use this context')

  return ctx
}
