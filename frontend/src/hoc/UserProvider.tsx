import { UserContext } from '@/contexts/UserContext'
import { IUserState, IUser, PartialUser } from '@/types/user'
import { useState, FC, ReactNode } from 'react'
import { createStore } from 'zustand'

const UserProvider: FC<{
  children: ReactNode
  initialUser?: IUser | null
}> = ({ children, initialUser = null }) => {
  const [store] = useState(
    createStore<IUserState>(set => {
      return {
        loggedIn: false,
        isPending: true,
        user: initialUser,
        actions: {
          login_user: ({ id, email, name }: PartialUser) =>
            set(() => ({
              user: {
                id,
                email,
                name
              },
              loggedIn: true,
              isPending: false
            })),
          set_loaded() {
            return set(() => ({
              isPending: false
            }))
          },
          logout_user() {
            return set(() => ({
              user: null,
              loggedIn: false,
              isPending: false
            }))
          }
        }
      }
    })
  )
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>
}

export default UserProvider
