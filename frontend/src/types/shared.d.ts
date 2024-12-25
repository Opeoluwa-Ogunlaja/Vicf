import { LoaderFunction } from 'react-router-dom'

export type LoaderData<TLoaderFn extends LoaderFunction> =
  Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never

export type Timeout = ReturnType<typeof setTimeout>

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number]
