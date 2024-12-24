import { Timeout } from '@/types/index'
import { useCallback, useEffect, useRef } from 'react'

export const useTimeout = (
  callback: (...args: unknown[]) => void,
  delay: number,
  startOnInit: boolean
) => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<Timeout>()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
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
