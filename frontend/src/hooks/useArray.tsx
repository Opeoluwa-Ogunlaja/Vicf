import { useCallback, useState } from 'react'

export function useArray<T>(initialValue?: T[]) {
  const [values, setValues] = useState<T[]>(initialValue ?? [])

  const push = useCallback(
    (item: T) => {
      setValues(prevState => {
        return [...prevState, item]
      })
    },
    [setValues]
  )

  const removeExact = useCallback((item: T) => {
    setValues(prevState => {
      return prevState.filter((i) => item != i)
    })
  }, [setValues])

  const pop = useCallback(() => {
    let item
    setValues(prevState => {
      item = prevState.at(-1)

      return prevState.slice(0, -1)
    })

    return item
  }, [setValues])

  const unshift = useCallback(
    (item: T) => {
      setValues(prevState => {
        return [item, ...prevState]
      })
    },
    [setValues]
  )

  const shift = useCallback(() => {
    let item
    let prev
    setValues(prevState => {
      ;[item, ...prev] = prevState
      return prev
    })

    return item
  }, [setValues])

  return { values, push, pop, shift, unshift, setValues, removeExact }
}
