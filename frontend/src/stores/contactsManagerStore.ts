import { create_contact_listing } from '@/lib/utils/requestUtils'
import { ContactManager, ContactManagerEntry } from '@/types/contacts_manager'
import { create } from 'zustand'
// import { produce, Draft } from 'immer'
export const useContactManagerStore = create<ContactManager>()(set => {
  // const setState = async <T extends ContactManager = ReturnType<typeof get>>(
  //   fn: (state: Draft<T>) => void,
  //   get: () => T,
  //   _set: typeof set
  // ): Promise<void> => {
  //   const currentState = get()
  //   const newState = await produce(currentState, fn)
  //   _set(newState as T)
  // }
  return {
    manager: [],
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
        const newManagerFlow = async () => {
          const new_manager = await create_contact_listing({
            url_id: data.url_id,
            name: data.name,
            input_backup: data.input_backup
          })

          set(state => {
            return { manager: [new_manager, ...state.manager] as ContactManagerEntry[] }
          })

          // setState(
          //   state => {
          //     state.manager = [new_manager, ...state.manager] as ContactManagerEntry[]
          //   },
          //   get,
          //   set
          // )
        }

        newManagerFlow()
      },
      updateBackup(id, backup) {
        set(state => {
          const manager = state.manager.map(entry => {
            if (entry._id === id) {
              return {
                ...entry,
                input_backup: JSON.stringify({ ...backup, name: undefined })
              }
            }
            return entry
          })
          return { manager }
        })
      }
    }
  }
})
