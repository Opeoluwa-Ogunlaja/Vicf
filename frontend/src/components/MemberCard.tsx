import { IUser } from '@/types'
import { Button } from './ui/button'
import { EmptyDialog } from './EmptyDialog'
import { useUser } from '@/hooks/useUser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MemberCard = ({ member }: { member: Partial<IUser> }) => {
  const { user } = useUser()

  return (
    <div className="flex flex-col overflow-hidden rounded-lg px-4 py-6 shadow-md shadow-neutral-100">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-6">
          <img
            src={member.profile_photo}
            className="block aspect-square w-14 mb-4 overflow-clip rounded-full"
          />
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">{member.name}</h4>
            <span className="text-neutral-400">{member.email}</span>
            { user?._id == member._id && <span className='font-bold text-sm text-blue-400'>Creator</span>}
          </div>
        </div>
        <section className="quick-member-buttons -mr-2/5 flex gap-2 self-stretch">
          <EmptyDialog
            trigger={<Button variant={'outline'} className="rounded-full p-3">...</Button>}
          />
          <EmptyDialog
            trigger={<Button variant={'outline'} className="rounded-full p-3">...</Button>}
          />
        </section>
      </div>
    </div>
  )
}

export default MemberCard
