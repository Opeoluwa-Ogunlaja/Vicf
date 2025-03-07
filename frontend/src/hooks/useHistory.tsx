import { useCallback, useState, useRef } from 'react'

const useHistoryState: (
  defaultValue: unknown,
  { capacity }?: { capacity?: number | undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => [unknown, (v: unknown) => void, any] = (defaultValue: unknown, { capacity = 20 } = {}) => {
  const [value, setValue] = useState(defaultValue)
  const historyRef = useRef([value])
  const pointerRef = useRef(0)

  const set = useCallback(
    (v: unknown) => {
      const newValue = typeof v == 'function' ? v(value) : value
      if (historyRef.current[pointerRef.current] !== newValue) {
        if (pointerRef.current && pointerRef.current < historyRef.current.length) {
          historyRef.current.splice(pointerRef.current + 1)
        }

        historyRef.current.push(newValue)
        while (historyRef.current.length > capacity) historyRef.current.shift()

        pointerRef.current = historyRef.current.length - 1
      }
      setValue(newValue)
    },
    [value, capacity]
  )

  const goBack = useCallback(() => {
    if (pointerRef.current == 0) return
    pointerRef.current--
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const goFront = useCallback(() => {
    if (pointerRef.current == historyRef.current.length - 1) return
    pointerRef.current++
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return
    pointerRef.current = index
    setValue(historyRef.current[pointerRef.current])
  }, [])

  return [
    value,
    set,
    { history: historyRef.current, pointer: pointerRef.current, goBack, goFront, go }
  ]
}

export default useHistoryState
