import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import NavigationBar from './NavigationBar'
import BlockCard from '@/components/BlockCard'
import { useManager } from '@/hooks/useManager'
import { Await, useRouteLoaderData } from 'react-router-dom'
import { ContactManager } from '@/types/contacts_manager'
import { Suspense } from 'react'

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
          <Suspense fallback={<>Loading please wait...</>}>
            <Await
              resolve={contacts_manager_promise}
              errorElement={<>Sorry, unable to get your contact listings now</>}
            >
              {() => {
                return (
                  <section className="contacts-grid grid gap-8 px-5 pb-10 pt-16 max-md:justify-center">
                    {[...managers].reverse().map(manager => (
                      <BlockCard manager={manager} key={manager._id} />
                    ))}
                  </section>
                )
              }}
            </Await>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
