import { useContactManagerStore } from '@/stores/contactsManagerStore'

export const useManagerActions = () => {
  const managerActions = useContactManagerStore(state => state.actions)

  return managerActions
}
