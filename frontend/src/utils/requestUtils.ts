import { AxiosError } from 'axios'
import { axiosInstance } from './axiosInstance'
import CustomAppError from './customAppError'
import { LoginFormType, SignupFormType } from '@/utils/form-schemas'

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

export const signup_function = async ({
  email,
  name,
  password
}: SignupFormType): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/signup', {
      email,
      name,
      password
    })

    return newUser.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const login_function = async ({
  email,
  password
}: LoginFormType): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/login', {
      email,
      password
    })

    return newUser.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}
