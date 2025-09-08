import { FC, ReactNode } from 'react'
// import { IContact } from '@/types/contacts'
// import { TrashIcon } from '@/assets/icons'
import { Button } from './ui/button'
import { useToggle } from '@/hooks/useToggle'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { twMerge } from 'tailwind-merge'
import { useManagerActions } from '@/hooks/useManagerActions'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from './ui/dialog'
import { Form, useForm } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { MoveListingSchema, MoveListingType } from '@/lib/utils/form-schemas'

const MoveListingButton: FC<{
  listing: Partial<ContactManagerEntry>
  className?: string
  listing_id: string
  children: ReactNode
}> = props => {
  const { name } = props.listing
  const listing_id = props.listing_id
  const [open, , set] = useToggle(false)
  const { toast } = useToast()
  const { deleteManager } = useManagerActions()
  const formHook = useForm<MoveListingType>({
    resolver: zodResolver(MoveListingSchema),
    defaultValues: {
      from: '',
      to: ''
    }
  })

  const deleteMutation = useMutation({
    mutationKey: ['delete_contact_listing', listing_id],
    mutationFn: () => {
      return deleteManager(listing_id)
    },
    onSuccess() {
      toast({
        title: 'Listing Deleted',
        description: (
          <>
            `Deleted <b>{name}</b>
          </>
        )
      })
      set(false)
    },
    retry: 0
  })

  const { isPending: deleting } = deleteMutation

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!deleting) {
          set(isOpen)
        }
      }}
    >
      <DialogTrigger
        onClick={e => {
          if (!deleting) {
            set(true)
          }
          e.stopPropagation()
        }}
        className={twMerge(
          '-pb-1 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600',
          props.className
        )}
      >
        {!deleting ? (
          props.children
        ) : (
          <>
            <span className="mr-2 contents">{props.children}</span>
          </>
        )}
      </DialogTrigger>
      <DialogContent className="grid text-sm" onClick={e => e.stopPropagation()}>
        <DialogHeader className="text-neutral-500">
          <DialogTitle> Move Listing </DialogTitle>
          <DialogDescription>
            Move <strong className="text-neutral-600">{name}</strong> into an organisation
          </DialogDescription>
        </DialogHeader>
        <Form {...formHook}>
          <form>
            <FormField
              control={formHook.control}
              name="from"
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
          </form>
        </Form>
        <DialogFooter>
          <div className="flex justify-end gap-2 place-self-end py-2">
            <Button
              variant={'outline'}
              onClick={e => {
                set(false)
                e.stopPropagation()
              }}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              onClick={e => {
                toast({ title: `Delete ${name}`, description: 'deleting...' })
                deleteMutation.mutate()
                e.stopPropagation()
              }}
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MoveListingButton
