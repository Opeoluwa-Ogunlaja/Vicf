/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import { useEventListener } from './useEventListener'
import { useUpdateEffect } from './useUpdateEffect'

export default function useMediaQuery(query: string) {
  const matchQuery = useRef(window.matchMedia(query))
  const [matches, setMatches] = useState(matchQuery.current.matches)

  useUpdateEffect(() => {
    matchQuery.current = window.matchMedia(query)
    setMatches(matchQuery.current.matches)
  }, [query])

  useEventListener<MediaQueryList, 'change'>(
    'change',
    e => setMatches(e.matches),
    matchQuery.current as any
  )

  return matches
}
