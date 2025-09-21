import { NavigationLink } from '@/components/ui/navigation-link'
import { BellIcon, ChevronDownIcon, SettingsIcon } from '@/assets/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import NavigationCard from '@/components/NavigationCard'
import { abbreviateName, cn } from '@/lib/utils'
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
import { useEffect, useMemo, useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useManager } from '@/hooks/useManager'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useManagerActions } from '@/hooks/useManagerActions'
import { useToggle } from '@/hooks/useToggle'
import Loader from '@/components/ui/loader'
import { throttleAsync } from '@/lib/utils/throttle'

const NavigationBar = () => {
  const navIconClass = cn('w-8 max-md:w-6')
  const navigate = useNavigate()
  const { loggedIn } = useUser()
  const { url_id } = useContacts()
  const managers = useManager()
  const contactManager = useMemo(() => {
    return managers.find(mngr => mngr.url_id == url_id)
  }, [managers, url_id])
  const isInManager = Boolean(contactManager)
  const [slug_type, setSlugType] = useState<'title_number' | 'title_hash' | undefined>(undefined)
  useEffect(() => {
    if (contactManager?.preferences?.slug_type) setSlugType(contactManager?.preferences?.slug_type)
  }, [contactManager])
  const queryClient = useQueryClient()
  const { updateListingSlugType } = useManagerActions()
  const updateContactSlugType = useMutation({
    mutationKey: ['manager', contactManager?.url_id, 'slug'],
    mutationFn: (data: { slug_type: 'title_number' | 'title_hash' }) =>
      updateListingSlugType(contactManager?._id as string, data.slug_type, loggedIn),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['contacts', contactManager?.url_id] })
    }
  })

  const [isUpdatingSlug, toggleUpdatingSlug] = useToggle(false)

  async function handleSlugUpdate() {
    toggleUpdatingSlug()
    await updateContactSlugType.mutateAsync({ slug_type: slug_type! })
    toggleUpdatingSlug()
  }

  return (
    <nav className="contents">
      <ul className="flex items-center gap-6 max-lg:gap-4">
        <li className='inline-grid stacker'>
          {contactManager?.users_editing?.slice(0, 2).map((editor, i) => {
            return <div  key={editor._id} title={editor.name} className={`text-white aspect-square w-16 grid place-content-center  rounded-full font-bold p-2 border-white shadow border text-2xl`} style={{ marginLeft: `${-i}rem`, backgroundColor: editor?.color || 'hsl(var(--muted))' }}>{abbreviateName(editor.name)}</div>
          })}
          {contactManager?.users_editing?.length && contactManager?.users_editing?.length > 2 ? <div className={`text-white aspect-square w-16 grid place-content-center  rounded-full font-bold p-2 bg-muted border-white shadow border text-2xl`} style={{ marginLeft: `-3rem`}}>+{contactManager?.users_editing?.length - 2}</div> : null}
        </li>
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
        {isInManager && (
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
                    <Select
                      value={slug_type}
                      onValueChange={(val: string) => setSlugType(val as typeof slug_type)}
                    >
                      <SelectTrigger className="w-[9.75rem]">
                        <SelectValue defaultValue={contactManager?.preferences?.slug_type} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className={cn('hover:bg-neutral-50', {
                            'bg-neutral-100': slug_type == 'title_number'
                          })}
                          value="title_number"
                        >
                          Title + number
                        </SelectItem>
                        <SelectItem
                          className={cn('hover:bg-neutral-50', {
                            'bg-neutral-100': slug_type == 'title_hash'
                          })}
                          value="title_hash"
                        >
                          Title + hash
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </li>
                </ul>

                <Button
                  variant={'secondary'}
                  className="mt-5 w-full"
                  disabled={isUpdatingSlug || slug_type == contactManager?.preferences?.slug_type}
                  onClick={throttleAsync(handleSlugUpdate, 1000)}
                >
                  Apply Settings {isUpdatingSlug && <Loader />}
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
        <li>
          {loggedIn ? (
            <NavigationCard />
          ) : (
            <Button
              variant={'secondary'}
              className="px-8 shadow-sm hover:text-white"
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
