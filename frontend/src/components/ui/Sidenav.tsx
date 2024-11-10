import { ClockRewindIcon, PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { Button } from './button'
const Sidenav = () => {
  return (
    <aside className="max-lg:fixed max-lg:inset-x-0 max-lg:h-full scroll-auto max-lg:px-10 max-lg:top-0 max-lg:left-0 bg-white z-50 w-fit flex flex-col gap-20 px-12 py-10">
      <Button variant={'secondary'} className="w-max">
        Create New
      </Button>
      <section className="flex flex-col">
        <h3 className="max-lg:text-lg text-2xl font-medium border-b border-b-neutral-200 pb-2 mb-4">
          Recents <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
        </h3>
        <ul className="space-y-2">
          <li>
            <div className=" flex hover:scale-105 transition-transform items-center space-x-4 rounded-2xl border border-neutral-100 p-3 sm:p-4 bg-white">
              <PhonePlusIcon className="w-5 drop-shadow-md self-start pt-2" />
              <div className="flex-1 flex flex-col gap-1 text-left text-sm">
                <h4 className="font-semibold text-lg">Geology Department</h4>
                <p className="font-medium leading-none flex gap-2 text-neutral-400">
                  <UserPlusIcon width={'1em'} /> Opeoluwa
                </p>
                <p className="text-xs text-muted mt-2">Contacts not exported or saved to drive</p>
              </div>
            </div>
          </li>
          <li>
            <div className=" flex hover:scale-105 transition-transform items-center space-x-4 rounded-2xl border p-3 sm:p-4 bg-white border-neutral-100">
              <PhonePlusIcon className="w-5 drop-shadow-md self-start pt-2" />
              <div className="flex-1 flex flex-col gap-1 text-left text-sm">
                <h4 className="font-semibold text-lg">Choir Members</h4>
                <p className="font-medium leading-none flex gap-2 text-neutral-400">
                  <UserPlusIcon width={'1em'} /> 32 members
                </p>
                <p className="text-xs text-accent mt-2">Contacts saved to drive</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <section className="flex flex-col">
        <h3 className="max-lg:text-lg text-2xl font-medium border-b border-b-neutral-200 pb-2 mb-4">
          Goto <ClockRewindIcon width={'1em'} className="inline-block align-text-top" />
        </h3>
        <ul className=" flex flex-col gap-4 text-neutral-500">
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
