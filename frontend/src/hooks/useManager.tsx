import { useContactManagerStore } from '@/stores/contactsManagerStore'

export const useManager = () => {
  const manager = useContactManagerStore(state => state.manager)

  return manager
}
