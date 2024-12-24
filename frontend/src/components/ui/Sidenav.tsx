import { ClockRewindIcon } from '@/assets/icons'
import { Button } from './button'
import { NavigationLink } from './navigation-link'
import { cn } from '@/lib/utils'

import { MutableRefObject, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '@/hooks/useClickOutside'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import { useSidenav } from './../../hooks/useSidenav'
import GroupCard from '../GroupCard'

const Sidenav = () => {
  const [open, , setOpen] = useSidenav()
  const openCount = useRef<number>(0)
  const sidenavRef = useRef<HTMLDivElement>(null)

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
            'top-0 h-full w-full bg-black bg-opacity-50 bg-blend-screen transition-opacity duration-200 max-lg:z-[500000000]',
            {
              'pointer-events-none fixed opacity-100': open,
              'invisible absolute opacity-0': !open
            }
          )}
        ></div>,
        document.querySelector('#sidenav-overlay') as Element
      )}
      <div className="contents" ref={sidenavRef}>
        <aside
          className={cn(
            'sidenav grid gap-20 overflow-y-auto scroll-smooth bg-white px-12 py-10 transition-all duration-500 max-lg:pointer-events-auto max-lg:fixed max-lg:inset-x-0 max-lg:left-0 max-lg:top-0 max-lg:z-[50000000000] max-lg:h-full max-lg:w-[300px] max-lg:gap-10 max-lg:justify-self-stretch',
            {
              'max-lg:invisible max-lg:max-w-0 max-lg:overflow-hidden max-lg:opacity-0': !open,
              closed: !open,
              'open w-max max-lg:visible max-lg:max-w-[300px] max-lg:px-6 max-lg:opacity-100': open
            }
          )}
        >
          <Button variant={'secondary'} className="-mb-10 py-6 max-lg:order-2 lg:mt-10">
            Create New
          </Button>
          <section className="flex flex-col max-lg:order-3 max-lg:mt-8">
            <h3 className="mb-4 border-b border-b-neutral-200 pb-2 text-2xl font-medium max-lg:text-lg">
              Recents <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
            </h3>
            <ul className="space-y-2">
              <li>
                <GroupCard
                  group_name="Geology Department"
                  status="not-uploaded"
                  contacts_num={32}
                />
              </li>
              <li>
                <GroupCard group_name="Choir Members" status="uploaded" contacts_num={32} />
              </li>
            </ul>
          </section>
          <section className="flex flex-col max-lg:order-1">
            <h3 className="mb-4 border-b border-b-neutral-200 pb-2 text-2xl font-medium max-lg:text-lg">
              Goto <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
            </h3>
            <ul className="flex flex-col gap-4 text-neutral-500">
              <li>
                <NavigationLink to="/" className="after:!mix-blend-normal">
                  Home
                </NavigationLink>
              </li>
              <li>
                <NavigationLink to="/dashboard" className="after:!mix-blend-normal">
                  Dashboard
                </NavigationLink>
              </li>
              <li>
                <NavigationLink to="/save" className="after:!mix-blend-normal">
                  Save Contacts
                </NavigationLink>
              </li>
            </ul>
          </section>
        </aside>{' '}
      </div>
    </>
  )
}

export default Sidenav