import { BgPatternImage } from '@/assets/images'
import { MultiBackgroundPatterns } from './ui/BackgroundPattern'
import { AnnouncementIcon, VicfIcon } from '@/assets/icons'

const LoadingScreen = () => {
  return (
    <div className="absolute place-self-center isolate inset-0 h-full w-full grid place-content-center overflow-hidden">
      <div className="absolute w-full h-full inset-0 bg-secondary -z-30 animate-background"></div>
      <MultiBackgroundPatterns
        count={4}
        className="opacity-20 w-48 -z-10 aspect-square invert"
        source={BgPatternImage}
      />
      <div className="flex flex-col text-center items-center gap-3">
        <VicfIcon className="text-neutral-600 animate-pulse" />
        <p className="text-sm flex items-start justify-center gap-2 text-neutral-500 text-opacity-85 mx-auto">
          <AnnouncementIcon width={'16px'} className="align-baseline" />
          <span className="max-w-[35ch] max-md:max-w-[28ch]">
            Tip: Use the "Overwrite name" checkbox to give contact a custom name
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoadingScreen
