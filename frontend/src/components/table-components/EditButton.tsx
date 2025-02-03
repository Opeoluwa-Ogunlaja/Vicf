import { IContact } from '@/types/contacts'
import { FC } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { EditIcon } from '@/assets/icons'

const EditButton: FC<{ contactId: IContact['_id'] }> = () => {
  return (
    <Popover>
      <PopoverTrigger className="-pb-1 border-b-2 border-dotted border-neutral-400 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600">
        <EditIcon />
      </PopoverTrigger>
      <PopoverContent>Omo</PopoverContent>
    </Popover>
  )
}

export default EditButton
