import { UserContext } from '@/contexts/UserContext'
import usersStore from '@/stores/usersStore'
import { useState, FC, ReactNode } from 'react'

const UserProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [store] = useState(usersStore)
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}

export default UserProvider
