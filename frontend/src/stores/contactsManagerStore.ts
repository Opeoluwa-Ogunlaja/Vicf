import { myTaskManager } from '@/lib/taskManager'
import {
  update_contact_input_backup,
  update_contact_name_backup,
  update_manager_slug
} from '@/lib/utils/requestUtils'
import { ContactManager, ContactManagerEntry } from '@/types/contacts_manager'
import { create } from 'zustand'
import { queryClient } from '@/queryClient'
import { generateTaskId } from '@/lib/utils/idUtils'

export const useContactManagerStore = create<ContactManager>()(set => {
  return {
    manager: [],
    actions: {
      setManager(managers: ContactManagerEntry[]) {
        const deduped = Array.from(
          managers
            .reduce<Map<string, ContactManagerEntry>>((map, m) => {
              map.set(m._id, m)
              return map
            }, new Map())
            .values()
        )
        return set({ manager: deduped })
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
      async updateManagerOrganisation(id, newOrganisationId, upstream) {
        let errorsPresent = false
        let pastOrganisation!: string | null
        // let listingIndex!: number | null
        const updated = await myTaskManager.run(
          generateTaskId(),
          'move_listing',
          true,
          id,
          newOrganisationId
        )
        const updateManagerFlow = async () => {
          try {
            set(state => {
              const manager = state.manager.map(entry => {
                if ((updated as ContactManagerEntry)._id === id) {
                  pastOrganisation = entry.organisation?._id ?? null
                  // listingIndex = i ?? null
                  return {
                    ...entry,
                    organisation: (updated as ContactManagerEntry).organisation!
                  }
                }
                return entry
              })
              return { manager }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e: unknown) {
            if (upstream) {
              errorsPresent = true
            }
          }
        }

        await updateManagerFlow()

        if (pastOrganisation && pastOrganisation != newOrganisationId) {
          queryClient.invalidateQueries({ queryKey: ['organisation', pastOrganisation] })
          queryClient.invalidateQueries({ queryKey: ['organisation', newOrganisationId] })
        }

        if (errorsPresent) throw new Error('Something occured')
      },
      async updateManagerOrganisationDisplay(id, newOrgId, newOrgName) {
        set(state => {
          const manager = state.manager.map(entry => {
            if (entry._id === id) {
              return {
                ...entry,
                organisation: {
                  _id: newOrgId,
                  name: newOrgName
                }
              }
            }
            return entry
          })
          return { manager }
        })
      },
      async createManager(data, upstream) {
        const new_manager = await myTaskManager.run(
          generateTaskId(),
          'create_listing',
          upstream,
          data
        )

        set(state => {
          return { manager: [new_manager, ...state.manager] as ContactManagerEntry[] }
        })
      },

      async syncManager(id, data) {
        set(state => {
          const manager = state.manager.map(entry => {
            if (entry._id === id && !entry.synced) {
              return { ...data, synced: true }
            }
            return entry
          })
          return { manager }
        })
      },
      async deleteManager(id: string, upstream = false) {
        let errorsPresent = false
        await myTaskManager.run(generateTaskId(), 'delete_listing', upstream, id)
        const newManagerFlow = async () => {
          try {
            set(state => {
              return {
                manager: [...state.manager].filter(
                  manager => manager._id !== id
                ) as ContactManagerEntry[]
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e: unknown) {
            if (upstream) {
              errorsPresent = true
            }
            set(state => {
              return {
                manager: [...state.manager].filter(
                  manager => manager._id !== id
                ) as ContactManagerEntry[]
              }
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
      setEditors(id, editors) {
        const colors = ['blue', 'green', 'yellow', 'red', 'cyan']
        set(state => {
          const manager = state.manager.map(entry => {
            if (entry._id === id) {
              return {
                ...entry,
                users_editing: editors!.map(e => ({
                  ...e,
                  color: colors[Math.floor(Math.random() * colors.length)]
                })) as [typeof editors][0]
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
