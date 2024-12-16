import { MultiBackgroundPatterns } from '@/components/ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import ContactsTable from '@/components/ContactsTable'
import Sidenav from '@/components/ui/Sidenav'

import { AnnouncementIcon, BellIcon, ChevronDownIcon, SettingsIcon, VicfIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import NavigationCard from '@/components/NavigationCard'
import ContactForm from '@/components/ContactForm'
import { NavigationLink } from '@/components/ui/navigation-link'
// import { useSidenav } from '@/hooks/useSidenav'
// import { useContacts } from '@/hooks/useContacts'
import ContactsProvider from '@/hoc/ContactsProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import SidenavToggle from '@/components/SidenavToggle'
import Footer from '@/components/Footer'
import { useUser } from '@/hooks/useUser'

const CreateLayout = ({ name }: { name: string }) => {
  const navIconClass = cn('w-8 max-md:w-6')
  console.log(name)

  return (
    <div className="animate-in">
      <aside className="space-x-2 bg-secondary py-2 text-center font-medium max-md:text-xs">
        <AnnouncementIcon className="inline-block w-5 align-middle max-md:w-3" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="relative grid h-[426px] overflow-hidden bg-primary px-16 py-4 max-md:px-8 max-sm:px-3">
        <div className="flex items-center justify-between self-start">
          <div className="max-md flex gap-4 md:contents">
            <SidenavToggle />
            <a href="/" className="text-5xl text-secondary">
              <VicfIcon width={'1em'} />
            </a>
          </div>

          <nav className="contents">
            <ul className="flex items-center gap-6 max-lg:gap-4">
              <li className="inline-flex max-md:hidden">
                <NavigationLink
                  to="/"
                  className="font-medium text-white contrast-50 saturate-100 sepia after:filter"
                >
                  Home
                </NavigationLink>
              </li>
              <li>
                <a href="" className="text-white">
                  <BellIcon className={navIconClass} />
                </a>
              </li>
              <li>
                <DropdownMenu defaultOpen={false}>
                  <DropdownMenuTrigger className="flex items-center text-white lg:gap-1">
                    <SettingsIcon className={navIconClass} />
                    <ChevronDownIcon
                      width={32}
                      className={cn('origin-center transition-transform')}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    style={{
                      width: `var(--radix-popper-anchor-width)`
                    }}
                    className="mt-2 min-w-72 p-6 max-sm:min-w-48 max-sm:p-3"
                  >
                    <h4 className="font-semibold">Collection Settings</h4>
                    <p className="text-neutral-400 max-sm:text-xs">
                      Adjust <strong>Apo boiz</strong> collection settings
                    </p>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <NavigationCard />
              </li>
            </ul>
          </nav>
        </div>
        <div className="absolute inset-0 space-y-2 self-center text-center text-white max-md:-mt-20">
          <h3 className="text-3xl font-bold max-sm:text-2xl">Let’s Save Some Contacts</h3>
          <p className="mx-auto flex items-start justify-center gap-2 text-sm text-white text-opacity-85">
            <AnnouncementIcon width={'16px'} className="align-baseline" />
            <span className="max-w-[35ch] max-md:max-w-[28ch]">
              Tip: Use the "Overwrite name" checkbox to give contact a custom name
            </span>
          </p>
        </div>

        <MultiBackgroundPatterns
          count={4}
          className="aspect-square w-64 opacity-20"
          source={BgPatternImage}
        />
      </header>
      <main className="main-wrapper grid max-lg:grid-cols-1">
        <Sidenav />
        <section className="my-4 px-8">
          <div className="form-container pointer-events-none absolute inset-0 z-50 grid h-[100dvh] w-full grid-rows-12 place-content-center place-items-center">
            <div className="pointer-events-auto static z-[500] mx-auto mt-80 w-[520px] origin-top place-self-start rounded-xl bg-white px-12 py-5 shadow-neutral-300 drop-shadow-lg transition-all max-lg:mt-[19.5rem] max-sm:mt-72 max-sm:w-10/12 max-sm:min-w-[300px] max-sm:px-8">
              <ContactForm />
            </div>
          </div>
          <ContactsTable className="mt-24 max-sm:mt-4" />
        </section>
      </main>
      <Footer />
    </div>
  )
}

const Create = () => {
  const { user, loggedIn } = useUser()
  return (
    <ContactsProvider>
      <CreateLayout name={loggedIn ? (user!.name as string) : ''} />
    </ContactsProvider>
  )
}

export default Create
