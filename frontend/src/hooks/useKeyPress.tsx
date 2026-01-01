import { RefObject } from 'react'
import { useEventListener } from './useEventListener'

export function useKeyPress(
  key: string,
  callback: (key: string) => void,
  ref?: RefObject<HTMLElement>
) {
  const target = ref?.current ?? window

  useEventListener<HTMLElement | Window, 'keydown'>(
    'keydown',
    (e) => {
      if (e.key === key) {
        e.preventDefault()
        callback(e.key)
      }
    },
    target
  )
}
