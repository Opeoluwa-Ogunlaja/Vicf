import './App.css'
import { AnnouncementIcon, BellIcon, ChevronDownIcon, SettingsIcon, VicfIcon } from './assets/icons'
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

// import AppRouter from './AppRouter'
import BackgroundPattern from './components/ui/BackgroundPattern'
import { BgPatternImage } from './assets/images'

function NavigationCard() {
  const [isOpen, toggle] = useToggle(false)
  return (
    <DropdownMenu defaultOpen={isOpen} open={isOpen} onOpenChange={toggle}>
      <DropdownMenuTrigger className=" flex hover:scale-105 transition-transform items-center space-x-4 rounded-md border p-2 sm:p-4 bg-white">
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
  const navIconClass = cn('w-8 max-md:w-6')
  return (
    <>
      <aside className="bg-secondary max-md:text-xs text-center py-2 font-medium space-x-2">
        <AnnouncementIcon className="align-middle w-5 max-md:w-3 inline-block" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="h-[70vh] bg-primary py-4 px-16 max-md:px-8 max-sm:px-3 grid relative overflow-hidden">
        <div className="flex items-center justify-between self-start">
          <a href="/" className="text-5xl text-secondary">
            <VicfIcon width={'1em'} />
          </a>

          <nav className="contents">
            <ul className="flex items-center gap-6">
              <li className="inline-flex max-md:hidden">
                <a href="" className="text-sm text-white">
                  Save Contacts
                </a>
              </li>
              <li>
                <a href="" className="text-white">
                  <BellIcon className={navIconClass} />
                </a>
              </li>
              <li>
                <a href="" className="text-white">
                  <SettingsIcon className={navIconClass} />
                </a>
              </li>
              <li>
                <NavigationCard />
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-center absolute inset-0 space-y-2 text-white self-center">
          <h3 className="font-bold text-3xl">Let’s Save Some Contacts</h3>
          <p className="text-sm flex items-start justify-center gap-2 text-white text-opacity-85 mx-auto">
            <AnnouncementIcon width={'16px'} className="align-baseline" />
            <span className="max-w-[35ch]">
              Tip: Use the "Overwrite name" checkbox to give contact a custom name
            </span>
          </p>
        </div>

        <BackgroundPattern className="opacity-20 w-64 aspect-square" source={BgPatternImage} />
        <BackgroundPattern className="opacity-20 w-64 aspect-square" source={BgPatternImage} />
      </header>
      {/* <AppRouter /> */}
    </>
  )
}

export default App
