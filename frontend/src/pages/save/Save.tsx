import { MultiBackgroundPatterns } from '@/components/ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import ContactsTable from '@/components/ContactsTable'
import Sidenav from '@/components/ui/Sidenav'

import { AnnouncementIcon, VicfIcon } from '@/assets/icons'
import ContactForm from '@/components/ContactForm'
// import { useSidenav } from '@/hooks/useSidenav'
// import { useContacts } from '@/hooks/useContacts'
import ContactsProvider from '@/hoc/ContactsProvider'
import SidenavToggle from '@/components/SidenavToggle'
import Footer from '@/components/Footer'
import { useUser } from '@/hooks/useUser'
import NavigationBar from './NavigationBar'
import { Await, useParams, useRouteLoaderData, useSearchParams } from 'react-router-dom'
import { FC, memo, ReactNode, Suspense } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { ContactManager } from '@/types/contacts_manager'
import { Button } from '@/components/ui/button'
import LoadingScreen from '@/components/LoadingScreen'
import { Link } from 'react-router-dom'

const SaveLayout: FC<{ name?: string }> = memo(() => {
  const contacts = useContacts()
  const { contacts_manager_promise } = useRouteLoaderData('root') as {
    contacts_manager_promise: Promise<ContactManager | null>
  }

  const exportJSON = async () => {
    try {
      const all_contacts_export = contacts.contacts
      const json_contacts = JSON.stringify(all_contacts_export, null, 2)
      const blob = new Blob([json_contacts], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${contacts.url_id}.json`
      link.href = url
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="animate-in">
      <aside className="space-x-2 bg-secondary py-2 text-center font-medium max-md:text-xs">
        <AnnouncementIcon className="inline-block w-5 align-middle max-md:w-3" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="relative grid h-[426px] overflow-hidden bg-primary px-16 py-4 max-md:px-8 max-sm:px-3">
        <div className="flex items-center justify-between self-start">
          <div className="max-md flex gap-4 md:contents">
            <SidenavToggle />
            <Link to="/home" className="text-5xl text-secondary">
              <VicfIcon width={'1em'} />
            </Link>
          </div>
          <NavigationBar />
        </div>
        <div className="absolute inset-0 space-y-2 self-center text-center text-white max-md:-mt-20">
          <h3 className="text-3xl font-bold max-sm:text-2xl">Let’s Save Some Contacts</h3>
          <p className="mx-auto flex items-start justify-center gap-2 text-sm text-white text-opacity-85">
            <AnnouncementIcon width={'16px'} className="align-baseline" />
            <span className="max-w-[35ch] max-md:max-w-[28ch]">
              Tip: Use the "Overwrite name" checkbox to give contact a custom name
            </span>
          </p>
        </div>

        <MultiBackgroundPatterns
          count={4}
          className="aspect-square w-64 opacity-20"
          source={BgPatternImage}
        />
      </header>
      <main className="main-wrapper grid max-lg:grid-cols-1">
        <Sidenav />
        <section className="px-8">
          <div className="form-container pointer-events-none absolute inset-0 z-50 grid h-[100dvh] w-full grid-rows-12 place-content-center place-items-center">
            <div className="pointer-events-auto static z-[500] mx-auto mt-80 w-[520px] origin-top place-self-start rounded-xl bg-white px-12 py-5 shadow-neutral-300 drop-shadow-lg transition-all max-lg:mt-[19.5rem] max-sm:mt-72 max-sm:w-10/12 max-sm:min-w-[300px] max-sm:px-8">
              <Suspense fallback={<>Loading</>}>
                <Await resolve={contacts_manager_promise} errorElement={<ContactForm />}>
                  {() => <ContactForm />}
                </Await>
              </Suspense>
            </div>
          </div>
          <ContactsTable
            url_id={contacts.url_id || ''}
            contacts={contacts.contacts}
            className="mt-16 max-sm:mt-4"
          />
          <div className="mt-10 border border-dashed border-primary p-2 lg:max-w-max">
            <h3 className="font-medium">Export Contacts As:</h3>
            <div className="mt-2 flex flex-1 flex-wrap gap-x-2 gap-y-3 max-lg:flex-col">
              <Button variant={'outline'}>Virtual Contact File (.vcf)</Button>
              <Button variant={'outline'} onClick={exportJSON}>
                JSON (.json)
              </Button>
              <Button variant={'outline'}>CSV (.csv)</Button>
              <Button className="bg-green-500 text-white">Excel Document (.xlsx)</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
})

const SaveHOC: FC<{ children: ReactNode }> = ({ children }) => {
  const { id } = useParams()
  const params = useSearchParams()

  const { contacts_manager_promise } = useRouteLoaderData('root') as {
    contacts_manager_promise: Promise<ContactManager | null>
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={contacts_manager_promise} errorElement={children}>
        {manager => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const contactManager = manager.find((mngr: any) => mngr.url_id == id)
          const isInManager = Boolean(contactManager)
          const isNew = params[0].has('new')
          if (!isNew) {
            if (!isInManager) console.log()
          }
          return children
        }}
      </Await>
    </Suspense>
  )
}

const Save = () => {
  const { user, loggedIn } = useUser()
  const { id } = useParams()

  return (
    <SaveHOC>
      <ContactsProvider url_id={id as string} key={id as string}>
        <SaveLayout name={loggedIn ? (user!.name as string) : ''} />
      </ContactsProvider>
    </SaveHOC>
  )
}

export default Save
