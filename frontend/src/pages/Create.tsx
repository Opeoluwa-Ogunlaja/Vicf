import { Suspense } from 'react'
import { Await, useRouteLoaderData } from 'react-router-dom'
import LoadingScreen from '../components/LoadingScreen'
import BackgroundPattern from '@/components/ui/BackgroundPattern'
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

const CreateLayout = ({ name }: { name: string }) => {
  const navIconClass = cn('w-8 max-md:w-6')
  console.log(name)
  return (
    <div className="animate-in opacity-100">
      <aside className="bg-secondary max-md:text-xs text-center py-2 font-medium space-x-2">
        <AnnouncementIcon className="align-middle w-5 max-md:w-3 inline-block" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <header className="h-[426px] bg-primary py-4 px-16 max-md:px-8 max-sm:px-3 grid relative overflow-hidden">
        <div className="flex items-center justify-between self-start">
          <div className="md:contents max-md flex gap-4">
            <button className="font-bold text-white drop-shadow-sm text-lg md:hidden">
              &#9776;
            </button>
            <a href="/" className="text-5xl text-secondary">
              <VicfIcon width={'1em'} />
            </a>
          </div>

          <nav className="contents">
            <ul className="flex items-center gap-6">
              <li className="inline-flex max-md:hidden">
                <a href="" className="text-sm text-white">
                  Save Contacts
                </a>
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
        <div className="text-center absolute inset-0 space-y-2 max-md:-mt-20 text-white self-center">
          <h3 className="font-bold text-3xl max-sm:text-2xl">Let’s Save Some Contacts</h3>
          <p className="text-sm flex items-start justify-center gap-2 text-white text-opacity-85 mx-auto">
            <AnnouncementIcon width={'16px'} className="align-baseline" />
            <span className="max-w-[35ch] max-md:max-w-[28ch]">
              Tip: Use the "Overwrite name" checkbox to give contact a custom name
            </span>
          </p>
        </div>

        <BackgroundPattern className="opacity-20 w-64 aspect-square" source={BgPatternImage} />
        <BackgroundPattern className="opacity-20 w-64 aspect-square" source={BgPatternImage} />
      </header>
      <main className="main-wrapper grid max-lg:grid-cols-1">
        <Sidenav />
        <section className="my-4 px-6 py-10">
          <div className="form-container absolute grid place-items-center inset-0 h-full w-full pointer-events-none bg-pink grid-rows-12">
            <div className="pointer-events-auto absolute content-start z-40 row-start-6 bg-white p-8 rounded-xl min-h-[200px] origin-top">
              <form action="">
                <input type="text" name="" id="" />
              </form>
            </div>
          </div>
          <ContactsTable />
        </section>
      </main>
      <footer className="self-end mt-20 p-14 max-md:gap-8 max-sm:px-10 relative flex max-md:flex-col justify-center items-center bg-secondary/20">
        <h2 className="text-6xl max-md:text-4xl inline-block">
          <VicfIcon width={'1em'} />
        </h2>
        <nav className="md:ml-6 text-sm text-muted font-medium">
          <ul className="flex max-md:flex-col max-md:justify-center text-center gap-4">
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Dashboard</a>
            </li>
            <li>
              <a className="font-bold">Save Contacts</a>
            </li>
          </ul>
        </nav>
        <ul className="flex max-md-justify-center gap-4 md:ml-auto text-xl">
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
        <span className="absolute m-4 text-xs -bottom-2 w-max mx-auto text-center inset-x-0 text-muted">
          Copyright{' '}
          <VicfIcon width="20px" className="text-neutral-600 inline-block align-baseline" /> 2023
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
