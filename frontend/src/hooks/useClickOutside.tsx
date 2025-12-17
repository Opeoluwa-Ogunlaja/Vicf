import { MutableRefObject } from 'react'
import { useEventListener } from './useEventListener'

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  cb: EventListener,
  ref?: MutableRefObject<T>
): void {
  useEventListener<Window, 'click'>(
    'click',
    e => {
      if (!ref || ref.current.contains(e.target as Node)) return
      cb(e)
    },
    window
  )
}
