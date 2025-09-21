import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import NavigationBar from './NavigationBar'
import BlockCard from '@/components/BlockCard'
import { useManager } from '@/hooks/useManager'
import { Await, useRouteLoaderData } from 'react-router-dom'
import { ContactManager } from '@/types/contacts_manager'
import { memo, Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import { AnnouncementIcon } from '@/assets/icons'
import { MobileOnlyView } from 'react-device-detect'
import CreateNewButton from '@/components/CreateNewButton'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useUser } from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'
import { get_organisations_for_me } from '@/lib/utils/requestUtils'
import OrganisationsListing from '../organisations/OrganisationsListing'

const SkeletonCon = () => {
  return (
    <>
      {new Array(6).fill(null).map((...[, i]) => {
        return (
          <div
            className="relative isolate grid min-h-[12.5rem] opacity-40 animate-in"
            style={{
              gridTemplateRows: '170px 1fr'
            }}
            key={'skeCon' + i}
          >
            <Skeleton height={'100%'} className="rounded-t-md" />
            <Skeleton count={3} />
          </div>
        )
      })}
    </>
  )
}

const AccessibileCreateButton = memo(() => {
  const smScreen = useMediaQuery('(max-width: 720px)')
  return (
    <MobileOnlyView>{smScreen && <CreateNewButton className="mb-10 w-full py-5" />}</MobileOnlyView>
  )
})

const Home = () => {
  const managers = useManager()
  const { contacts_manager_promise } = useRouteLoaderData('root') as {
    contacts_manager_promise: Promise<ContactManager | null>
  }
  const { loggedIn, user } = useUser()
  
  const { data: myOrganisations, isLoading: loadingOrganisations } = useQuery({
    queryFn: get_organisations_for_me,
    queryKey: ['organisations', user?._id],
    enabled: loggedIn
  })

  return (
    <>
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
            className="grid px-14 pt-10 max-md:px-8 max-md:py-10"
            style={{
              gridAutoRows: 'max-content'
            }}
          >
            <AccessibileCreateButton />
            <h3 className="mb-8 text-lg font-medium">Home</h3>
            <h3 className="mb-6 w-max rounded-full bg-blue-50 px-6 py-2 text-base text-blue-700">
              Listings
            </h3>
            <section className="contacts-grid grid gap-8 pb-10 max-sm:justify-center">
              <Suspense fallback={<SkeletonCon />}>
                <Await
                  resolve={contacts_manager_promise}
                  errorElement={
                    managers.length > 0 ? (
                      [...managers]
                        .reverse()
                        .map(manager => <BlockCard manager={manager} key={manager._id} />)
                    ) : (
                      <p className="font-medium text-neutral-400">You don't have any listings</p>
                    )
                  }
                >
                  {() => {
                    return (
                      <>
                        {managers.length > 0 ? (
                          [...managers]
                            .reverse()
                            .map(manager => <BlockCard manager={manager} key={manager._id} />)
                        ) : (
                          <p className="text-neutral-400">You don't have any listings</p>
                        )}
                      </>
                    )
                  }}
                </Await>
              </Suspense>
            </section>
            {loggedIn && (
              <section className="mt-6">
                <h3 className="mb-6 w-max rounded-full bg-blue-50 px-6 py-2 text-base text-blue-700">
                  Organisations
                </h3>
                {/* <p className="text-neutral-400">You don't belong to any organisations</p> */}
                { !loadingOrganisations ? 
                  <OrganisationsListing organisations={myOrganisations} /> : "Loading Organisations" 
                }
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default memo(Home)
