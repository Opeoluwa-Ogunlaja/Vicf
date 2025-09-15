/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnlineTaskQueue } from '@/queue'
import { create_contact_listing, delete_contact_listing, move_listing_to_organisation } from './utils/requestUtils'
import { generateMongoId } from './utils/idUtils'
import { db } from '@/stores/dexie/db'

export interface RegistryTask {
  [taskId: string]: {
    offlineFn: <T = any>(...params: any[]) => Promise<T>
    onlineFn?: <T = any>(...params: any[]) => Promise<T>

    // Optional retry settings
    retry?: {
      retries: number
      delay: number // base delay in ms
      backoffFactor?: number // exponential multiplier
    }

    // Optional hooks
    onSuccess?: (...params: any[]) => void
    onFailure?: (error: unknown, ...params: any[]) => void
    onDeadLetter?: (error: unknown, ...params: any[]) => void
  }
}

export const taskRegistry: RegistryTask = {
  create_listing: {
    offlineFn: async <T = any>(data: {
      url_id: string
      name?: string
      input_backup?: string
    }): Promise<T> => {
      return await create_contact_listing({
        url_id: data.url_id,
        name: data.name,
        input_backup: data.input_backup
      })
    },
    onlineFn: async <T = any>(data: {
      url_id: string
      name?: string
      input_backup?: string
    }): Promise<T> => {
      const id = generateMongoId()
      return (await db.managers.add(
        {
          _id: id,
          backed_up: false,
          contacts_count: 0,
          input_backup: data.input_backup!,
          name: data.name!,
          url_id: data.url_id,
          preferences: { slug_type: 'title_number' }
        },
        id
      )) as T
    },
    retry: {
      retries: 3,
      delay: 1000,
      backoffFactor: 2
    },
    onSuccess: () => console.log('create_listing succeeded online'),
    onFailure: err => console.warn('create_listing failed online', err),
    onDeadLetter: err => console.error('Moved to dead letter queue', err)
  },

  delete_listing: {
    offlineFn: async <T = any>(id: string): Promise<T> => {
      return await delete_contact_listing(id) as T
    },
    onlineFn: async <T = any>(id: string): Promise<T> => {
      return await Promise.resolve() as T
    },
    retry: {
      retries: 3,
      delay: 1000,
      backoffFactor: 2
    },
    onSuccess: () => console.log('successfully deleted listing'),
    onFailure: err => console.warn('failed to delete listing', err),
    onDeadLetter: err => console.error('Moved to dead letter queue', err)
  },

  move_listing: {
    offlineFn: async <T = any>(id: string, organisationId: string): Promise<T> => {
      return await move_listing_to_organisation(id, organisationId) as T
    },
    onlineFn: async <T = any>(id: string, organisationId: string): Promise<T> => {
      return await Promise.resolve() as T
    },
    retry: {
      retries: 3,
      delay: 1000,
      backoffFactor: 2
    },
    onSuccess: () => console.log('successfully moved listing'),
    onFailure: err => console.warn('failed to move listing', err),
    onDeadLetter: err => console.error('Moved to dead letter queue', err)
  }
}

type TaskRegistry = typeof taskRegistry

export class TaskManager extends EventTarget {
  registry: TaskRegistry

  constructor(registry: TaskRegistry) {
    super()
    this.registry = registry
  }

  async run<K extends keyof TaskRegistry>(
    taskId: K,
    upstream: boolean = true,
    ...params: Parameters<TaskRegistry[K]['offlineFn']>
  ): Promise<ReturnType<TaskRegistry[K]['offlineFn']>> {
    const task = this.registry[taskId]
    if (!task) throw new Error(`Task "${String(taskId)}" is not registered`)

    const offlineResult = await task.offlineFn(...params)

    if (upstream && task.onlineFn) {
      OnlineTaskQueue.runTask(async () => {
        await this.runOnlineTaskWithRetries(taskId, task, ...params)
      })
    }

    return offlineResult
  }

  private async runOnlineTaskWithRetries<K extends keyof TaskRegistry>(
    taskId: K,
    task: TaskRegistry[K],
    ...params: Parameters<NonNullable<TaskRegistry[K]['onlineFn']>>
  ) {
    const { retries = 0, delay = 1000, backoffFactor = 2 } = task.retry || {}
    let attempt = 0
    let lastError: unknown

    while (attempt <= retries) {
      try {
        await task.onlineFn?.(...params)
        this.dispatchEvent(new CustomEvent('sync', { detail: { taskId, params } }))
        task.onSuccess?.(...params)
        return
      } catch (err) {
        lastError = err
        if (attempt < retries) {
          const wait = delay * Math.pow(backoffFactor, attempt)
          this.dispatchEvent(
            new CustomEvent('sync_retry', { detail: { taskId, attempt, wait, error: err } })
          )
          await this.sleep(wait)
        }
        attempt++
      }
    }

    // Failed after retries
    this.dispatchEvent(
      new CustomEvent('sync_failed', { detail: { taskId, params, error: lastError } })
    )
    task.onFailure?.(lastError, ...params)
    task.onDeadLetter?.(lastError, ...params)
    this.dispatchEvent(
      new CustomEvent('dead_letter', { detail: { taskId, params, error: lastError } })
    )
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const myTaskManager = new TaskManager(taskRegistry)
