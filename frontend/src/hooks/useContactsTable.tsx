import { useContext } from 'react'
import { ContactsTableContext } from '@/contexts/ContactsTableContext'

export const useContactsTable = () => useContext(ContactsTableContext)
