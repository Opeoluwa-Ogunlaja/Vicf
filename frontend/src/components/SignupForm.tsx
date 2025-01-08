import { SignupFormSchema, SignupFormType } from '@/lib/utils/form-schemas'
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
import { useMutation } from '@tanstack/react-query'
import { signup_user } from '@/lib/utils/requestUtils'
import { wait } from '@/lib/utils/promiseUtils'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const SignupForm = () => {
  const [success, setSuccess] = useState<boolean>(false)
  const formHook = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: ''
    }
  })
  const { isSubmitting, errors } = formHook.formState

  const navigate = useNavigate()

  const signUpMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: (variables: SignupFormType) => signup_user(variables)
  })

  const onSubmit: SubmitHandler<SignupFormType> = async data => {
    try {
      await signUpMutation.mutateAsync(data)
      return await wait(500)
        .then(() => {
          setSuccess(true)
          return wait(2000)
        })
        .then(() => navigate('/auth'))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      formHook.setError('root', {
        message: err.message
      })
      return await wait(3000).then(() =>
        formHook.setError('root', {
          message: undefined
        })
      )
    }
  }

  return (
    <section
      className="grid content-center items-center justify-items-center px-32"
      style={{ gridAutoRows: 'max-content' }}
    >
      <Form {...formHook}>
        <form
          className="grid w-[400px] gap-1 max-lg:w-[300px]"
          onSubmit={formHook.handleSubmit(onSubmit)}
        >
          <div className="mx-auto self-center text-primary/40">
            <VicfIcon />
          </div>
          <div className="mb-5 flex flex-col gap-3 justify-self-start">
            <h2 className="text-2xl font-bold -tracking-[0.08em]">Sign Up</h2>
            <p className="text-sm text-neutral-400">
              Create an account and let’s save some contacts
            </p>
          </div>
          {errors.root?.message && (
            <div className="-mt-2 mb-2 bg-red-50 py-2 text-center text-sm font-medium text-destructive">
              {errors.root?.message}
            </div>
          )}
          {success && (
            <div className="-mt-2 mb-2 bg-green-50 py-2 text-center text-sm font-medium text-accent">
              Thank you for signing up
            </div>
          )}
          <FormField
            control={formHook.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl className="-mt-2">
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-neutral-400">
                    This should contain your name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
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
            disabled={isSubmitting}
          >
            Sign Up
          </Button>

          <div className="mx-auto mt-3 flex w-8/12 flex-col gap-3">
            <h3 className="text-center">Or</h3>
            <Button className="flex justify-start gap-4 border bg-white py-4 shadow-md hover:bg-white hover:shadow-sm">
              <GoogleIcon />
              <span>Sign up with Google</span>
            </Button>
            <Button className="flex justify-start gap-4 border bg-black py-4 text-white shadow-md hover:bg-black hover:shadow-sm">
              <AppleIcon />
              <span>Sign up with Apple</span>
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default SignupForm
