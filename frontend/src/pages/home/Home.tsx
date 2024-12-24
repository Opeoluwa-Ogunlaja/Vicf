import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import { useUser } from '@/hooks/useUser'
import NavigationBar from './NavigationBar'
import BlockCard from '@/components/BlockCard'

const Home = () => {
  const { user } = useUser()

  console.log(user)

  return (
    <>
      <div className="contents h-full w-full overflow-hidden animate-in">
        <NavigationBar />
        <main className="main-wrapper grid max-lg:grid-cols-1">
          <Sidenav />
          <section className="contacts-grid grid gap-8 px-5 pb-10 pt-16 max-md:justify-center">
            <BlockCard />
            <BlockCard />
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
