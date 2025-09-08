import { myTaskManager } from '@/lib/taskManager'
import {
  update_contact_input_backup,
  update_contact_name_backup,
  update_manager_slug
} from '@/lib/utils/requestUtils'
import { ContactManager, ContactManagerEntry } from '@/types/contacts_manager'
import { create } from 'zustand'

export const useContactManagerStore = create<ContactManager>()(set => {
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
                  slug_type: preferences.slug_type ?? entry.preferences?.slug_type ?? 'title_number'
                }
              }
            }
            return entry
          })
          return { manager }
        })
      },
      addOrgansisationManagers(managers) {
        set(state => {
          return { manager: [...managers, ...state.manager] as ContactManagerEntry[] }
        })
      },
      async createManager(data, upstream = false) {
        let errorsPresent = false
        const new_manager = await myTaskManager.run('create_listing', true, data)
        const newManagerFlow = async () => {
          try {
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
    async deleteManager(id: string, upstream = false) {
        let errorsPresent = false
        await myTaskManager.run('delete_listing', upstream, id)
        const newManagerFlow = async () => {
          try {
            set(state => {
              return { manager: [...state.manager].filter((manager) => manager._id !== id) as ContactManagerEntry[] }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e: unknown) {
            if (upstream) {
              errorsPresent = true
            }
            set(state => {
              return { manager: [...state.manager].filter((manager) => manager._id !== id) as ContactManagerEntry[] }
            })
          }
        }

        await newManagerFlow()

        if (errorsPresent) throw new Error('Something occured')
      },
      updateContactCount(id, dec) {
        set(state => {
          const manager = state.manager.map(entry => {
            if (entry._id === id) {
              return {
                ...entry,
                contacts_count: !dec ? entry.contacts_count + 1 : entry.contacts_count - 1
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
        let updated_name: string
        let errorsPresent = false
        if (!upstream) updated_name = newName
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

        return updated_name!
      },
      async updateListingSlugType(id, slug_type, upstream = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let errorsPresent = false
        const updateManagerFlow = async () => {
          try {
            if (upstream) await update_manager_slug(id, slug_type)

            set(state => {
              const manager = state.manager.map(entry => {
                if (entry._id === id) {
                  return {
                    ...entry,
                    preferences: { slug_type: slug_type }
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
                    preferences: { slug_type: slug_type }
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

        return slug_type
      }
    }
  }
})
