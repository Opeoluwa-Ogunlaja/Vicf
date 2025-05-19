import NavigationCard from '@/components/NavigationCard'
import SidenavToggle from '@/components/SidenavToggle'
import { Button } from '@/components/ui/button'
import { BellIcon, VicfIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useOnline } from '@/hooks/useOnline'

const NavigationBar = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  const navigate = useNavigate()
  const { loggedIn } = useUser()
  const { isOnline } = useOnline()

  return (
    <header className="relative w-full px-16 pt-3 max-md:px-8 max-sm:px-3">
      <div className="flex items-center justify-between self-start border-b border-b-neutral-200 pb-3">
        <div className="gap-4 max-lg:flex lg:contents">
          <SidenavToggle className="text-neutral-600" />
          <Link to="/home" className="text-5xl">
            <VicfIcon width={'1em'} />
          </Link>
        </div>

        <nav className="contents">
          <ul className="flex items-center gap-6 max-lg:gap-4">
            <li>
              <a href="">
                <BellIcon className={navIconClass} />
              </a>
            </li>
            <li>
              {isOnline ? (
                <button className="flex items-center gap-2">
                  <span className="mb-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="self-center">Online</span>
                </button>
              ) : (
                <button className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-neutral-200"></span>
                  <span className="self-center">Offline</span>
                </button>
              )}
            </li>
            <li>
              {loggedIn ? (
                <NavigationCard />
              ) : (
                <Button
                  className="bg-white px-8 text-primary shadow-sm"
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
