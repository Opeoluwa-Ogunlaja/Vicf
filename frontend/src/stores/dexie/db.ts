// db.ts
import { IContact } from '@/types'
import { ContactManagerEntry } from '@/types/contacts_manager'
import Dexie, { type EntityTable } from 'dexie'

const db = new Dexie('FriendsDatabase') as Dexie & {
  managers: EntityTable<ContactManagerEntry, '_id'>
  contacts: EntityTable<IContact, '_id'>
}

// Schema declaration:
db.version(1).stores({
  managers: '++_id, name, age, url_id, backed_up, contacts_count, input_backup, preferences',
  contacts:
    '++_id, number, email, additional_information, name, overwrite_name, time_added, time_updated'
})

export { db }
