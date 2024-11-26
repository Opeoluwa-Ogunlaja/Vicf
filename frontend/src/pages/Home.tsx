// import { Suspense } from 'react'
// import { Await, useRouteLoaderData } from 'react-router-dom'
// import LoadingScreen from '../components/LoadingScreen'
// import { MultiBackgroundPatterns } from '@/components/ui/BackgroundPattern'
// import { BgPatternImage } from '@/assets/images'
// import ContactsTable from '@/components/ContactsTable'
// import Sidenav from '@/components/ui/Sidenav'

import { BellIcon, ChevronDownIcon, SettingsIcon, VicfIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import NavigationCard from '@/components/NavigationCard'
// import { NavigationLink } from '@/components/ui/navigation-link'
// import { useSidenav } from '@/hooks/useSidenav'
// import { useContacts } from '@/hooks/useContacts'
// import ContactsProvider from '@/hoc/ContactsProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import SidenavToggle from '@/components/SidenavToggle'
import { Button } from '@/components/ui/button'
import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'

const Home = () => {
  const navIconClass = cn('w-8 max-md:w-6')

  return (
    <>
      <div className="contents h-full w-full overflow-hidden animate-in">
        <header className="relative w-full px-16 pt-4 max-md:px-8 max-sm:px-3">
          <div className="flex items-center justify-between self-start border-b border-b-neutral-200 pb-4">
            <div className="max-md flex gap-4 md:contents">
              <SidenavToggle className="text-neutral-600" />
              <a href="/" className="text-5xl">
                <VicfIcon width={'1em'} />
              </a>
            </div>

            <nav className="contents">
              <ul className="flex items-center gap-6 max-lg:gap-4">
                <li className="inline-flex max-md:hidden">
                  <Button variant={'secondary'}>Create New</Button>
                </li>
                <li>
                  <a href="">
                    <BellIcon className={navIconClass} />
                  </a>
                </li>
                <li>
                  <DropdownMenu defaultOpen={false}>
                    <DropdownMenuTrigger className="flex items-center lg:gap-1">
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
        </header>
        <main className="main-wrapper grid max-lg:grid-cols-1">
          <Sidenav />
          <div></div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
