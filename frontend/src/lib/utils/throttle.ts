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
    console.log(runTime, lastRunTime, runTime - lastRunTime)
    lastRunTime = runTime
    if (canRun) throttledFunc(args)
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
    console.log(runTime, lastRunTime, runTime - lastRunTime)
    lastRunTime = runTime
    if (canRun) await throttledFunc(args)
  }
}
