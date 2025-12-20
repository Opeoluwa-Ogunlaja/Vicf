import { useRef, useState, useEffect } from 'react'
import { useEventListener } from './useEventListenerFull'

export default function useMediaQuery(query: string) {
  const matchQuery = useRef(window.matchMedia(query))
  const [matches, setMatches] = useState(matchQuery.current.matches)

  useEffect(() => {
    if(!matchQuery.current) return 

    matchQuery.current = window.matchMedia(query)
    setMatches(matchQuery.current.matches)
  }, [query])

  useEventListener<MediaQueryList, 'change'>(
    'change',
    e => setMatches(e.matches),
    matchQuery.current
  )

  return matches
}