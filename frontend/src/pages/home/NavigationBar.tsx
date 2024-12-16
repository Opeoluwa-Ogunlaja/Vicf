import NavigationCard from '@/components/NavigationCard'
import SidenavToggle from '@/components/SidenavToggle'
import { Button } from '@/components/ui/button'
import { BellIcon, VicfIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'

const NavigationBar = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  return (
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
  )
}

export default NavigationBar
