import {
  create_contact_listing,
  update_contact_input_backup,
  update_contact_name_backup
} from '@/lib/utils/requestUtils'
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
      async createManager(data, upstream = false) {
        let errorsPresent = false
        let new_manager = !upstream && data
        const newManagerFlow = async () => {
          try {
            if (upstream) {
              new_manager = await create_contact_listing({
                url_id: data.url_id,
                name: data.name,
                input_backup: data.input_backup
              })
            }

            set(state => {
              return { manager: [new_manager, ...state.manager] as ContactManagerEntry[] }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e: unknown) {
            if (upstream) {
              errorsPresent = true
            }
            set(state => {
              return { manager: [new_manager, ...state.manager] as ContactManagerEntry[] }
            })
          }
        }

        await newManagerFlow()

        if (errorsPresent) throw new Error('Something occured')
      },
      updateContactCount(id) {
        set(state => {
          const manager = state.manager.map(entry => {
            if (entry._id === id) {
              return {
                ...entry,
                contacts_count: entry.contacts_count + 1
              }
            }
            return entry
          })
          return { manager }
        })
      },
      async updateBackup(id, backup, upstream = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let updated_backup: any
        let errorsPresent = false
        updated_backup = !upstream && backup
        const updateManagerFlow = async () => {
          try {
            if (upstream) updated_backup = await update_contact_input_backup(id, backup)

            set(state => {
              const manager = state.manager.map(entry => {
                if (entry._id === id) {
                  return {
                    ...entry,
                    input_backup: JSON.stringify({ ...updated_backup, name: undefined })
                  }
                }
                return entry
              })
              return { manager }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            errorsPresent = true
            set(state => {
              const manager = state.manager.map(entry => {
                if (entry._id === id) {
                  return {
                    ...entry,
                    input_backup: JSON.stringify({ ...updated_backup, name: undefined })
                  }
                }
                return entry
              })
              return { manager }
            })
          }
        }

        await updateManagerFlow()

        if (errorsPresent) throw new Error('There was an error updating the listing')
      },
      async updateListingName(id, newName, upstream = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let updated_name: any
        let errorsPresent = false
        updated_name = !upstream && newName
        const updateManagerFlow = async () => {
          try {
            if (upstream) updated_name = await update_contact_name_backup(id, newName)

            set(state => {
              const manager = state.manager.map(entry => {
                if (entry._id === id) {
                  return {
                    ...entry,
                    name: updated_name
                  }
                }
                return entry
              })
              return { manager }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            errorsPresent = true
            set(state => {
              const manager = state.manager.map(entry => {
                if (entry._id === id) {
                  return {
                    ...entry,
                    name: updated_name
                  }
                }
                return entry
              })
              return { manager }
            })
          }
        }

        await updateManagerFlow()

        if (errorsPresent) throw new Error('There was an error updating the listing')
      }
    }
  }
})
