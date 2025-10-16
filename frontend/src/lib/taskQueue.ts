import { nanoid } from 'nanoid'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Task<T = any> = (...args: any[]) => Promise<T>
export class 
TaskQueue {
  queue: Task[]
  resolvers: Array<[resolve: (task: Task) => void, reject: (err: any) => void]>
  paused: boolean
  concurrency: number
  activeConsumers: number
  queueId: string
  stateListeners: ((state: boolean) => void)[]
  constructor(concurrency: number = 10, startPaused: boolean = false) {
    this.queue = []
    this.resolvers = []
    this.paused = startPaused
    this.concurrency = concurrency
    this.activeConsumers = 0
    this.queueId = nanoid()
    for (let i = 0; i < concurrency; i++) {
      this.activeConsumers++
      this.consume()
    }

    this.stateListeners = []
  }

  listen(listener: (state: boolean) => void){
    this.stateListeners.push(listener)
  }

  pause() {
    if(this.paused) return
    this.paused = true 
    this.stateListeners.forEach(s => s(this.paused))
  }

  resume() {
    if(!this.paused) return
    this.paused = false
    this.stateListeners.forEach(s => s(this.paused))

     while (this.resolvers.length > 0 && this.queue.length > 0) {
      const resolver = this.resolvers.shift()
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      resolver && resolver[0](this.queue.shift()!)
    }
  }

  async consume() {
    while (true) {
      if (this.paused) {
        await this.waitWhilePaused()
      }

      try {
        const task = await this.getTask()
        await task()

        this.activeConsumers--
        // eslint-disable-next-line no-empty, no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error: any) {
      }
    }
  }

  private waitWhilePaused() {
    return new Promise<void>(resolve => {
      const check = () => {
        if (!this.paused) return resolve()
        setTimeout(check, 10)
      }
      check()
    })
  }

  getTask(): Promise<Task> {
    return new Promise<Task>((res, rej) => {
      if (this.queue.length > 0 && !this.paused) return res(this.queue.shift()!)
      // push resolver so runTask can resolve it when a task is scheduled
      this.resolvers.push([res, rej])
    })
  }

  runTask(task: Task) {
    return new Promise((res, rej) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(data => {
          res(data)
        }, rej)
        return taskPromise
      }
      if (this.resolvers.length > 0 && !this.paused) {
        const resolver = this.resolvers.shift()
        return resolver && resolver[0](taskWrapper)
      }
      this.queue.push(taskWrapper)
    })
  }
}