import { cx } from 'class-variance-authority'
import { FC } from 'react'

const Loader: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cx(
        'aspect-square w-4 animate-spin rounded-full border-2 border-t-primary p-2',
        className
      )}
    ></div>
  )
}

export default Loader
