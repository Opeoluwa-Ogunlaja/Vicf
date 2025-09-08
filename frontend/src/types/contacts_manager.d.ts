import { ContactFormType } from '@/lib/utils/form-schemas'

export type Preferences = {
  slug_type: 'title_number' | 'title_hash'
}

export type ContactManagerEntry = {
  _id: string
  name: string
  url_id: string
  backed_up: boolean
  contacts_count: number
  input_backup: string
  preferences?: Preferences
  organisation?: string
}

export type ContactManagerState = {
  manager: ContactManagerEntry[]
}

export type ContactManagerActions = {
  addOrgansisationManagers: (manager: ContactManagerEntry[]) => void
  setManager: (manager: ContactManagerEntry[]) => void
  setPreferences: (id: string, preferences: Partial<Preferences>) => void
  createManager: (data: ContactManagerEntry, upstream?: boolean) => Promise<void>
  updateBackup: (
    id: string,
    backup: Omit<ContactFormType, 'name'>,
    upstream?: boolean
  ) => Promise<void>
  updateListingName: (id: string, newName: string, upstream?: boolean) => Promise<string>
  deleteManager: (id: string, upstream?: boolean) => Promise<void>
  updateListingSlugType: (
    id: string,
    slug_type: 'title_number' | 'title_hash',
    upstream?: boolean
  ) => Promise<string>
  updateContactCount: (id: string, dec?: boolean = false) => void
}

export type ContactManager = ContactManagerState & { actions: ContactManagerActions }
