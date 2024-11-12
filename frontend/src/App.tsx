import { FC } from 'react'
import './App.scss'
// import {
//   // AnnouncementIcon,
//   // BellIcon,
//   ChevronDownIcon
//   // FacebookIcon,
//   // InstagramIcon,
//   // SettingsIcon,
//   // VicfIcon
// } from './assets/icons'
// import {
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuContent,
//   DropdownMenu
// } from './components/ui/dropdown-menu'
// import { useToggle } from './hooks/useToggle'
// import { cn } from './lib/utils'

import AppRouter from './AppRouter'
// import BackgroundPattern from './components/ui/BackgroundPattern'
// import { BgPatternImage } from './assets/images'
// import ContactsTable from './components/ContactsTable'
// import Sidenav from './components/ui/Sidenav'

const App: FC = () => {
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
