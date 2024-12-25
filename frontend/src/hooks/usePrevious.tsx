import { useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function usePrevious<T = any>(state: T) {
  const currentStateRef = useRef<T>()
  const previousStateRef = useRef<null | T>(null)

  if (currentStateRef.current !== state) {
    previousStateRef.current = currentStateRef.current as T
    currentStateRef.current = state
  }

  return previousStateRef.current
}
