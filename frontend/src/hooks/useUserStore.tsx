import { UserContext } from '@/contexts/UserContext'
import { useContext } from 'react'
import { useStore } from 'zustand'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUserStore = (selector: (unknown: any) => unknown) => {
  const store = useContext(UserContext)
  if (!store || Object.keys(store).length == 0) {
    throw new Error('Missing User Provider')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useStore(store as any, selector)
}
