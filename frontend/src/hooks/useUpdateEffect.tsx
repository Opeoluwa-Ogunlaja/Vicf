import { useRef } from 'react'
import { useEffect } from 'react'

export function useUpdateEffect(callback: () => void, dependencies: unknown[]) {
  const renderedBefore = useRef(false)

  useEffect(() => {
    if (!renderedBefore.current) {
      renderedBefore.current = true
      return
    }
    callback()
  }, [callback, ...dependencies])
}
