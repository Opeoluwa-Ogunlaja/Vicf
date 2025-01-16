import Sidenav from '@/components/ui/Sidenav'
import Footer from '@/components/Footer'
import NavigationBar from './NavigationBar'
import BlockCard from '@/components/BlockCard'
import { useManager } from '@/hooks/useManager'

const Home = () => {
  const managers = useManager()

  return (
    <>
      <div className="contents h-full w-full overflow-hidden animate-in">
        <NavigationBar />
        <main className="main-wrapper grid max-lg:grid-cols-1">
          <Sidenav />
          <section className="contacts-grid grid gap-8 px-5 pb-10 pt-16 max-md:justify-center">
            {managers.map(manager => (
              <BlockCard manager={manager} key={manager._id} />
            ))}
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
