import { ClockRewindIcon, HomeSmileIcon, PlusIcon, UsersOrgIcon, VicfIcon } from '@/assets/icons'
import { NavigationLink } from './navigation-link'
import { cn } from '@/lib/utils'

import { MutableRefObject, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '@/hooks/useClickOutside'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { useSidenav } from './../../hooks/useSidenav'
import GroupCard from '../GroupCard'
import CreateNewButton from '../CreateNewButton'
import { useManager } from '@/hooks/useManager'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Sidenav = () => {
  const [open, , setOpen] = useSidenav()
  const openCount = useRef<number>(0)
  const sidenavRef = useRef<HTMLDivElement>(null)
  const manager = useManager()
  const location = useLocation()
  const isOnSave = location.pathname.includes('/save')
  // const isOnHome = location.pathname.includes('/home')

  useEffect(() => {
    if (open) openCount.current += 1
  }, [open, openCount])

  useClickOutside<HTMLDivElement>(e => {
    e.stopPropagation()
    if ((e.target as HTMLElement).dataset['sidenavToggle'] === 'true') return
    if (open) {
      setOpen(false)
    }
  }, sidenavRef as MutableRefObject<HTMLDivElement>)

  const lgScreen = useMediaQuery('(min-width: 1024px)')

  useUpdateEffect(() => {
    if (lgScreen && open) setOpen(false)
  }, [lgScreen])

  return (
    <>
      {createPortal(
        <div
          className={cn(
            'fixed inset-0 z-[4000] bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out',
            {
              'pointer-events-auto opacity-100': open,
              'pointer-events-none opacity-0': !open
            }
          )}
        ></div>,
        document.querySelector('#sidenav-overlay') as Element
      )}
      <div className="contents">
        <aside
          ref={sidenavRef}
          className={cn(
            'sidenav pointer-events-auto grid transform gap-16 overflow-y-auto scroll-smooth border-neutral-50 py-10 pl-8 pr-8 transition-transform duration-300 ease-in-out max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-[5000] max-lg:h-full max-lg:w-[300px] max-lg:bg-white sm:pl-14 md:border-r-2',
            {
              'max-lg:-translate-x-full max-lg:opacity-0 max-md:pointer-events-none': !open,
              'max:md:pointer-events-auto max-lg:translate-x-0 max-lg:opacity-100': open
            }
          )}
        >
          {!lgScreen && (
            <Link to="/home" className="text-5xl">
              <VicfIcon width={'1em'} />
            </Link>
          )}
          <div onClick={() => setOpen(false)}>
            <CreateNewButton className="-mb-10 w-full py-6 max-lg:order-2 lg:mt-4" />
          </div>
          <section className="flex flex-col max-lg:order-1">
            <h3 className="text-md mb-4 pb-2 text-lg font-medium text-neutral-400">
              Goto <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
            </h3>
            <ul className="flex flex-col gap-6 text-base text-neutral-600">
              <li className="flex items-center gap-4">
                <HomeSmileIcon className="text-neutral-500" />
                <NavigationLink to="/home" className="after:!mix-blend-normal">
                  Home
                </NavigationLink>
              </li>
              <li className="flex items-center gap-4">
                <UsersOrgIcon className="text-neutral-500" />
                <NavigationLink to="/organisations" className="after:!mix-blend-normal">
                  Organisations
                </NavigationLink>
              </li>
              {!isOnSave && (
                <li className="flex items-center gap-4">
                  <PlusIcon className="text-neutral-500" />
                  <NavigationLink to="/save" className="after:!mix-blend-normal">
                    Save Contacts
                  </NavigationLink>
                </li>
              )}
            </ul>
          </section>
          <section className="flex flex-col max-lg:order-3 max-lg:mt-8">
            <h3 className="text-md mb-4 pb-2 text-lg font-medium text-neutral-400">
              Recents <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
            </h3>
            <ul className="space-y-2">
              {[...manager.slice(-2)].map(entry => {
                return (
                  <li key={entry._id}>
                    <GroupCard
                      url_id={entry.url_id}
                      group_name={entry.name}
                      status={!entry.backed_up ? 'not-uploaded' : 'uploaded'}
                      contacts_num={entry.contacts_count}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        </aside>{' '}
      </div>
    </>
  )
}

export default Sidenav
