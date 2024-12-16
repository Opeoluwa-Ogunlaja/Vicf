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
import { useWebSocketStore } from '@/hooks/useWebsocketStore'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'

const NavigationCard: FC<{ className?: string }> = ({ className }) => {
  const [isOpen, toggle] = useToggle(false)
  const { sendMessage, canSendMessages } = useWebSocketStore()
  const [hasSent, toggleSent] = useToggle(false)

  useUpdateEffect(() => {
    if (canSendMessages && !hasSent) {
      sendMessage({ data: 'hello' }, 'message')
      toggleSent()
    }
  }, [canSendMessages])

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
          <p className="text-sm font-medium leading-none">Opeoluwa</p>
          <p className="text-sm text-neutral-500">opeoluwa@gmail.com</p>
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
        <DropdownMenuItem>Profile</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NavigationCard
