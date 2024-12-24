import { useTimeout } from './useTimeout'
import { useUpdateEffect } from './useUpdateEffect'

const useDebounce = (callback: () => void, delay: number, dependencies: unknown[]) => {
  const [reset] = useTimeout(callback, delay, false)
  useUpdateEffect(reset, [...dependencies, reset])
}

export default useDebounce
