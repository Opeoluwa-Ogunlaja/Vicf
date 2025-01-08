export function wait(delay: number, resolveWith: unknown = true) {
  return new Promise(resolve => {
    setTimeout(() => resolve(resolveWith), delay)
  })
}
