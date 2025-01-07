import { Timeout } from '@/types/index'
import { useCallback, useEffect, useRef } from 'react'

export const useTimeout = (
  given_callback: (...args: unknown[]) => void,
  delay: number,
  startOnInit: boolean,
  dependencies: unknown[] = []
) => {
  const callback = useCallback(given_callback, [...dependencies])
  const timeoutRef = useRef<Timeout>()

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callback, delay)
  }, [delay])

  const clear = useCallback(() => {
    clearTimeout(timeoutRef.current)
  }, [])

  const reset = useCallback(() => {
    clear()
    set()
  }, [delay, set, clear])

  useEffect(() => {
    if (startOnInit) {
      set()
    }

    return clear
  }, [clear, set, delay, startOnInit])

  return [reset, clear]
}
