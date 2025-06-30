import { AnnouncementIcon } from '@/assets/icons'
import NavigationBar from '../home/NavigationBar'
import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'

import CreateNewOrganisation from '@/components/CreateNewOrganisation'
import { useUser } from '@/hooks/useUser'
import { Navigate } from 'react-router-dom'
import OrganisationsListing from './OrganisationsListing'
import { useQuery } from '@tanstack/react-query'
import { get_organisations_for_me } from '@/lib/utils/requestUtils'

const Organisations = () => {
  const { loggedIn, user } = useUser()
  const { data: myOrganisations, isLoading: loadingOrganisations } = useQuery({
    queryFn: get_organisations_for_me,
    queryKey: ['organisations', user?.id],
    enabled: loggedIn
  })

  if (!loggedIn) return <Navigate replace to="/auth" />

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

          {loadingOrganisations ? (
            <span>Loading Organisations</span>
          ) : (
            <OrganisationsListing organisations={myOrganisations} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Organisations
