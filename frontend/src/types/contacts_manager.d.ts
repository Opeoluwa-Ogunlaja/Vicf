import { ContactFormType } from '@/lib/utils/form-schemas'

export type Preferences = {
  slug_type: string
}

export type ContactManagerEntry = {
  _id: string
  name: string
  url_id: string
  backed_up: boolean
  contacts_count: number
  input_backup: string
  preferences?: Preferences
}

export type ContactManagerState = {
  manager: ContactManagerEntry[]
}

export type ContactManagerActions = {
  setManager: (manager: ContactManagerEntry[]) => void
  setPreferences: (id: string, preferences: Partial<Preferences>) => void
  createManager: (data: ContactManagerEntry, upstream?: boolean) => Promise<void>
  updateBackup: (
    id: string,
    backup: Omit<ContactFormType, 'name'>,
    upstream?: boolean
  ) => Promise<void>
  updateListingName: (id: string, newName: string, upstream?: boolean) => Promise<string>
  updateContactCount: (id: string, dec?: boolean = false) => void
}

export type ContactManager = ContactManagerState & { actions: ContactManagerActions }
