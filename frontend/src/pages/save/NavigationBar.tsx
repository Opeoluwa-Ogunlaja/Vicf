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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
} from '@/components/ui/select'

const NavigationBar = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  const navigate = useNavigate()
  const { loggedIn } = useUser()
  return (
    <nav className="contents">
      <ul className="flex items-center gap-6 max-lg:gap-4">
        <li className="inline-flex max-md:hidden">
          <NavigationLink
            to="/home"
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
              <h4 className="mb-4 font-semibold">Collection Settings</h4>
              <ul>
                <li className="flex justify-between">
                  <p className="mt-2 text-sm text-neutral-500">Slug type</p>
                  <Select>
                    <SelectTrigger className="w-[156px]">
                      <SelectValue defaultValue={'title_number'} placeholder="Title + Number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title_number">Title + number</SelectItem>
                      <SelectItem value="title_hash">Title + hash</SelectItem>
                    </SelectContent>
                  </Select>
                </li>
              </ul>

              <Button variant={'secondary'} className="mt-5 w-full" disabled>
                Apply Settings
              </Button>
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
