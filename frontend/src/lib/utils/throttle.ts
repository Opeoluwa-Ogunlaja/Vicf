import { Timeout } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<FuncType extends (...args: any) => any = (...args: any[]) => any>(
  throttledFunc: FuncType,
  delay: number = 500
) {
  let lastRunTime = 0
  let canRun: boolean
  return (...args: Parameters<FuncType>) => {
    const runTime = Date.now()
    canRun = runTime - lastRunTime > delay
    lastRunTime = runTime
    if (canRun) throttledFunc(args)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceFn(fn: (...args: any[]) => void, delay: number = 500) {
  let timeout: Timeout
  return (...args: Parameters<typeof fn>) => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, delay, ...args)
  }
}

export function throttleAsync<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FuncType extends (...args: any) => any = (...args: any[]) => Promise<any>
>(throttledFunc: FuncType, delay: number = 500) {
  let lastRunTime = 0
  let canRun: boolean
  return async (...args: Parameters<FuncType>) => {
    const runTime = Date.now()
    canRun = runTime - lastRunTime > delay
    lastRunTime = runTime
    if (canRun) await throttledFunc(args)
  }
}
