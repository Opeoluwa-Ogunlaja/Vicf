import { PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { FC } from 'react'

const GroupCard: FC<{ group_name: string; contacts_num: number; status: string }> = ({
  group_name,
  contacts_num,
  status
}) => {
  return (
    <div className="flex items-center space-x-4 rounded-2xl border border-neutral-100 bg-white p-3 transition-transform hover:scale-105 sm:p-4">
      <PhonePlusIcon className="w-5 self-start pt-2 drop-shadow-md" />
      <div className="flex flex-1 flex-col gap-1 text-left text-sm">
        <h4 className="text-lg font-semibold">{group_name}</h4>
        <p className="flex gap-2 font-medium leading-none text-neutral-400">
          <UserPlusIcon width={'1em'} /> {contacts_num} Members
        </p>
        <p className={cn('mt-2 text-xs text-muted', { 'text-accent': status == 'uploaded' })}>
          {status !== 'uploaded'
            ? 'Contacts not exported or saved to drive'
            : 'Contacts saved to drive'}
        </p>
      </div>
    </div>
  )
}

export default GroupCard
