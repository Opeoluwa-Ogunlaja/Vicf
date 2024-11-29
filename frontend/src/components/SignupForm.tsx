import { SignupFormSchema, SignupFormType } from '@/utils/form-schemas'
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

const SignupForm = () => {
  const formHook = useForm<SignupFormType>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: '',
      name: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<SignupFormType> = data => {
    console.log(data)
  }

  return (
    <section
      className="grid content-center items-center justify-items-center px-32"
      style={{ gridAutoRows: 'max-content' }}
    >
      <Form {...formHook}>
        <form
          className="grid w-[400px] gap-2 max-lg:w-[300px]"
          onSubmit={formHook.handleSubmit(onSubmit)}
        >
          <div className="mb-6 flex flex-col gap-4 justify-self-start">
            <h2 className="text-2xl font-bold -tracking-[0.08em]">Sign Up</h2>
            <p className="font-semibold text-neutral-400">
              Create an account and let’s save some contacts
            </p>
          </div>
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
                    <Input placeholder="Name" {...field} />
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
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button variant="secondary" className="mt-5 w-full py-6 text-lg font-normal">
            Save Contact
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default SignupForm
