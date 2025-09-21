import { LoaderFunction } from 'react-router-dom'
import { ContactManagerActions } from '@/types/contacts_manager'
import { useUserUpdate } from '@/hooks/useUserUpdate'
import { Dispatch, MutableRefObject } from 'react'

export type LoaderData<TLoaderFn extends LoaderFunction> =
  Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never

export type Timeout = ReturnType<typeof setTimeout>

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number]

export type UnReadOnlyObj<T> = { -readonly [P in keyof T]: T[P] }

export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property]
}

export type RouteDataType = {
  currentToken: MutableRefObject<string>
  setManager: ContactManagerActions['setManager']
  setToken: Dispatch<string>
  setReady: Dispatch<boolean>
} & Pick<ReturnType<typeof useUserUpdate>, 'login_user' | 'set_loaded'>
