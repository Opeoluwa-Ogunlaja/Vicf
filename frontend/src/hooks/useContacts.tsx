import { useContext } from 'react'
import { ContactsContext } from '../contexts/ContactsContext'
import { contactsContext } from '@/types/contacts'

export const useContacts = (): contactsContext => useContext(ContactsContext)
