import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import NavigationBar from './NavigationBar'
import BlockCard from '@/components/BlockCard'
import { useManager } from '@/hooks/useManager'
import { Await, useRouteLoaderData } from 'react-router-dom'
import { ContactManager } from '@/types/contacts_manager'
import { Suspense } from 'react'
import Skeleton from 'react-loading-skeleton'

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
        <NavigationBar />
        <main className="main-wrapper grid max-lg:grid-cols-1">
          <Sidenav />
          <section className="contacts-grid grid gap-8 px-5 pb-10 pt-16 max-md:justify-center">
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
                        <p className="font-medium text-neutral-400">You don't have any listinga</p>
                      )}
                    </>
                  )
                }}
              </Await>
            </Suspense>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
