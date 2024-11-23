import { useEffect } from 'react'
import { useTimeout } from './useTimeout'

const useDebounce = (callback: () => void, delay: number, dependencies: unknown[]) => {
  const reset = useTimeout(callback, delay, false)[2]
  useEffect(reset, [...dependencies, reset])
}

export default useDebounce
