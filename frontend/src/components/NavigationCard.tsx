import { useToggle } from '@/hooks/useToggle'
import { FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from './ui/dropdown-menu'
import { ChevronDownIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const NavigationCard: FC<{ className?: string }> = ({ className }) => {
  const [isOpen, toggle] = useToggle(false)
  const { user } = useUser()

  return (
    <DropdownMenu defaultOpen={isOpen} open={isOpen} onOpenChange={toggle}>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center space-x-4 rounded-2xl border bg-white p-2 transition-transform hover:scale-105 sm:p-4',
          className
        )}
      >
        <img
          src={user?.profile_photo}
          alt="Profile image"
          loading="lazy"
          className="aspect-square max-h-10 w-10 rounded-full shadow-inner"
        />
        <div className="hidden flex-1 space-y-1 text-left md:block">
          <p className="text-sm font-medium leading-none">{user && user?.name}</p>
          <p className="w-[20ch] overflow-hidden text-ellipsis text-sm text-neutral-500">
            {user && user?.email}
          </p>
        </div>
        <ChevronDownIcon
          width={32}
          className={cn({ '-rotate-180': isOpen }, 'origin-center transition-transform')}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          minWidth: '8rem',
          width: `var(--radix-popper-anchor-width)`
        }}
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="transition-colors hover:bg-neutral-50 focus:bg-neutral-50"><NavLink to="/" className={({ isActive }) => clsx('block w-full h-full', { 'text-neutral-600': isActive })}>Home</NavLink></DropdownMenuItem>
        <DropdownMenuItem className="transition-colors hover:bg-neutral-50 focus:bg-neutral-50"><NavLink to="/" className={({ isActive }) => clsx('block w-full h-full', { 'text-neutral-600': isActive })}>Dasboard</NavLink></DropdownMenuItem>
        <DropdownMenuItem className="transition-colors hover:bg-neutral-50 focus:bg-neutral-50"><NavLink to="/" className={({ isActive }) => clsx('block w-full h-full', { 'text-neutral-600': isActive })}>Profile</NavLink></DropdownMenuItem>
        <DropdownMenuItem className="transition-colors hover:bg-neutral-50 focus:bg-neutral-50"><NavLink to="/" className={({ isActive }) => clsx('block w-full h-full', { 'text-neutral-600': isActive })}>Organizations</NavLink></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavigationCard
