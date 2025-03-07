/* eslint-disable @typescript-eslint/no-explicit-any */

export class TaskQueue {
  queue: Array<any>
  resolvers: Array<any>
  cache: Array<any>
  constructor(concurrency: number = 10) {
    this.queue = []
    this.resolvers = []
    this.cache = []

    for (let i = 0; i < concurrency; i++) {
      this.consume()
    }
  }

  async consume() {
    let task: (...args: any) => Promise<any>
    while ((task = (await this.getTask()) as typeof task)) {
      try {
        await task()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
      } catch (e) {}
    }
  }

  getTask() {
    return new Promise(res => {
      if (this.queue.length > 0) return res(this.queue.shift())
      this.resolvers.push(res)
    })
  }

  runTask(prom: () => Promise<any>) {
    const cacheId = this.cache.length
    this.cache.push(null)
    return new Promise((res, rej) => {
      const taskWrapper = () => {
        return prom().then(result => {
          this.cache[cacheId] = result
          res(result)
        }, rej)
      }
      if (this.resolvers.length > 0) return this.resolvers.shift()(taskWrapper)
      this.queue.push(taskWrapper)
    })
  }
}
