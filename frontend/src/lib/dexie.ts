import Dexie, { Table } from 'dexie'

export interface QueuedTask {
  id: string
  type: string
  payload: any
  createdAt: number
}

class AppDB extends Dexie {
  queuedTasks!: Table<QueuedTask, string>

  constructor() {
    super('AppDB')
    this.version(1).stores({
      queuedTasks: 'id, type, createdAt'
    })
  }
}

export const db = new AppDB()
