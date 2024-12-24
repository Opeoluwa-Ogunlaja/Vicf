import { contactsContext } from '@/types/contacts'
import { createContext } from 'react'

export const ContactsContext = createContext<Pick<contactsContext, 'contacts'>['contacts']>([])
