import { useEffect, useRef } from 'react'

const useMounted = () => {
  const mounted = useRef<boolean>(false)
  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  })
  return mounted.current
}

export default useMounted
