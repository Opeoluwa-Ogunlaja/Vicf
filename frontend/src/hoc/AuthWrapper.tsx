import { BgPatternImage } from '@/assets/images'
import { Outlet } from 'react-router-dom'

const AuthWrapper = () => {
  return (
    <main className="auth-wrapper grid h-full self-stretch max-md:order-2">
      <Outlet />
      <div
        className="patterns-bg relative bg-secondary max-lg:-z-30 max-lg:opacity-15 max-md:order-1"
        style={{ background: `url(${BgPatternImage})` }}
      ></div>
    </main>
  )
}

export default AuthWrapper
