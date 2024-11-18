/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactEventHandler, useEffect, useRef } from 'react'

export function useEventListener<EventType = Element>(
  eventType: string,
  callback: ReactEventHandler<EventType>,
  element: HTMLElement,
  defaultToWindows: boolean = true
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handler: typeof callback = e => {
      callbackRef.current(e)
    }

    if (element == null || element == undefined) {
      if (defaultToWindows == true) {
        window.addEventListener(eventType, handler as any)
      } else {
        return
      }
    } else if (element != null) {
      element.addEventListener(eventType, handler as any)
    }

    return () => {
      if (element) {
        element.removeEventListener(eventType, handler as any)
      }
    }
  }, [element, defaultToWindows, eventType])
}
