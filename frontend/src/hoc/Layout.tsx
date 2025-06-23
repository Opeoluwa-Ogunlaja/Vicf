import LoadingScreen from '@/components/LoadingScreen'
import { memo, Suspense, useEffect } from 'react'
import { Await, Outlet, useNavigation, useRouteLoaderData } from 'react-router-dom'
import { IUser } from '@/types/user'
import { useToggle } from '@/hooks/useToggle'
import { MultiBackgroundPatterns } from '@/components/ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import { isMobile } from 'react-device-detect'

const LayoutContent = memo(() => {
  return (
    <>
      <Outlet />
      <div className="absolute inset-0 isolate -z-40 overflow-hidden">
        <MultiBackgroundPatterns
          count={isMobile ? 3 : 6}
          className="-z-10 aspect-square w-48 opacity-[0.0125] invert"
          source={BgPatternImage}
        />
      </div>
    </>
  )
})

const Layout = () => {
  const navigation = useNavigation()
  const [hasLoadedOnce, , set] = useToggle(false)
  const isLoading = navigation.state == 'loading'
  const { user_promise } = useRouteLoaderData('root') as { user_promise: Promise<IUser | null> }

  useEffect(() => {
    if (navigation.state == 'idle') {
      set(true)
    }
  }, [navigation.state, set])

  if (isLoading && !hasLoadedOnce) return <LoadingScreen />

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={user_promise} errorElement={<LayoutContent />}>
        {() => {
          return <LayoutContent />
        }}
      </Await>
    </Suspense>
  )
}

export default Layout
