import { useContext } from 'react'
import { SidenavContext } from '@/contexts/SidenavContext'

export const useSidenav = () => {
    const sidenavContext = useContext(SidenavContext)

    if(sidenavContext === null) throw new Error("hook must be used in the Sidenav Provider")

    return sidenavContext
}
