import { Suspense } from 'react'
import { Await, useRouteLoaderData } from 'react-router-dom'
import LoadingScreen from '../components/LoadingScreen'
import { MultiBackgroundPatterns } from '@/components/ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import ContactsTable from '@/components/ContactsTable'
import Sidenav from '@/components/ui/Sidenav'

import {
  AnnouncementIcon,
  BellIcon,
  FacebookIcon,
  InstagramIcon,
  SettingsIcon,
  VicfIcon
} from '@/assets/icons'
import { cn } from '@/lib/utils'
import NavigationCard from '@/components/NavigationCard'
import ContactForm from '@/components/ContactForm'
import { NavigationLink } from '@/components/ui/navigation-link'

const CreateLayout = ({ name }: { name: string }) => {
  const navIconClass = cn('w-8 max-md:w-6')
  console.log(name)
  return (
    <div className="animate-in">
      <aside className="space-x-2 bg-secondary py-2 text-center font-medium max-md:text-xs">
        <AnnouncementIcon className="inline-block w-5 align-middle max-md:w-3" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="relative grid h-[426px] overflow-hidden bg-primary px-16 py-4 max-md:px-8 max-sm:px-3">
        <div className="flex items-center justify-between self-start">
          <div className="max-md flex gap-4 md:contents">
            <button className="text-lg font-bold text-white drop-shadow-sm md:hidden">
              &#9776;
            </button>
            <a href="/" className="text-5xl text-secondary">
              <VicfIcon width={'1em'} />
            </a>
          </div>

          <nav className="contents">
            <ul className="flex items-center gap-6">
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
                <a href="" className="text-white">
                  <SettingsIcon className={navIconClass} />
                </a>
              </li>
              <li>
                <NavigationCard />
              </li>
            </ul>
          </nav>
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
        <section className="my-4 overflow-hidden px-8">
          <div className="form-container pointer-events-none absolute inset-0 z-50 grid h-full w-full grid-rows-12 place-content-center place-items-center overflow-hidden">
            <div className="min-lg:mt-24 pointer-events-auto static z-[500] row-start-3 w-[520px] origin-top place-self-start rounded-xl bg-white px-12 py-5 shadow-neutral-300 drop-shadow-lg transition-all max-lg:row-start-4 max-sm:max-w-[286px] max-sm:px-8">
              <ContactForm />
            </div>
          </div>
          <ContactsTable className="mt-24 max-sm:mt-4" />
        </section>
      </main>
      <footer className="relative mt-20 flex items-center justify-center self-end bg-secondary/20 p-14 max-md:flex-col max-md:gap-8 max-sm:px-10">
        <h2 className="inline-block text-6xl max-md:text-4xl">
          <VicfIcon width={'1em'} />
        </h2>
        <nav className="text-sm font-medium text-muted md:ml-6">
          <ul className="flex gap-4 text-center max-md:flex-col max-md:justify-center">
            <li>
              <NavigationLink to="/">Home</NavigationLink>
            </li>
            <li>
              <NavigationLink to="/dashboard">Dashboard</NavigationLink>
            </li>
            <li>
              <NavigationLink to="/create">Save Contacts</NavigationLink>
            </li>
          </ul>
        </nav>
        <ul className="max-md-justify-center flex gap-4 text-xl md:ml-auto">
          <li>
            <a>
              <FacebookIcon width={'1em'} />
            </a>
          </li>
          <li>
            <a>
              <InstagramIcon width={'1em'} />
            </a>
          </li>
        </ul>
        <span className="absolute inset-x-0 -bottom-2 m-4 mx-auto w-max text-center text-xs text-muted">
          Copyright{' '}
          <VicfIcon width="20px" className="inline-block align-baseline text-neutral-600" /> 2023
        </span>
      </footer>
    </div>
  )
}

const Create = () => {
  const { promise } = useRouteLoaderData('root') as { promise: { name: string } }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={promise} errorElement={<>Error</>}>
        {({ name }) => <CreateLayout name={name} />}
      </Await>
    </Suspense>
  )
}

export default Create
