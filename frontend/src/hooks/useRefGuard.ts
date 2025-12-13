import { useEffect, useRef } from 'react'

export function useRefGuard<T>(value: T, label?: string) {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
    if (label) {
      console.debug(`[useRefGuard:${label}]`, value)
    }
  }, [value, label])

  return ref.current
}
