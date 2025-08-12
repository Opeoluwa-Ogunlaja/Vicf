export interface IUser {
  email: string
  _id: string
  name: string
  profile_photo: string
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
