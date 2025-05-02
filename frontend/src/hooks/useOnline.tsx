import OnlineContext from '@/contexts/OnlineContext'
import { useContext } from 'react'

export const useOnline = () => {
  if (!OnlineContext) throw new Error('Use Online must be called in an online controller')
  return useContext(OnlineContext)
}
