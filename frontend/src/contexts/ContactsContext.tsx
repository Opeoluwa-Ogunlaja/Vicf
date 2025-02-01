import { contactsContext, contactsReadProperty } from '@/types/contacts'
import { createContext } from 'react'

export const ContactsContext = createContext<Pick<contactsContext, contactsReadProperty>>({
  contacts: [],
  url_id: '',
  loading: true
})
