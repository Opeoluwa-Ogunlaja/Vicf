import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import NavigationBar from './NavigationBar'
import BlockCard from '@/components/BlockCard'
import { useManager } from '@/hooks/useManager'
import { Await, useRouteLoaderData } from 'react-router-dom'
import { ContactManager } from '@/types/contacts_manager'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'
import { AnnouncementIcon } from '@/assets/icons'

const SkeletonCon = () => {
  return (
    <>
      {new Array(6).fill(null).map(() => {
        return (
          <div
            className="relative isolate grid min-h-[200px] opacity-40 animate-in"
            style={{
              gridTemplateRows: '170px 1fr'
            }}
          >
            <Skeleton height={'100%'} className="rounded-t-md" />
            <Skeleton count={3} />
          </div>
        )
      })}
    </>
  )
}

const Home = () => {
  const managers = useManager()
  const { contacts_manager_promise } = useRouteLoaderData('root') as {
    contacts_manager_promise: Promise<ContactManager | null>
  }

  return (
    <>
      <div className="contents h-full w-full overflow-hidden animate-in">
        <aside className="space-x-2 bg-secondary py-2 text-center font-medium max-md:text-xs">
          <AnnouncementIcon className="inline-block w-5 align-middle max-md:w-3" />
          <p className="inline-block">Tip: Use the settings page to customise your display</p>
        </aside>
        <NavigationBar />
        <main className="main-wrapper grid max-lg:grid-cols-1">
          <Sidenav />
          <div
            className="grid pt-16"
            style={{
              gridAutoRows: 'max-content'
            }}
          >
            <h3 className="mb-8 text-2xl font-medium">Recent Listings</h3>
            <section className="contacts-grid grid gap-8 pb-10 max-md:justify-center">
              <Suspense fallback={<SkeletonCon />}>
                <Await
                  resolve={contacts_manager_promise}
                  errorElement={
                    managers.length > 0 ? (
                      [...managers]
                        .reverse()
                        .map(manager => <BlockCard manager={manager} key={manager._id} />)
                    ) : (
                      <p className="font-medium text-neutral-400">You don't have any listinga</p>
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
                          <p className="font-medium text-neutral-400">
                            You don't have any listings
                          </p>
                        )}
                      </>
                    )
                  }}
                </Await>
              </Suspense>
            </section>
            <section className="mt-10">
              <h3 className="mb-8 text-2xl font-medium">Organisations</h3>
              <p className="font-medium text-neutral-400">You don't belong to any organisations</p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
