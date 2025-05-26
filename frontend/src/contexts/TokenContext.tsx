import { createContext, Dispatch } from 'react'

export const TokenContext = createContext<{
  token: string
  setToken: Dispatch<string>
}>({
  token: '',
  setToken: () => {}
})
