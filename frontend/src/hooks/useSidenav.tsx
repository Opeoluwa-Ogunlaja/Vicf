import { useContext } from 'react'
import { SidenavContext } from '@/contexts/SidenavContext'

export const useSidenav = () => useContext(SidenavContext)
