import { AnnouncementIcon } from '@/assets/icons'
import NavigationBar from '../home/NavigationBar'
import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import OrganisationCard from '@/components/OrganisationCard'
import CreateNewOrganisation from '@/components/CreateNewOrganisation'

const Organisations = () => {
  return (
    <div className="contents h-full w-full overflow-hidden animate-in">
      <aside className="space-x-2 bg-neutral-600 py-2 text-center text-sm text-white max-md:text-xs">
        <AnnouncementIcon className="inline-block w-5 align-middle max-md:w-3" />
        <p className="inline-block">Tip: Use the settings page to customise your display</p>
      </aside>
      <NavigationBar />
      <main
        className="main-wrapper grid max-lg:grid-cols-1"
        style={{
          boxShadow: 'inset .25rem 1.75rem 1.25rem -2.5rem var(--tw-shadow-color)'
        }}
      >
        <Sidenav />
        <div
          className="grid px-10 pt-16 max-md:px-8 max-md:py-14"
          style={{
            gridAutoRows: 'max-content',
            container: 'main-section / inline-size'
          }}
        >
          <h3 className="mb-8 text-lg font-medium">
            Your Organisations <CreateNewOrganisation className="ml-4 py-4" />
          </h3>

          <section className="organisations-grid grid justify-between gap-10 pb-10 max-md:justify-center">
            <OrganisationCard organisation={{ name: 'Hehe' }}></OrganisationCard>
            <OrganisationCard organisation={{ name: 'Hehe' }}></OrganisationCard>
            <OrganisationCard organisation={{ name: 'Hehe' }}></OrganisationCard>
            <OrganisationCard organisation={{ name: 'Hehe' }}></OrganisationCard>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Organisations
