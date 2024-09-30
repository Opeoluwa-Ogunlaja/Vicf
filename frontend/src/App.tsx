import { ReactNode, FC } from 'react'
import './App.css'
import { AnnouncementIcon, BellIcon, SettingsIcon, VicfIcon } from './assets/icons'
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu
} from './components/ui/dropdown-menu'

// import AppRouter from './AppRouter'
import { useToggle } from './hooks/useToggle';

function NavigationCard() {
  const [ isOpen, toggle ] = useToggle(false)
  return (
    <DropdownMenu defaultOpen={isOpen}
      open={isOpen}
      onOpenChange={toggle}
    >
      <DropdownMenuTrigger className=" flex items-center space-x-4 rounded-md border p-4 bg-white">
        <img
          src="https://res.cloudinary.com/maddope/image/upload/v1711923023/masyntech-mern-blog/uwcz3p8o75ozapa9pjf6.jpg"
          alt="Profile image"
          className="w-10 aspect-square rounded-full shadow-inner"
        />
        <div className="flex-1 space-y-1 text-left">
          <p className="text-sm font-medium leading-none">Opeoluwa</p>
          <p className="text-sm text-neutral-500">opeoluwa@gmail.com</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
      <aside className="bg-secondary text-center py-2 font-medium space-x-2">
        <AnnouncementIcon width={20} className="align-middle inline-block" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="h-96 bg-primary py-4 px-16">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl text-secondary">
            <VicfIcon width={'1em'} />
          </h1>

          <nav className="contents">
            <ul className="flex items-center gap-6">
              <li>
                <a href="" className="text-sm text-white">
                  Save Contacts
                </a>
              </li>
              <li>
                <a href="" className="text-white">
                  <BellIcon width={32} />
                </a>
              </li>
              <li>
                <a href="" className="text-white">
                  <SettingsIcon width={32} />
                </a>
              </li>
              <li>
                <NavigationCard />
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* <AppRouter /> */}
    </>
  )
}

export default App
