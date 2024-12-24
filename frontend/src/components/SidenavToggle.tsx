import { useSidenav } from '@/hooks/useSidenav'
import { cn } from '@/lib/utils'
import { FC } from 'react'

const SidenavToggle: FC<{ className?: string }> = ({ className }) => {
  const [, , setOpen] = useSidenav()
  return (
    <button
      onClick={() => setOpen(true)}
      className={cn('text-lg font-bold text-white drop-shadow-sm md:hidden', className)}
      data-sidenav-toggle="true"
    >
      &#9776;
    </button>
  )
}

export default SidenavToggle
