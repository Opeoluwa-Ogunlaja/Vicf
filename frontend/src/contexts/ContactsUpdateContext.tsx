import { contactsContext } from '@/types/contacts'
import { createContext } from 'react'

export const ContactsUpdateContext = createContext<Omit<contactsContext, 'contacts'>>({})
