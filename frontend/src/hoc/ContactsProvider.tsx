import { ContactsContext } from '@/contexts/ContactsContext'
import { FC, ReactNode } from 'react'

const ContactsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <ContactsContext.Provider value={{}}>{children}</ContactsContext.Provider>
}

export default ContactsProvider
