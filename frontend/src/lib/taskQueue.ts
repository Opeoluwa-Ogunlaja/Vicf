/* eslint-disable @typescript-eslint/no-explicit-any */
export type Task<T = any> = (...args: any[]) => Promise<T>
export class TaskQueue {
  queue: Task[]
  resolvers: any[]
  constructor(concurrency: number = 10) {
    this.queue = []
    this.resolvers = []

    for (let i = 0; i < concurrency; i++) {
      this.consume()
    }
  }

  async consume() {
    while (true) {
      const task = await this.getTask()
      await task()
    }
  }

  getTask(): Promise<Task> {
    return new Promise(res => {
      if (this.queue.length > 0) return res(this.queue.shift()!)
      this.resolvers.push(res)
    })
  }

  runTask(task: Task) {
    return new Promise((res, rej) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(data => {
          console.log(data)
          res(data)
        }, rej)
        return taskPromise
      }
      if (this.resolvers.length > 0) return this.resolvers.shift()(taskWrapper)
      this.queue.push(taskWrapper)
    })
  }
}
