import { TokenUpdateContext } from '@/contexts/TokenUpdateContext'
import { useContext } from 'react'

const useTokenUpdate = () => {
  const tokenUpdater = useContext(TokenUpdateContext)

  if (!tokenUpdater) throw new Error('You cannot call this hook outside a user provider')

  return tokenUpdater
}

export default useTokenUpdate
