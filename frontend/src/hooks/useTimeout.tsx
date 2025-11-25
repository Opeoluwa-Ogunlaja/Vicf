import { Timeout } from '@/types/index'
import { useCallback, useEffect, useRef } from 'react'

export const useTimeout = (
  given_callback: () => void,
  delay: number,
  startOnInit: boolean,
  dependencies: unknown[] = []
) => {
  const callback = useCallback(given_callback, [...dependencies, given_callback])
  const timeoutRef = useRef<Timeout>()

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callback(), delay)
  }, [callback, delay])

  const clear = useCallback(() => {
    clearTimeout(timeoutRef.current)
  }, [])

  const reset = useCallback(() => {
    clear()
    set()
  }, [set, clear])

  useEffect(() => {
    if (startOnInit) {
      set()
    }

    return clear
  }, [clear, set, delay, startOnInit])

  return [reset, clear]
}
