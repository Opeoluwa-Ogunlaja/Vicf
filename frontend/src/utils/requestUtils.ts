import { AxiosError } from 'axios'
import { axiosInstance } from './axiosInstance'
import CustomAppError from './customAppError'
import { LoginFormType, SignupFormType } from '@/utils/form-schemas'
import { IUser } from '@/types/user'

const throwError = (error: AxiosError) => {
  throw new CustomAppError(error)
}

const checkError = (err: AxiosError) => {
  if (err.code !== 'ERR_NETWORK') {
    throwError(err)
  } else {
    throw err
  }
}

export const signup_user = async ({
  email,
  name,
  password
}: SignupFormType): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/users/register', {
      email,
      name,
      password
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const login_user = async ({
  email,
  password
}: LoginFormType): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/users/login', {
      email,
      password
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const google_login = async ({ code }: { code: string }): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/users/google-login', {
      code
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_profile = async (): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.get('/users/profile')

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}
