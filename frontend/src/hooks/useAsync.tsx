import { useEffect, useState } from 'react'

export function useAsync(
  promise: () => Promise<unknown> | Promise<unknown>,
  dependencies: unknown[] = []
) {
  const [value, setValue] = useState<unknown>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const prom = promise instanceof Promise ? promise : promise()
    prom
      .then(value => {
        setValue(value)
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promise, ...dependencies])

  return [loading, value, error]
}
