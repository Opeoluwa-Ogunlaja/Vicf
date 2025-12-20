import { useEffect, useRef } from 'react'

export function useRefGuard<T>(value: T) {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  }, [value, label])

  // not returning ref.current but the ref itself.
  return ref
}
