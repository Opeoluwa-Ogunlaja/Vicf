import { PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { MultiBackgroundPatterns } from './ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import { FC } from 'react'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { useNavigate } from 'react-router-dom'

const BlockCard: FC<{
  manager: Partial<ContactManagerEntry>
}> = ({ manager }) => {
  const status = manager.backed_up ? 'uploaded' : 'not-uploaded'
  const navigate = useNavigate()

  return (
    <div
      className="grid origin-center cursor-pointer grid-rows-2 overflow-hidden rounded-lg drop-shadow-md transition-all hover:scale-[1.05]"
      style={{
        gridTemplateRows: '156px max-content'
      }}
      onClick={() => navigate(`/save/${manager.url_id}`)}
    >
      <div className="relative grid overflow-clip bg-primary">
        <MultiBackgroundPatterns
          count={35}
          className="absolute aspect-square w-20 opacity-20"
          source={BgPatternImage}
        />
      </div>
      <div className="flex items-center space-x-4 overflow-hidden bg-white p-3 sm:p-4">
        <PhonePlusIcon className="w-5 self-start pt-2" />
        <div className="flex flex-1 flex-col gap-1 text-left text-sm">
          <h4 className="text-lg font-semibold">{manager.name}</h4>
          <p className="flex gap-2 font-medium leading-none text-neutral-400">
            <UserPlusIcon width={'1em'} />{' '}
            {manager.contacts_count && manager?.contacts_count > 0 ? manager.contacts_count : 'No'}{' '}
            contacts
          </p>
          <p className={cn('mt-1 text-xs text-muted', { 'text-accent': status == 'uploaded' })}>
            {status !== 'uploaded'
              ? 'Contacts not exported or saved to drive'
              : 'Contacts saved to drive'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlockCard
