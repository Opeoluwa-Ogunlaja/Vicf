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
import { ClipboardIcon, PlusIcon } from '@radix-ui/react-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CreateOrganisationSchema, CreateOrganisationType } from '@/lib/utils/form-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrganisation } from '@/lib/utils/requestUtils'
import { wait } from '@/lib/utils/promiseUtils'

const CreateNewOrganisation: FC<{ className?: string }> = ({ className }) => {
  const [isProcessing] = useToggle(false)
  const [open, setOpen] = useState(false)

  const { user } = useUser()

  const formHook = useForm<CreateOrganisationType>({
    resolver: zodResolver(CreateOrganisationSchema),
    defaultValues: {
      name: ''
    }
  })
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState<boolean>(false)
  const createOrganisationMutation = useMutation({
    mutationFn: (data: { name: string }) => createOrganisation(data.name),
    mutationKey: ['organisations', 'creation'],
    onSuccess(data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['organisations', user?._id], (prevContent: any) => {
        return [...prevContent, data]
      })
    }
  })
  const { isSubmitting, errors } = formHook.formState
  const [view, setView] = useState<'login' | 'success'>('login')

  const onSubmit: SubmitHandler<CreateOrganisationType> = async data => {
    try {
      await createOrganisationMutation.mutateAsync({ name: data.name })
      setSuccess(true)
      await wait(800)
      setView('success')
    } catch (error) {
      console.log(error)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.write(createOrganisationMutation.data.inviteCode)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} className={cx(className, 'items-center')}>
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
          <form onSubmit={formHook.handleSubmit(onSubmit)}>
            {view == 'login' ? (
              <div className="flex flex-col gap-2">
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
              </div>
            ) : (
              <>
                <section>
                  <h3 className="mt-4 text-lg font-bold text-primary">
                    Organisation Created Successfully
                  </h3>
                  <div className="mb-6 mt-4 grid gap-2">
                    <p className="text-neutral-500">Group invitation link:</p>
                    <div
                      className="grid justify-evenly gap-2"
                      style={{
                        gridTemplateColumns: '90% 10%'
                      }}
                    >
                      <button className="inline-block overflow-hidden text-ellipsis rounded-md bg-neutral-200 px-3 py-2">
                        {createOrganisationMutation.data &&
                          `https://vicf.onrender.com/organisations/invitation/${createOrganisationMutation.data.inviteCode}`}
                      </button>
                      <Button size="icon" className="text-white" onClick={handleCopyLink}>
                        <ClipboardIcon />
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            )}
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                className="hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              {view == 'login' && (
                <Button
                  id="save-contact-btn"
                  variant="default"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-max bg-secondary/50 px-5 text-base font-normal max-md:absolute max-md:mx-auto max-md:mt-28 max-md:w-4/5"
                >
                  Create Organisation {isSubmitting && <Loader />}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNewOrganisation
