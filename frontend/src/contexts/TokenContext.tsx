import { createContext, MutableRefObject } from 'react'

export const TokenContext = createContext<MutableRefObject<string | null> | undefined>(undefined)
