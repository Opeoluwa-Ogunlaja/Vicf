import { RefObject } from 'react'
import { useEventListener } from './useEventListener'

export function useKeyPress<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  key: string,
  callback: (code: string) => void
) {
  useEventListener<T, 'keydown'>(
    'keydown',
    e => {
      if (e.code == key) {
        e.preventDefault()
        callback(e.code)
      }
    },
    ref.current
  )
}
