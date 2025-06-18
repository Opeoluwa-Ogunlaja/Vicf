import { FC, memo, ReactNode } from 'react'
import { SidenavContext } from './../contexts/SidenavContext'
import { useToggle } from '@/hooks/useToggle'

const SidenavProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  const toggleValues = useToggle(false)
  //   const [open, toggleOpen, setOpen] = toggleValues
  return <SidenavContext.Provider value={toggleValues}>{children}</SidenavContext.Provider>
})

export default SidenavProvider
