import { NavigationLink } from '@/components/ui/navigation-link'
import { BellIcon, ChevronDownIcon, SettingsIcon } from '@/assets/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import NavigationCard from '@/components/NavigationCard'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const NavigationBar = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  const navigate = useNavigate()
  const { loggedIn } = useUser()
  return (
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
              <ChevronDownIcon className={cn('origin-center transition-transform')} />
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
  )
}

export default NavigationBar
