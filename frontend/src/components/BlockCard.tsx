import { PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { MultiBackgroundPatterns } from './ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'

const BlockCard = () => {
  const status = 'uploaded'
  return (
    <div
      className="grid origin-center grid-rows-2 overflow-hidden rounded-lg drop-shadow-md transition-all hover:scale-[1.05]"
      style={{
        gridTemplateRows: '156px max-content'
      }}
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
          <h4 className="text-lg font-semibold">Hello</h4>
          <p className="flex gap-2 font-medium leading-none text-neutral-400">
            <UserPlusIcon width={'1em'} /> 50 Members
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
