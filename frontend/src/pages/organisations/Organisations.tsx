import { AnnouncementIcon } from '@/assets/icons'
import NavigationBar from '../home/NavigationBar'
import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'

const Organisations = () => {
  return (
    <div className="contents h-full w-full overflow-hidden animate-in">
      <aside className="space-x-2 bg-neutral-600 py-2 text-center text-sm text-white max-md:text-xs">
        <AnnouncementIcon className="inline-block w-5 align-middle max-md:w-3" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <NavigationBar />
      <main
        className="main-wrapper grid bg-primary/5 shadow-neutral-600 max-lg:grid-cols-1"
        style={{
          boxShadow: 'inset .25rem 1.75rem 1.25rem -2.5rem var(--tw-shadow-color)'
        }}
      >
        <Sidenav />
      </main>
      <Footer />
    </div>
  )
}

export default Organisations
