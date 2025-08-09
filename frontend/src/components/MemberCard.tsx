import { IUser } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MemberCard = ({ member }: { member: Partial<IUser> }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg px-4 py-6 shadow-md shadow-neutral-100">
      <div className="grid grid-flow-col grid-cols-[max-content] items-start gap-6">
        <img
          src={member.profile_photo}
          className="block aspect-square w-14 overflow-clip rounded-full"
        />
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">{member.name}</h4>
          <span className="text-neutral-400">{member.email}</span>
        </div>
      </div>
    </div>
  )
}

export default MemberCard
