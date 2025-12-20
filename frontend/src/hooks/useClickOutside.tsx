import { RefObject } from 'react'
import { useEventListener } from './useEventListener'

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  cb: (event: MouseEvent) => void,
  ref?: RefObject<T>
): void {
  useEventListener<Window, 'click'>(
    'click',
    (e) => {
      if (!ref?.current) return
      if (!(e.target instanceof Node)) return
      if (ref.current.contains(e.target)) return

      cb(e)
    },
    window
  )
}