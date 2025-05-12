import LoadingScreen from '@/components/LoadingScreen'
import { useUser } from '@/hooks/useUser'
import { Outlet } from 'react-router-dom'

const LayoutContent = () => {
  return <Outlet />
}

const Layout = () => {
  const { isPending } = useUser()
  console.log(isPending)

  return isPending ? <LoadingScreen /> : <LayoutContent />
}

export default Layout
