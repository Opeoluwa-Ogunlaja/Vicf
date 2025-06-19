import { LoginFormSchema, LoginFormType } from '@/lib/utils/form-schemas'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { AppleIcon, GoogleIcon, VicfIcon } from '@/assets/icons'
import { wait } from '@/lib/utils/promiseUtils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { google_login, login_user } from '@/lib/utils/requestUtils'
import { IUser, PartialUser } from '@/types/user'
import { useGoogleLogin } from '@react-oauth/google'
import { useToggle } from '@/hooks/useToggle'
import { useUserUpdate } from '@/hooks/useUserUpdate'
import useToken from '@/hooks/useToken'

const LoginForm = () => {
  const formHook = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const [disableSubmit, toggleSubmit] = useToggle(false)

  const [success, setSuccess] = useState<boolean>(false)
  const { isSubmitting, errors } = formHook.formState

  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (variables: LoginFormType) => login_user(variables)
  })

  const googleLoginMutation = useMutation({
    mutationKey: ['google_login'],
    mutationFn: (variables: { code: string }) => google_login(variables)
  })

  const { login_user: update_user_state } = useUserUpdate()

  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      const res = await googleLoginMutation.mutateAsync({ code: codeResponse.code })
      return await wait(500)
        .then(() => {
          formHook.setError('root', {
            message: undefined
          })
          setSuccess(true)
          queryClient.setQueryData<Partial<IUser>>(['user', 'logged_in'], () => {
            return {
              id: res?.id,
              name: res?.name,
              email: res?.email
            }
          })
          update_user_state({ id: res?.id, name: res?.name, email: res?.email })
          if (res?.token) setToken(res?.token)
          // else console.warn('there was no token for some reason')
          queryClient.invalidateQueries({
            queryKey: ['contacts_manager'],
            refetchType: 'all',
            exact: true
          })
          return wait(2000)
        })
        .then(() => navigate('/home'))
    },
    onError: async err => {
      formHook.setError('root', {
        message: err as string
      })
      const promise = wait(2000)
      promise
        .then(() => wait(800))
        .then(() =>
          formHook.setError('root', {
            message: undefined
          })
        )
      return await promise
    },
    flow: 'auth-code'
  })

  const onSubmit: SubmitHandler<LoginFormType> = async data => {
    try {
      const res = (await loginMutation.mutateAsync(data)) as PartialUser & { token?: string }
      return await wait(500)
        .then(() => {
          formHook.setError('root', {
            message: undefined
          })
          setSuccess(true)
          queryClient.setQueryData<Partial<IUser>>(['user', 'logged_in'], () => {
            return {
              id: res?.id,
              name: res?.name,
              email: res?.email
            }
          })
          console.log('setting the state')
          if (res?.token) setToken(res?.token)
          // else console.warn('there was no token for some reason')
          update_user_state({ id: res?.id, name: res?.name, email: res?.email })
          queryClient.invalidateQueries({
            queryKey: ['contacts_manager'],
            refetchType: 'all',
            exact: true
          })
          return wait(2000)
        })
        .then(() => {
          navigate('/home')
        })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      formHook.setError('root', {
        message: err.message
      })
      const promise = wait(2000)
      promise
        .then(() => wait(800))
        .then(() =>
          formHook.setError('root', {
            message: undefined
          })
        )
      return await promise
    }
  }

  return (
    <section
      className="grid content-center items-center justify-items-center lg:px-32"
      style={{ gridAutoRows: 'max-content' }}
    >
      <Form {...formHook}>
        <form
          className="grid w-[400px] gap-2 max-lg:w-[300px]"
          onSubmit={formHook.handleSubmit(onSubmit)}
          aria-labelledby="login-form-title"
        >
          <div className="mx-auto self-center text-primary/40">
            <VicfIcon />
          </div>
          <div className="mb-6 flex flex-col gap-4 justify-self-start">
            <h2 id="login-form-title" className="text-2xl font-bold -tracking-[0.08em]">
              Login
            </h2>
            <p className="text-sm text-neutral-400">
              Welcome Back. Login let's continue from where we left off
            </p>
          </div>
          {errors.root?.message && (
            <div className="-mt-2 mb-2 bg-red-50 py-2 text-center text-sm font-medium text-destructive">
              {errors.root?.message}
            </div>
          )}
          {success && (
            <div className="-mt-2 mb-2 bg-green-50 py-2 text-center text-sm font-medium text-accent">
              Login successful
            </div>
          )}
          <FormField
            control={formHook.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="-mt-2">
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-neutral-400">
                    This should contain your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={formHook.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl className="-mt-2">
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button
            variant="secondary"
            className="mt-5 w-full py-4 font-bold"
            disabled={isSubmitting || disableSubmit}
          >
            Login
          </Button>

          <div className="mx-auto mt-3 flex w-8/12 flex-col gap-3">
            <h3 className="text-center">Or</h3>
            <Button
              className="flex justify-start gap-4 border bg-white py-4 shadow-md hover:bg-white hover:shadow-sm"
              onClick={() => {
                toggleSubmit()
                login()
              }}
              type="button"
            >
              <GoogleIcon />
              <span>Sign up with Google</span>
            </Button>
            <Button
              className="flex justify-start gap-4 border bg-black py-4 text-white shadow-md hover:bg-black hover:shadow-sm"
              type="button"
            >
              <AppleIcon />
              <span>Sign up with Apple</span>
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default LoginForm
