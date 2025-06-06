import { createContext, Dispatch, MutableRefObject } from 'react'

export const TokenContext = createContext<{
  token: MutableRefObject<string> | null
  setToken: Dispatch<string>
}>({
  token: null,
  setToken: () => {}
})
