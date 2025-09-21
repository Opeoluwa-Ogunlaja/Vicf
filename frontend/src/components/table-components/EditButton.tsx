import { IContact } from '@/types/contacts'
import { memo, useState } from 'react'
import { EditIcon } from '@/assets/icons'
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
} from '../ui/form'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { useForm, SubmitHandler } from 'react-hook-form'
import { emptyBaseContact } from '@/lib/consts'
import { EditContactFormSchema, EditContactFormType } from '@/lib/utils/form-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import AdditionalInfoSection from '@/pages/save/AdditionalInfoSection'
import { additionalInfoValue } from '@/types'
import { Button } from '../ui/button'
import { useToggle } from '@/hooks/useToggle'
import { useContactsUpdate } from '@/hooks/useContactsUpdate'
import { useSocketActions } from '@/hooks/useSocketActions'
import Loader from '../ui/loader'

const EditButton = memo((props: { contact: Partial<IContact>; listing_id: string, disabled?: boolean }) => {
  const { contact } = props
  const formHook = useForm<EditContactFormType>({
    resolver: zodResolver(EditContactFormSchema),
    defaultValues: { ...emptyBaseContact, ...contact }
  })

  const [dialogOpen, toggle] = useToggle(false)
  const { edit } = useContactsUpdate()
  const { sendMessage } = useSocketActions()
  const listingId = props.listing_id
  const contactId = contact._id
  const [isEditing, setIsEditing] = useState(false)

  // Lock on open, unlock on close
  const handleDialogChange = (open: boolean) => {
    toggle()
    if (open) {
      sendMessage({ listingId, contactId }, 'lock-contact')
    } else {
      sendMessage({ listingId, contactId }, 'unlock-contact')
    }
  }

  const onSubmit: SubmitHandler<EditContactFormType> = async ({ ...data }) => {
    setIsEditing(true)
    if (edit)
      await edit(contact?._id || '', {
        ...data,
        _id: contact._id as string,
        name: formHook.getValues().overwrite
          ? (formHook.getValues().overwrite_name as string)
          : (contact.name as string)
      })
      setIsEditing(false)
    handleDialogChange(false)
  }
  const { name } = contact

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger disabled={props.disabled} className="-pb-1 border-b-2 border-dotted border-neutral-400 disabled:opacity-70 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600">
        <EditIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Contact{' -'}
            <span className="pl-2 text-lg font-normal text-neutral-600 underline underline-offset-4">
              '{name}'
            </span>
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Note: Change cannot be undone without re-editing
          </DialogDescription>
        </DialogHeader>
        <Form {...formHook}>
          <form className="flex flex-col gap-2" onSubmit={formHook.handleSubmit(onSubmit)}>
            <section className="grid grid-cols-2 max-md:grid-cols-1">
              <FormField
                control={formHook.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="max-md:mt-14 md:w-4/5">
                    <FormLabel>Number</FormLabel>
                    <FormControl className="-mt-2">
                      <Input placeholder="john.doe@email.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs text-neutral-400">
                      Edit the contact's number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formHook.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="max-md:mt-14 md:w-4/5">
                    <FormLabel>Email</FormLabel>
                    <FormControl className="-mt-2">
                      <Input placeholder="john.doe@email.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs text-neutral-400">
                      Edit the contact's email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section className="mt-3 grid gap-2">
              <AdditionalInfoSection
                setAdditionalInfo={(value: additionalInfoValue) => {
                  formHook.setValue('additional_information', value)
                }}
                additionalInfos={formHook.watch().additional_information}
              />
            </section>

            <FormField
              control={formHook.control}
              name="overwrite"
              render={({ field }) => (
                <FormItem className="mx-1 mt-6 md:w-4/5">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="ml-2 align-top text-neutral-500">
                    Overwrite the auto-generate name slug with:
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formHook.control}
              name="overwrite_name"
              render={({ field }) => {
                const overwite = !formHook.getValues().overwrite
                return (
                  <FormItem className="mx-1 mt-2">
                    <FormControl>
                      <Input
                        disabled={overwite}
                        aria-disabled={overwite}
                        placeholder="eg. Bestie"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-neutral-400">
                      This should contain the name overwrite.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                className="hover:bg-neutral-100"
                disabled={isEditing}
                onClick={() => isEditing && handleDialogChange(false)}
              >
                Close
              </Button>
              <Button
                id="save-contact-btn"
                variant="default"
                type="submit"
                disabled={isEditing}
                className="w-max bg-secondary/50 px-5 text-base font-normal max-md:absolute max-md:mx-auto max-md:mt-28 max-md:w-4/5"
              >
                Edit Contact { isEditing && <Loader className='w-3 h-3'/> }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default EditButton
