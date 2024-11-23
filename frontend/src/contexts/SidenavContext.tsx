import { createContext } from 'react'

export const SidenavContext = createContext<[boolean, () => void, (val: boolean) => void]>([
  false,
  () => {},
  () => {}
])
