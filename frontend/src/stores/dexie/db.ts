// db.ts
import { IContact, IUser } from '@/types'
import { ContactManagerEntry } from '@/types/contacts_manager'
import Dexie, { type EntityTable } from 'dexie'

export interface QueuedTask {
  _id: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>
  createdAt: number
  status?: 'idle' | 'processing' | 'done' | 'failed'
  worker?: string
  lockedAt?: number
  attempts?: number
  nextAttemptAt?: number
}

const db = new Dexie('Vicf') as Dexie & {
  managers: EntityTable<ContactManagerEntry, '_id'>
  contacts: EntityTable<IContact, '_id'>,
  queuedTasks: EntityTable<QueuedTask, '_id'>,
  last_user: EntityTable<IUser, '_id'>
}

// Schema declaration:
db.version(2).stores({
  managers:
    '_id, name, age, url_id, backed_up, contacts_count, input_backup, preferences, contacts, synced',
  contacts:
    '_id, number, email, additional_information, name, overwrite_name, time_added, time_updated, contact_group',
  queuedTasks:
    '_id, type, payload, createdAt, status, worker, lockedAt, attempts, nextAttemptAt',
  last_user: 
    '_id, email, name, profile_photo, drive_linked'
})

export { db }
