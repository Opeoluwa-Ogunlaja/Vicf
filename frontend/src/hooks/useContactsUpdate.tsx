import { useContext } from 'react'
import { ContactsUpdateContext } from '@/contexts/ContactsUpdateContext'

export const useContactsUpdate = () => useContext(ContactsUpdateContext)
