import { ContactsTableContext } from '@/contexts/ContactsTableContext'
import { FC, ReactNode } from 'react'

const ContactsTableProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ContactsTableContext.Provider
      value={{
        page: 1
      }}
    >
      {children}
    </ContactsTableContext.Provider>
  )
}

export default ContactsTableProvider
