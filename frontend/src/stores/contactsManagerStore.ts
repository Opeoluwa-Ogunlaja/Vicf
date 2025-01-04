import { ContactManager } from '@/types/contacts_manager'
import { create } from 'zustand'

export const useContactManagerStore = create<ContactManager>()(set => ({
  manager: [],
  actions: {
    setManager(manager) {
      set({ manager })
    },
    setPreferences(id, preferences) {
      set(state => {
        const manager = state.manager.map(entry => {
          if (entry.id === id) {
            return {
              ...entry,
              preferences: {
                ...entry.preferences,
                ...preferences,
                slug_type: preferences.slug_type ?? entry.preferences?.slug_type ?? ''
              }
            }
          }
          return entry
        })
        return { manager }
      })
    }
  }
}))
