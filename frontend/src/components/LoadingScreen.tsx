import { BgPatternImage } from '@/assets/images'
import { MultiBackgroundPatterns } from './ui/BackgroundPattern'
import { AnnouncementIcon, VicfIcon } from '@/assets/icons'
import { memo } from 'react'

const LoadingScreen = memo(() => {
  return (
    <div className="absolute inset-0 isolate grid h-full w-full place-content-center overflow-hidden">
      <div className="animate-background absolute inset-0 -z-30 h-full w-full bg-secondary"></div>
      <MultiBackgroundPatterns
        count={4}
        className="-z-10 aspect-square w-48 opacity-20 invert"
        source={BgPatternImage}
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <VicfIcon className="w-20 animate-pulse text-neutral-600 lg:w-28" />
        <p className="mx-auto flex items-start justify-center gap-2 text-sm text-neutral-600 text-opacity-85">
          <AnnouncementIcon width={'16px'} className="align-baseline" />
          <span className="max-w-[35ch] font-bold max-md:max-w-[28ch]">
            Tip: Use the "Overwrite name" checkbox to give contact a custom name
          </span>
        </p>
      </div>
    </div>
  )
})

export default LoadingScreen
