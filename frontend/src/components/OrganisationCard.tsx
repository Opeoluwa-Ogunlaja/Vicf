import { PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { MultiBackgroundPatterns } from './ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import { FC } from 'react'

const OrganisationCard: FC<{
  organisation: Partial<{ name: string }>
}> = ({ organisation }) => {
  return (
    <div className="grid cursor-pointer rounded-lg bg-white shadow-neutral-400/5 drop-shadow-md transition-all hover:scale-[1.05]">
      <div className="relative grid overflow-clip bg-primary">
        <div className="absolute inset-0">
          <MultiBackgroundPatterns
            count={10}
            className="aspect-square w-20 opacity-20"
            source={BgPatternImage}
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 overflow-hidden bg-white p-3 sm:p-4">
        <PhonePlusIcon className="mx-2 w-5 self-start pt-2" />
        <div className="flex flex-1 flex-col gap-1 text-left text-sm">
          <h4 className="text-lg font-semibold">{organisation.name}</h4>
          <p className="flex gap-2 font-medium leading-none text-neutral-400">
            <UserPlusIcon width={'1em'} /> contacts
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrganisationCard
