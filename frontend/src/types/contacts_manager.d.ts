export type Preferences = {
  slug_type: string
}

export type ContactManagerEntry = {
  id: string
  name: string
  url_id: string
  backed_up: boolean
  contacts_count: number
  last_backup: string
  preferences?: Preferences
}

export type ContactManagerState = {
  manager: ContactManagerEntry[]
}

export type ContactManagerActions = {
  setManager: (manager: ContactManagerEntry[]) => void
  setPreferences: (id: string, preferences: Partial<Preferences>) => void
  createManager: (data: ContactManagerEntry) => void
}

export type ContactManager = ContactManagerState & { actions: ContactManagerActions }
