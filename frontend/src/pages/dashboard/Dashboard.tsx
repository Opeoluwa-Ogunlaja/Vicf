import { Card } from '@/components/ui/card'
import { AnnouncementIcon } from '@/assets/icons/'
import NavigationBar from '../home/NavigationBar'
import Sidenav from '@/components/ui/Sidenav'

const stats = {
  listingsCreated: 0,
  listingsUpdatedToDrive: 0
}

const Dashboard = () => {
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
            <div className="mx-auto max-w-2xl py-10">
              <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>
              <div className="grid gap-6">
                <Card className="p-6">
                  <div className="font-semibold">Listings Created</div>
                  <div className="text-3xl">{stats?.listingsCreated ?? '...'}</div>
                </Card>
                <Card className="p-6">
                  <div className="font-semibold">Listings Updated to Drive</div>
                  <div className="text-3xl">{stats?.listingsUpdatedToDrive ?? '...'}</div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Dashboard
