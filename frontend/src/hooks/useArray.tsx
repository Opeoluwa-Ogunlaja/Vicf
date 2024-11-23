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

  const pop = useCallback(() => {
    let item
    setValues(prevState => {
      item = prevState.pop()
      return prevState
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
    setValues(prevState => {
      item = prevState.shift()
      return prevState
    })

    return item
  }, [setValues])

  return { values, push, pop, shift, unshift }
}
