import './App.css'
import {
  // AnnouncementIcon,
  // BellIcon,
  ChevronDownIcon
  // FacebookIcon,
  // InstagramIcon,
  // SettingsIcon,
  // VicfIcon
} from './assets/icons'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu
} from './components/ui/dropdown-menu'
import { useToggle } from './hooks/useToggle'
import { cn } from './lib/utils'

import AppRouter from './AppRouter'
// import BackgroundPattern from './components/ui/BackgroundPattern'
// import { BgPatternImage } from './assets/images'
// import ContactsTable from './components/ContactsTable'
// import Sidenav from './components/ui/Sidenav'

function NavigationCard() {
  const [isOpen, toggle] = useToggle(false)
  return (
    <DropdownMenu defaultOpen={isOpen} open={isOpen} onOpenChange={toggle}>
      <DropdownMenuTrigger className=" flex hover:scale-105 transition-transform items-center space-x-4 rounded-2xl border p-2 sm:p-4 bg-white">
        <img
          src="https://res.cloudinary.com/maddope/image/upload/v1711923023/masyntech-mern-blog/uwcz3p8o75ozapa9pjf6.jpg"
          alt="Profile image"
          className="w-10 aspect-square rounded-full shadow-inner"
        />
        <div className="flex-1 space-y-1 text-left hidden md:block">
          <p className="text-sm font-medium leading-none">Opeoluwa</p>
          <p className="text-sm text-neutral-500">opeoluwa@gmail.com</p>
        </div>
        <ChevronDownIcon
          width={32}
          className={cn({ '-rotate-180': isOpen }, 'transition-transform origin-center')}
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
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function App() {
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
