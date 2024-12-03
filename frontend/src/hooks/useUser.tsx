import { IUserState } from '@/types/user'
import { useUserStore } from './useUserStore'
import { useShallow } from 'zustand/react/shallow'

export const useUser = () =>
  useUserStore(
    useShallow(state => {
      return { user: state.user, loggedIn: state.loggedIn, isPending: state.isPending }
    })
  ) as Omit<IUserState, 'actions'>
