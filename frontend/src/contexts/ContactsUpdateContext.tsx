import { contactsContext, contactsReadProperty } from '@/types/contacts'
import { createContext } from 'react'

export const ContactsUpdateContext = createContext<Omit<contactsContext, contactsReadProperty>>({})
