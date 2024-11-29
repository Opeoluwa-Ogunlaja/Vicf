import { BgPatternImage } from '@/assets/images'
import { Outlet } from 'react-router-dom'

const AuthWrapper = () => {
  return (
    <main className="auth-wrapper grid h-full self-stretch">
      <Outlet />
      <div
        className="patterns-bg relative bg-secondary"
        style={{ background: `url(${BgPatternImage})` }}
      ></div>
    </main>
  )
}

export default AuthWrapper
