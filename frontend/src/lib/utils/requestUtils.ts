import { AxiosError } from 'axios'
import { axiosInstance } from './axiosInstance'
import CustomAppError from './customAppError'
import { LoginFormType, SignupFormType } from '@/lib/utils/form-schemas'
import { IUser } from '@/types/user'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { IContact } from '@/types'

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

export const get_contacts_manager = async (): Promise<ContactManagerEntry[] | undefined> => {
  try {
    const newUser = await axiosInstance.get('/contacts/manager')

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const create_contact_listing = async ({
  url_id,
  name,
  input_backup
}: {
  url_id: string
  name?: string
  input_backup?: string
}) => {
  try {
    const newListing = await axiosInstance.post('/contacts/create', {
      url_id,
      name,
      input_backup
    })

    return newListing.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const update_contact_input_backup = async (id: string, backup: Partial<IContact>) => {
  try {
    const newListing = await axiosInstance.patch(`/contacts/backup-input/${id}`, backup)

    return newListing.data.data.input_backup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_contacts = async (
  listing_id: string
): Promise<ContactManagerEntry[] | undefined> => {
  try {
    const newUser = await axiosInstance.get(`/contacts/${listing_id}`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}
