export function createInterceptorReadySignal() {
  let resolver: () => void
  const promise = new Promise<void>(resolve => {
    resolver = resolve
  })

  return {
    waitForInterceptor: () => promise,
    markInterceptorReady: () => resolver()
  }
}
