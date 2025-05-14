import { createContext, Dispatch } from 'react'

export const TokenContext = createContext<{
  token: string | null
  setToken: Dispatch<string | null>
}>({
  token: '',
  setToken: () => {}
})
