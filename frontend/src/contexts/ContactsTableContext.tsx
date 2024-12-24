import { createContext } from 'react'

export const ContactsTableContext = createContext<{
  page: number
}>({
  page: 1
})
