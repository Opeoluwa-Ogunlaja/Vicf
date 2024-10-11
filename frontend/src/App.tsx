import './App.css'
import {
  AnnouncementIcon,
  BellIcon,
  ChevronDownIcon,
  ClockRewindIcon,
  FacebookIcon,
  InstagramIcon,
  PhonePlusIcon,
  SettingsIcon,
  UserPlusIcon,
  VicfIcon
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

// import AppRouter from './AppRouter'
import BackgroundPattern from './components/ui/BackgroundPattern'
import { BgPatternImage } from './assets/images'
import { Button } from './components/ui/button'

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
  const navIconClass = cn('w-8 max-md:w-6')
  return (
    <>
      <aside className="bg-secondary max-md:text-xs text-center py-2 font-medium space-x-2">
        <AnnouncementIcon className="align-middle w-5 max-md:w-3 inline-block" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="h-[426px] bg-primary py-4 px-16 max-md:px-8 max-sm:px-3 grid relative overflow-hidden">
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
        <div className="text-center absolute inset-0 space-y-2 max-md:-mt-40 text-white self-center">
          <h3 className="font-bold text-3xl max-sm:text-2xl">Let’s Save Some Contacts</h3>
          <p className="text-sm flex items-start justify-center gap-2 text-white text-opacity-85 mx-auto">
            <AnnouncementIcon width={'16px'} className="align-baseline" />
            <span className="max-w-[35ch] max-md:max-w-[28ch]">
              Tip: Use the "Overwrite name" checkbox to give contact a custom name
            </span>
          </p>
        </div>

        <BackgroundPattern className="opacity-20 w-64 aspect-square" source={BgPatternImage} />
        <BackgroundPattern className="opacity-20 w-64 aspect-square" source={BgPatternImage} />
      </header>
      <main className="main-wrapper grid">
        <aside className="w-fit flex flex-col gap-20 px-16 py-10">
          <Button variant={'secondary'} className="w-max">
            Create New
          </Button>
          <section className="flex flex-col">
            <h3 className="text-2xl font-medium border-b border-b-neutral-200 pb-2 mb-4">
              Recents <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
            </h3>
            <ul className="space-y-2">
              <li>
                <div className=" flex hover:scale-105 transition-transform items-center space-x-4 rounded-2xl border border-neutral-100 p-3 sm:p-4 bg-white">
                  <PhonePlusIcon className="w-5 drop-shadow-md self-start pt-2" />
                  <div className="flex-1 flex flex-col gap-1 text-left text-sm">
                    <h4 className="font-semibold text-lg">Geology Department</h4>
                    <p className="font-medium leading-none flex gap-2 text-neutral-400">
                      <UserPlusIcon width={'1em'} /> Opeoluwa
                    </p>
                    <p className="text-xs text-muted mt-2">
                      Contacts not exported or saved to drive
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className=" flex hover:scale-105 transition-transform items-center space-x-4 rounded-2xl border p-3 sm:p-4 bg-white border-neutral-100">
                  <PhonePlusIcon className="w-5 drop-shadow-md self-start pt-2" />
                  <div className="flex-1 flex flex-col gap-1 text-left text-sm">
                    <h4 className="font-semibold text-lg">Choir Members</h4>
                    <p className="font-medium leading-none flex gap-2 text-neutral-400">
                      <UserPlusIcon width={'1em'} /> 32 members
                    </p>
                    <p className="text-xs text-accent mt-2">Contacts saved to drive</p>
                  </div>
                </div>
              </li>
            </ul>
          </section>
          <section className="flex flex-col">
            <h3 className="text-2xl font-medium border-b border-b-neutral-200 pb-2 mb-4">
              Goto <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
            </h3>
            <ul className=" flex flex-col gap-4 text-neutral-500">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a className="font-semibold">Save Contacts</a>
              </li>
            </ul>
          </section>
        </aside>
        <section></section>
      </main>
      <footer className="self-end mt-20 p-14 max-sm:px-10 relative flex items-center bg-secondary/20">
        <h2 className="text-6xl max-sm:text-4xl inline-block">
          <VicfIcon width={'1em'} />
        </h2>
        <nav className="ml-6 text-sm text-muted font-medium">
          <ul className="flex gap-4">
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a className="font-bold">Save Contacts</a>
            </li>
          </ul>
        </nav>
        <ul className="flex gap-4 ml-auto text-xl">
          <li>
            <a>
              <FacebookIcon width={'1em'} />
            </a>
          </li>
          <li>
            <a>
              <InstagramIcon width={'1em'} />
            </a>
          </li>
        </ul>
        <span className="absolute m-4 text-xs -bottom-2 w-max mx-auto text-center inset-x-0 text-muted">
          Copyright{' '}
          <VicfIcon width="20px" className="text-neutral-600 inline-block align-baseline" /> 2023
        </span>
      </footer>
      {/* <AppRouter /> */}
    </>
  )
}

export default App
