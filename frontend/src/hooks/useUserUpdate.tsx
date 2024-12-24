import { IUserState } from '@/types/user'
import { useUserStore } from './useUserStore'

export const useUserUpdate = () => useUserStore(state => state.actions) as IUserState['actions']
