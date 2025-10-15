import { FC, ReactNode, useLayoutEffect, memo } from 'react'
// import { IContact } from '@/types/contacts'
import { Popover, PopoverContent, PopoverTrigger,  } from '@/components/ui/popover'
// import { TrashIcon } from '@/assets/icons'
import { Button } from '../ui/button'
import { useToggle } from '@/hooks/useToggle'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import Loader from '../ui/loader'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { twMerge } from 'tailwind-merge'
import { useManagerActions } from '@/hooks/useManagerActions'
import { useOnline } from '@/hooks/useOnline'

const ListingDeleteButton: FC<{ listing: Partial<ContactManagerEntry>, className?: string, listing_id: string, children: ReactNode }> = props => {
  const { name } = props.listing
  const listing_id = props.listing_id
  const [open, , set] = useToggle(false)
  const { toast } = useToast()
  const {deleteManager} = useManagerActions()
  const { isOnline } = useOnline()

  useLayoutEffect(() => {
    document.body.style.pointerEvents = "all"
  }, [open])

  const deleteMutation = useMutation({
    mutationKey: ['delete_contact_listing', listing_id],
    mutationFn: () => {
      return deleteManager(listing_id, isOnline)
    },
    onSuccess() {
      toast({ title: 'Listing Deleted', description: <>`Deleted <b>{name}</b></> })
      set(false)
    },
    retry: 0
  })

  const { isPending: deleting } = deleteMutation

  return (
    <Popover open={open} onOpenChange={(isOpen) => {if(!deleting) {set(isOpen)}}} modal={true}>
      <PopoverTrigger
        onClick={(e) => {if(!deleting) {set(true)}; e.stopPropagation()}}
        className={twMerge("-pb-1 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600", props.className)}
      >
        {!deleting ? props.children : <><span className='contents mr-2'>{props.children}</span><Loader className="w-2" /></>}
      </PopoverTrigger>
      <PopoverContent hideWhenDetached className="grid text-sm" onClick={e => e.stopPropagation()}>
        <p className="text-neutral-500">
          Are you <strong className="text-neutral-600">sure</strong> you want to{' '}
          <strong className="text-destructive">delete</strong> the contact listing {' '}
          <strong className="text-primary">{name}</strong>?
        </p>
        <div className="flex justify-end gap-2 place-self-end py-2">
          <Button
            variant={'secondary'}
            className="bg-neutral-100 text-primary"
            onClick={(e) => {set(false); e.stopPropagation();}}
          >
            No
          </Button>
          <Button
            variant={'destructive'}
            className="text-white"
            onClick={(e) => {
              toast({ title: `Delete ${name}`, description: 'deleting...' })
              deleteMutation.mutate()
              e.stopPropagation()
            }}
          >
            Yes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default memo(ListingDeleteButton)
