import { ContactManager } from '@/types/contacts_manager'
import { create } from 'zustand'

export const useContactManagerStore = create<ContactManager>()(set => ({
  manager: [
    {
      url_id: 'abcdef',
      backed_up: false,
      id: '12uwiufew0302rfquu',
      contacts_count: 0,
      last_backup: JSON.stringify({
        number: '08012',
        email: '',
        additional_information: [],
        overwrite: false,
        overwrite_name: '',
        name: 'Classmates'
      }),
      name: 'Classmates'
    }
  ],
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
    },
    createManager(data) {
      set(state => {
        const manager = [...state.manager, data]
        return { manager }
      })
    }
  }
}))
