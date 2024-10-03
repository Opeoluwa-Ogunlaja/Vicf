import { useLayoutEffect, useRef, FC } from 'react'
import { cn } from '../../lib/utils'

const BackgroundPattern: FC<{
  source: string
  className: string
}> = ({ source, className }) => {
  const elem = useRef<HTMLImageElement>(null)
  useLayoutEffect(() => {
    if (elem.current?.parentElement !== null) {
      const area = elem.current?.parentElement.getBoundingClientRect() || {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
      elem.current!.style.setProperty('--posX', Math.random() * (area.width - 50) + 50 + 'px')
      elem.current!.style.setProperty('--poxY', Math.random() * (area.height - 50) + 50 + 'px')
    }
  }, [])

  return (
    <img
      src={source}
      ref={elem}
      alt="background-pattern"
      className={cn(
        'background-pattern pointer-events-none absolute translate-x-1/2 translate-y-1/2',
        className
      )}
    ></img>
  )
}

export default BackgroundPattern
