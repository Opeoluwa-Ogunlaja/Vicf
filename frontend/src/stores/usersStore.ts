import { createStore } from 'zustand'
import { IUserState, PartialUser } from '@/types/user'

export default createStore<IUserState>(set => {
  return {
    loggedIn: false,
    isPending: true,
    user: null,
    actions: {
      login_user: ({ _id, email, name, profile_photo }: PartialUser) =>
        set(() => ({
          user: {
            _id,
            email,
            name,
            profile_photo
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
