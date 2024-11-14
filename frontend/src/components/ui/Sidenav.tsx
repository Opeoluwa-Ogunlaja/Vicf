import { ClockRewindIcon, PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { Button } from './button'
const Sidenav = () => {
  return (
    <aside className="invisible z-50 flex w-fit flex-col gap-20 scroll-auto bg-white px-12 py-10 max-lg:fixed max-lg:inset-x-0 max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:px-10">
      <Button variant={'secondary'} className="-mb-10 mt-10 py-6">
        Create New
      </Button>
      <section className="flex flex-col">
        <h3 className="mb-4 border-b border-b-neutral-200 pb-2 text-2xl font-medium max-lg:text-lg">
          Recents <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
        </h3>
        <ul className="space-y-2">
          <li>
            <div className="flex items-center space-x-4 rounded-2xl border border-neutral-100 bg-white p-3 transition-transform hover:scale-105 sm:p-4">
              <PhonePlusIcon className="w-5 self-start pt-2 drop-shadow-md" />
              <div className="flex flex-1 flex-col gap-1 text-left text-sm">
                <h4 className="text-lg font-semibold">Geology Department</h4>
                <p className="flex gap-2 font-medium leading-none text-neutral-400">
                  <UserPlusIcon width={'1em'} /> Opeoluwa
                </p>
                <p className="mt-2 text-xs text-muted">Contacts not exported or saved to drive</p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-4 rounded-2xl border border-neutral-100 bg-white p-3 transition-transform hover:scale-105 sm:p-4">
              <PhonePlusIcon className="w-5 self-start pt-2 drop-shadow-md" />
              <div className="flex flex-1 flex-col gap-1 text-left text-sm">
                <h4 className="text-lg font-semibold">Choir Members</h4>
                <p className="flex gap-2 font-medium leading-none text-neutral-400">
                  <UserPlusIcon width={'1em'} /> 32 members
                </p>
                <p className="mt-2 text-xs text-accent">Contacts saved to drive</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <section className="flex flex-col">
        <h3 className="mb-4 border-b border-b-neutral-200 pb-2 text-2xl font-medium max-lg:text-lg">
          Goto <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
        </h3>
        <ul className="flex flex-col gap-4 text-neutral-500">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Dashboard</a>
          </li>
          <li>
            <a className="font-semibold">Save Contacts</a>
          </li>
        </ul>
      </section>
    </aside>
  )
}

export default Sidenav
