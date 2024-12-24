export interface IUser {
  email: string
  id: string
  name: string
}

export type PartialUser = Partial<IUser>

export interface IUserState {
  loggedIn: boolean
  isPending: boolean
  user: PartialUser | null
  actions: {
    login_user: ({ id, email, name }: PartialUser) => void
    set_loaded: () => void
    logout_user: () => void
  }
}
