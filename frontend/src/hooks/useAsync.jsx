import { useEffect, useState } from 'react'

export function useAsync(promise = Promise.resolve(), dependencies = []) {
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [...dependencies])

  return [loading, value, error]
}
