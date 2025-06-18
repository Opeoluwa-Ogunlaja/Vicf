import { FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TrashIcon } from '@/assets/icons'
import { Button } from '../ui/button'
import { useToggle } from '@/hooks/useToggle'
import { useContactsUpdate } from '@/hooks/useContactsUpdate'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import Loader from '../ui/loader'

const DeleteInfoButton: FC<{ contact_id: string; listing_id: string }> = props => {
  const _id = props.contact_id
  const listing_id = props.listing_id
  const [open, , set] = useToggle(false)
  const { delete: deleteContact } = useContactsUpdate()
  const { toast } = useToast()

  const deleteMutation = useMutation({
    mutationKey: ['delete_contact', _id],
    mutationFn: () => {
      if (deleteContact && _id) {
        return deleteContact(listing_id, _id)
      } else {
        return Promise.reject('')
      }
    },
    onSuccess() {
      toast({ title: 'Contact Deleted', description: `Deleted Contact` })
    },
    retry: 0
  })

  const { isPending: deleting } = deleteMutation

  return (
    <Popover open={open} onOpenChange={set}>
      <PopoverTrigger
        onClick={() => !deleting && set(true)}
        className="-pb-1 border-b-2 border-dotted border-neutral-400 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600"
      >
        {!deleting ? <TrashIcon /> : <Loader className="w-2" />}
      </PopoverTrigger>
      <PopoverContent className="grid text-sm">
        <p className="text-neutral-500">
          Are you <strong className="text-neutral-600">sure</strong> you want to{' '}
          <strong className="text-destructive">delete</strong> the contact entry for{' '}
          <strong className="text-primary">{_id}</strong>?
        </p>
        <div className="flex justify-end gap-2 place-self-end py-2">
          <Button
            variant={'secondary'}
            className="bg-neutral-100 text-primary"
            onClick={() => set(false)}
          >
            No
          </Button>
          <Button
            variant={'destructive'}
            className="text-white"
            onClick={() => {
              toast({ title: `Delete ${_id}`, description: 'deleting...' })
              deleteMutation.mutate()
            }}
          >
            Yes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DeleteInfoButton
