import { BellIcon, VicfIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import NavigationCard from '@/components/NavigationCard'
import SidenavToggle from '@/components/SidenavToggle'
import { Button } from '@/components/ui/button'
import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import { useUser } from '@/hooks/useUser'

const Home = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  const { user } = useUser()

  console.log(user)

  return (
    <>
      <div className="contents h-full w-full overflow-hidden animate-in">
        <header className="relative w-full px-16 pt-4 max-md:px-8 max-sm:px-3">
          <div className="flex items-center justify-between self-start border-b border-b-neutral-200 pb-4">
            <div className="gap-4 max-md:flex md:contents">
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
