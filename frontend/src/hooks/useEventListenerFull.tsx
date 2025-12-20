import { useEffect, useRef } from 'react'

type EventTargetLike = HTMLElement | Window | Document | MediaQueryList
type EventMap<T> = T extends Window ? WindowEventMap 
: T extends Document ? DocumentEventMap 
: T extends HTMLElement ? HTMLElementEventMap 
: T extends MediaQueryList ? MediaQueryListEventMap 
: Record<string, Event>


export function useEventListener<
  TTarget extends EventTargetLike = Window,
  TEventName extends keyof EventMap<TTarget> & string = keyof EventMap<TTarget> & string
>(
  eventName: TEventName,
  callbackFn: (event: EventMap<TTarget>[TEventName]) => void,
  target: TTarget | null | undefined,
  options?: AddEventListenerOptions
) {
  const callbackRef = useRef<typeof callbackFn>(callbackFn)

  useEffect(( ) => { 
    callbackRef.current = callbackFn
   }, [ callbackFn ])

  useEffect(() => {
    if (!target) return

    const handler = (event: Event) => {
      callbackRef.current(event as EventMap<TTarget>[TEventName])
    }

    target.addEventListener(eventName, handler, options)

    return () => {
      target.removeEventListener(eventName, handler, options)
    }
  }, [eventName, target, options])
}
