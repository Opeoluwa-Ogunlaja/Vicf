import { IContact } from '@/types/contacts'
import { memo } from 'react'
import { EditIcon } from '@/assets/icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { emptyBaseContact } from '@/lib/consts'
import { EditContactFormSchema, EditContactFormType } from '@/lib/utils/form-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import AdditionalInfoSection from '@/pages/save/AdditionalInfoSection'
import { additionalInfoValue } from '@/types'

const EditButton = memo((props: { contact: Partial<IContact>; listing_id: string }) => {
  const { contact } = props
  const formHook = useForm<EditContactFormType>({
    resolver: zodResolver(EditContactFormSchema),
    defaultValues: { ...emptyBaseContact, ...contact }
  })

  const { name } = contact
  return (
    <Dialog>
      <DialogTrigger className="-pb-1 border-b-2 border-dotted border-neutral-400 bg-clip-padding text-neutral-600 transition-colors hover:border-neutral-600">
        <EditIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Contact{' '}
            <span className="pl-2 text-lg font-normal text-neutral-600 underline underline-offset-4">
              '{name}'
            </span>
          </DialogTitle>
          <DialogDescription>Note: Change cannot be undone without re-editing</DialogDescription>
        </DialogHeader>
        <Form {...formHook}>
          <section className="mt-3 grid gap-2">
            <AdditionalInfoSection
              setAdditionalInfo={(value: additionalInfoValue) => {
                formHook.setValue('additional_information', value)
              }}
              additionalInfos={formHook.watch().additional_information}
            />
          </section>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default EditButton
