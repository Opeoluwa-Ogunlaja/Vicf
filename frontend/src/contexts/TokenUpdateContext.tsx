import { createContext, Dispatch, SetStateAction } from 'react'

export const TokenUpdateContext = createContext<{
  setToken: Dispatch<SetStateAction<string>>
} | undefined>(undefined)
