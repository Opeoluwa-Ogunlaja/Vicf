import { useEffect, useRef } from 'react'

export function useEventListener<
  EventType extends Event = Event,
  ElementType extends HTMLElement | Window = HTMLElement | Window
>(
  eventType: string,
  callback: (event: EventType) => void,
  element?: ElementType | null,
  defaultToWindow: boolean = true
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const target = element ?? (defaultToWindow ? window : null)
    if (!target) return

    const handler = (event: EventType) => {
      callbackRef.current(event)
    }

    target.addEventListener(eventType, handler as EventListener)

    return () => {
      target.removeEventListener(eventType, handler as EventListener)
    }
  }, [eventType, element, defaultToWindow])
}
