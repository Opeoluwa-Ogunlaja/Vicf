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
          src="https://res.cloudinary.com/maddope/image/upload/v1711923023/masyntech-mern-blog/uwcz3p8o75ozapa9pjf6.jpg"
          alt="Profile image"
          className="aspect-square w-10 rounded-full shadow-inner"
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
        <DropdownMenuItem>Home</DropdownMenuItem>
        <DropdownMenuItem>Dasboard</DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Organizations</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavigationCard
