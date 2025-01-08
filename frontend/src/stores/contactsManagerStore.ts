import { generateMongoId } from '@/lib/utils/idUtils'
import { ContactManager } from '@/types/contacts_manager'
import { create } from 'zustand'

export const useContactManagerStore = create<ContactManager>()(set => ({
  manager: [
    {
      url_id: 'abcdef',
      backed_up: false,
      _id: generateMongoId(),
      contacts_count: 0,
      last_backup: JSON.stringify({
        number: '08012',
        email: '',
        additional_information: { Level: 200 },
        overwrite: false,
        overwrite_name: ''
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
          if (entry._id === id) {
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
        console.log(state)
        const manager = [...state.manager, data]
        console.log(manager)
        return { manager }
      })
    },
    updateBackup(id, backup) {
      set(state => {
        const manager = state.manager.map(entry => {
          if (entry._id === id) {
            return {
              ...entry,
              last_backup: JSON.stringify({ ...backup, name: undefined })
            }
          }
          return entry
        })
        return { manager }
      })
    }
  }
}))
