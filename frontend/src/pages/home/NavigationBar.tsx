import NavigationCard from '@/components/NavigationCard'
import SidenavToggle from '@/components/SidenavToggle'
import { Button } from '@/components/ui/button'
import { BellIcon, VicfIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useNavigate } from 'react-router-dom'
import CreateNewButton from '@/components/CreateNewButton'

const NavigationBar = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  const navigate = useNavigate()
  const { loggedIn } = useUser()

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
              <CreateNewButton />
            </li>
            <li>
              <a href="">
                <BellIcon className={navIconClass} />
              </a>
            </li>
            <li>
              {loggedIn ? (
                <NavigationCard />
              ) : (
                <Button
                  variant={'secondary'}
                  className="px-8 shadow-sm"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default NavigationBar
