import { useEffect } from 'react'
import { useTimeout } from './useTimeout'

type UseFormValueChangeDebounceProps<T> = {
  formHook: { watch: (callback?: (value: T) => void) => T | (() => void) }
  delay: number
  callback: (...args: unknown[]) => void
  dependencies?: unknown[]
}

export function useFormValueChangeDebounce<T>({
  formHook,
  delay,
  callback,
  dependencies = []
}: UseFormValueChangeDebounceProps<T>) {
  const [reset] = useTimeout(callback, delay, false)

  useEffect(() => {
    const unsubscribe = formHook.watch(() => {
      reset()
    })

    return () => {
      if (typeof unsubscribe === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(unsubscribe as any)()
      }
    }
  }, [formHook, delay, reset, ...dependencies])
}
