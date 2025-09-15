import { useLayoutEffect, useRef, FC, memo } from 'react'
import { cn } from '../../lib/utils'

const BackgroundPattern: FC<{
  source: string
  className?: string
}> = ({ source, className }) => {
  const elem = useRef<HTMLImageElement>(null)
  useLayoutEffect(() => {
    if (elem.current?.parentElement !== null) {
      const referenceElement =
        elem.current?.parentElement.id !== 'root' ? elem.current?.parentElement : document.body
      const area = referenceElement?.getBoundingClientRect() || {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }

      const posX = Math.random() * (area.width - 50) + 100
      const posY = Math.random() * (area.height - 50) + 100
      elem.current!.style.setProperty('--posX', posX + 'px')
      elem.current!.style.setProperty('--posY', posY + 'px')
    }
  }, [])

  return (
    <img
      src={source}
      ref={elem}
      alt="background-pattern"
      loading="lazy"
      className={cn(
        'background-pattern pointer-events-none absolute -translate-x-1/2 -translate-y-1/2',
        className
      )}
    ></img>
  )
}

export const MultiBackgroundPatterns = memo(({
  className,
  count = 2,
  source
}: {
  className?: string
  count: number
  source: string
}) => {
  return Array(count)
    .fill(0)
    .map((...args: unknown[]) => (
      <BackgroundPattern className={className ?? ''} source={source} key={`pattern-${args[1]}`} />
    ))
})

export default memo(BackgroundPattern)
