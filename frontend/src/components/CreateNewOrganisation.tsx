import { FC, useState } from 'react'
import { Button } from './ui/button'
import { cx } from 'class-variance-authority'
import Loader from './ui/loader'
import { useToggle } from '@/hooks/useToggle'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import { useUser } from '@/hooks/useUser'
import { PlusIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { wait } from '@/lib/utils/promiseUtils'
import { CreateOrganisationSchema, CreateOrganisationType } from '@/lib/utils/form-schemas'
import { zodResolver } from '@hookform/resolvers/zod'

const CreateNewOrganisation: FC<{ className?: string }> = ({ className }) => {
  const [isProcessing, toggle] = useToggle(false)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState<boolean>(false)
  // const [isSubmitted, setSubmitted] = useState<boolean>(false)
  const { loggedIn } = useUser()
  console.log(loggedIn)
  const formHook = useForm<CreateOrganisationType>({
    resolver: zodResolver(CreateOrganisationSchema),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async () => {
    try {
      setSubmitting(true)
      await wait(2000)
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} className={cx('text-[1.0625rem]', className, 'items-center')}>
          <PlusIcon width={'1.5em'} /> <span className="-mb-1 self-center">New Organisation </span>
          {isProcessing && <Loader className="w-3" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10">
        <DialogHeader>
          <DialogTitle>Create Organisation</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Note: Change cannot be undone without re-editing
          </DialogDescription>
        </DialogHeader>
        <Form {...formHook}>
          <form className="flex flex-col gap-2" onSubmit={formHook.handleSubmit(onSubmit)}>
            <section className="grid grid-cols-2 max-md:grid-cols-1">
              <FormField
                control={formHook.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="max-md:mt-14">
                    <FormLabel>Name</FormLabel>
                    <FormControl className="-mt-2">
                      <Input placeholder="Acme.co Marketing" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs text-neutral-400">
                      The Organisations's name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                className="hover:bg-neutral-100"
                onClick={toggle}
              >
                Close
              </Button>
              <Button
                id="save-contact-btn"
                variant="default"
                type="submit"
                disabled={isSubmitting}
                className="w-max bg-secondary/50 px-5 text-base font-normal max-md:absolute max-md:mx-auto max-md:mt-28 max-md:w-4/5"
              >
                Create Organisation {isSubmitting && <Loader />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewOrganisation
