import { TokenContext } from '@/contexts/TokenContext'
import { UserContext } from '@/contexts/UserContext'
import usersStore from '@/stores/usersStore'
import { useState, FC, ReactNode } from 'react'

const UserProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>('')
  const [store] = useState(usersStore)

  return (
    <UserContext.Provider value={store}>
      <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>
    </UserContext.Provider>
  )
}

export default UserProvider
