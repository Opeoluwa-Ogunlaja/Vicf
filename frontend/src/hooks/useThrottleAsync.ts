import { useRef } from 'react'

export function useThrottleAsync<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FuncType extends (...args: any) => any = (...args: any[]) => Promise<any>
>(throttledFunc: FuncType, delay: number = 500) {
  const lastRunTime = useRef(0)
  let canRun: boolean
  return async (...args: Parameters<FuncType>) => {
    const runTime = Date.now()
    canRun = runTime - lastRunTime.current > delay
    lastRunTime.current = runTime
    if (canRun) await throttledFunc(args)
  }
}
