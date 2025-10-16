/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export function wait(delay: number, resolveWith: unknown = true) {
  return new Promise(resolve => {
    setTimeout(() => resolve(resolveWith), delay)
  })
}

export function asyncForeach<T = any>(arr: T[], fn: (item: T) => void | Promise<void>){
  return Promise.allSettled(arr.map((item) => fn(item)))
}