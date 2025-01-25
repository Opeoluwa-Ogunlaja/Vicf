import { useRef, useCallback } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useEffectEvent(callback: (...args: any[]) => void) {
  const callbackRef = useRef(callback)

  // Update the ref with the latest callback on every render
  callbackRef.current = callback

  // Return a stable function that always calls the latest callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args)
  }, [])
}

export default useEffectEvent
