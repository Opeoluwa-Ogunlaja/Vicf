import { FC } from 'react'
import { IContact } from '@/types/contacts'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TrashIcon } from '@/assets/icons'
import { Button } from '../ui/button'
import { useToggle } from '@/hooks/useToggle'

const DeleteButton: FC<{ contactId: IContact['id'] }> = ({ contactId }) => {
  const [open, , set] = useToggle(false)
  return (
    <Popover open={open} onOpenChange={set}>
      <PopoverTrigger
        onClick={() => set(true)}
        className="-pb-1 border-b-2 border-dotted border-neutral-400 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600"
      >
        <TrashIcon />
      </PopoverTrigger>
      <PopoverContent className="grid text-sm">
        <p className="text-neutral-500">
          Are you <strong className="text-neutral-600">sure</strong> you want to{' '}
          <strong className="text-destructive">delete</strong> the contact entry for{' '}
          <strong className="text-primary">{contactId}</strong>?
        </p>
        <div className="flex justify-end gap-2 place-self-end py-2">
          <Button
            variant={'secondary'}
            className="bg-neutral-100 text-primary"
            onClick={() => set(false)}
          >
            No
          </Button>
          <Button variant={'destructive'} className="text-white">
            Yes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DeleteButton
