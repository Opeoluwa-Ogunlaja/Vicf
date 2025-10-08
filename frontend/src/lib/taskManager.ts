/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnlineTaskQueue } from '@/queue'
import { create_contact_listing, delete_contact_listing, move_listing_to_organisation } from './utils/requestUtils'
import { db, QueuedTask } from '@/stores/dexie/db'
import { useContactManagerStore } from '@/stores/contactsManagerStore'
import { wait } from './utils/promiseUtils'

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
    onSuccess?: (...params: any[]) => void | Promise<void>
    onFailure?: (error: unknown, ...params: any[]) => void
    onDeadLetter?: (error: unknown, ...params: any[]) => void
  }
}

export const taskRegistry: RegistryTask = {
  create_listing: {
    offlineFn: async <T = any>(data: {
      _id: string,
      url_id: string
      name?: string
      input_backup?: string
    }): Promise<T> => {
      console.log('called')
      await db.managers.put(
        {
          _id: data._id,
          backed_up: false,
          contacts_count: 0,
          input_backup: data.input_backup!,
          name: data.name!,
          url_id: data.url_id,
          preferences: { slug_type: 'title_number' },
          synced: false
        },
        data._id
      )

      await wait(2000)
      return data as T
    },
    onlineFn: async <T = any>(data: {
      _id: string,
      url_id: string
      name?: string
      input_backup?: string
    }): Promise<T> => {
      return await create_contact_listing({
        _id: data._id,
        url_id: data.url_id,
        name: data.name,
        input_backup: data.input_backup
      })
    },
    retry: {
      retries: 3,
      delay: 1000,
      backoffFactor: 2
    },
    onSuccess: async (payload: any) => {
      // payload may contain the created entity or an id
      const id = (payload && (payload._id ?? payload)) as any
      if (id) {
        await db.managers.update(id, {
          synced: true
        })

        useContactManagerStore.getState().actions.syncManager(id, payload)
      }
    },
    onFailure: err => console.warn('create_listing failed online', err),
    onDeadLetter: err => console.error('Moved to dead letter queue', err)
  },

  delete_listing: {
    offlineFn: async <T = any>(id: string): Promise<T> => {
      return await delete_contact_listing(id) as T
    },
    onlineFn: async <T = any>(id: string): Promise<T> => {
      return await Promise.resolve(id) as T
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
      return await Promise.resolve([id, organisationId]) as T
    },
    retry: {
      retries: 3,
      delay: 1000,
      backoffFactor: 2
    },
    onSuccess: () => {
      // no-op success hook for move_listing
    },
    onFailure: err => console.warn('failed to move listing', err),
    onDeadLetter: err => console.error('Moved to dead letter queue', err)
  }
}

type TaskRegistry = typeof taskRegistry

export class TaskManager extends EventTarget {
  registry: TaskRegistry
  handlers: ((taskEntry: QueuedTask) => void)[]
  sync_tasks: QueuedTask[]

  constructor(registry: TaskRegistry) {
    super()
    this.registry = registry
    this.handlers = []
    this.sync_tasks = []

    db.queuedTasks.toArray().then((tasks) => {
      this.sync_tasks = tasks
    })
  }

  listen(handler: typeof this.handlers[0]){
    this.handlers.push(handler)
  }

  unlisten(handler: typeof this.handlers[0]){
    this.handlers = this.handlers.filter((h) => h !== handler)
  }

  triggerListeners(taskEntry: QueuedTask){
    for (const handler of this.handlers){
      handler(taskEntry)
    }
  }

  async run<K extends keyof TaskRegistry>(
    taskId: string,
    taskName: K,
    upstream: boolean = true,
    ...params: Parameters<TaskRegistry[K]['offlineFn']>
  ): Promise<ReturnType<TaskRegistry[K]['offlineFn']>> {
    const task = this.registry[taskName]
    if (!task) throw new Error(`Task "${String(taskName)}" is not registered`)
    
    const newTaskEntry: QueuedTask = {
      createdAt: Date.now(),
      _id: taskId,
      payload: params as any,
      type: taskName as string,
      status: 'idle',
      attempts: 0,
      nextAttemptAt: 0
    }

    // persist to DB atomically and update local cache
    await db.queuedTasks.put(newTaskEntry)
    this.sync_tasks.push(newTaskEntry)

    this.triggerListeners(newTaskEntry)

    const offlineResult = await task.offlineFn(...params)

    if (upstream && task.onlineFn) {
      OnlineTaskQueue.runTask(async () => {
        await this.runOnlineTaskWithRetries(taskId, taskName, task, ...params)
      })
    }

    return offlineResult
  }

  public async retry(taskId: string, onSuccess?: (response: any) => void){
    // Atomically claim the task in DB by updating status to 'processing' only if current status is 'idle' and nextAttemptAt <= now
    const now = Date.now()
    const claimed = await db.transaction('rw', 'queuedTasks', async () => {
      const task = await db.queuedTasks.get(taskId)
      if (!task) return null
      if (task.status === 'processing') return null
      if (task.nextAttemptAt && task.nextAttemptAt > now) return null
      // claim it
      await db.queuedTasks.update(taskId, { status: 'processing', worker: `${taskId}-${now}`, lockedAt: now })
      return await db.queuedTasks.get(taskId)
    })

    if (!claimed) return null

    const prom = OnlineTaskQueue.runTask(async () => {
      // refresh claimed copy
      const claimedTask = await db.queuedTasks.get(taskId)
      if (!claimedTask) return
      return await this.runOnlineTaskWithRetries(taskId, claimedTask.type as any, this.registry[claimedTask.type as keyof TaskRegistry], ...Object.values(claimedTask.payload))
    })
    prom.then(async (res) => {
      // remove from local cache and DB
      this.sync_tasks = this.sync_tasks.filter((t) => t._id != taskId)
      await db.queuedTasks.where('_id').equalsIgnoreCase(taskId).delete()
      if (onSuccess) await Promise.resolve(onSuccess(res))
    })
    prom.catch(async () => {
      // increment attempts and schedule nextAttemptAt if task still exists
      const task = await db.queuedTasks.get(taskId)
      if (task) {
        const attempts = (task.attempts || 0) + 1
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000)
        // write full updated object back (put) to avoid type conflicts with partial update and null values
        await db.queuedTasks.put({ ...task, status: 'idle', attempts, nextAttemptAt: Date.now() + delay, lockedAt: undefined })
      }
    })

    return prom
  }

  private async runOnlineTaskWithRetries<K extends keyof TaskRegistry>(
    taskId: string,
    taskName: K,
    task: TaskRegistry[K],
    ...params: Parameters<NonNullable<TaskRegistry[K]['onlineFn']>>
  ) {
    const { retries = 0, delay = 1000, backoffFactor = 2 } = task.retry || {}
    let attempt = 0
    let lastError: unknown

    while (attempt <= retries) {
      try {
        const res = await task.onlineFn?.(...params)
        this.dispatchEvent(new CustomEvent('sync', { detail: { taskId, taskName, params } }))
        await Promise.resolve(task.onSuccess?.(res))
        this.sync_tasks = this.sync_tasks.filter((t) => t._id != taskId)
        await db.queuedTasks.where("_id").equalsIgnoreCase(taskId).delete()
        return
      } catch (err) {
        lastError = err
        if (attempt < retries) {
          const wait = delay * Math.pow(backoffFactor, attempt)
          this.dispatchEvent(
            new CustomEvent('sync_retry', { detail: { taskId, taskName, attempt, wait, error: err } })
          )
          await this.sleep(wait)
        }
        attempt++
      }
    }

    // Failed after retries
    this.dispatchEvent(
      new CustomEvent('sync_failed', { detail: { taskId, taskName, params, error: lastError } })
    )
    task.onFailure?.(lastError, ...params)
    task.onDeadLetter?.(lastError, ...params)
    this.dispatchEvent(
      new CustomEvent('dead_letter', { detail: { taskId, taskName, params, error: lastError } })
    )
    this.sync_tasks = this.sync_tasks.filter((t) => t._id != taskId)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const myTaskManager = new TaskManager(taskRegistry)
