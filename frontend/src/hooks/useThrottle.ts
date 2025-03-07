import { useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<FuncType extends (...args: any) => any = (...args: any[]) => any>(
  throttledFunc: FuncType,
  delay: number = 500
) {
  const lastRunTime = useRef(0)
  let canRun: boolean
  return (...args: Parameters<FuncType>) => {
    const runTime = Date.now()
    canRun = runTime - lastRunTime.current > delay
    lastRunTime.current = runTime
    if (canRun) throttledFunc(args)
  }
}
