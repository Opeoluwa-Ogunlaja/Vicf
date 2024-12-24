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

      const posX = Math.random() * (area.width - 50) + 50
      const posY = Math.random() * (area.height - 50) + 50
      elem.current!.style.setProperty('--posX', posX + 'px')
      elem.current!.style.setProperty('--posY', posY + 'px')
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

export const MultiBackgroundPatterns = ({
  className,
  count = 2,
  source
}: {
  className: string
  count: number
  source: string
}) => {
  return Array(count)
    .fill(0)
    .map((...args: unknown[]) => (
      <BackgroundPattern className={className} source={source} key={`pattern-${args[1]}`} />
    ))
}

export default BackgroundPattern