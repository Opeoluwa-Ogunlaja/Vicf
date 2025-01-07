import { IContact } from '@/types/contacts'
import { FC } from 'react'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { EditIcon } from '@/assets/icons'

const EditButton: FC<{ contactId: IContact['contact_id'] }> = () => {
  return (
    <Popover>
      <PopoverTrigger className="-pb-1 border-b-2 border-dotted border-neutral-400 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600">
        <EditIcon />
      </PopoverTrigger>
    </Popover>
  )
}

export default EditButton
