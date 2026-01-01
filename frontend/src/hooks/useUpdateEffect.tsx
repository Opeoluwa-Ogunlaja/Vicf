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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies])
}
