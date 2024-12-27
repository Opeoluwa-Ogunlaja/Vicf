import { ArrayElement } from '@/types'
import { FC, useState } from 'react'
import { addInfoFormSchema, addInfoFormSchemaType } from '@/utils/form-schemas'
import { PlusIcon } from '@/assets/icons'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AdditionalInfoTable from '@/components/AdditionalInfoTable'

const AdditionalInfoSection: FC<{
  additionalInfos: addInfoFormSchemaType
  setAdditionalInfo: (infos: addInfoFormSchemaType) => void
}> = ({ setAdditionalInfo, additionalInfos }) => {
  console.log(additionalInfos)
  const formHook = useForm<addInfoFormSchemaType[number]>({
    resolver: zodResolver(addInfoFormSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const [showFields, setShowFields] = useState(additionalInfos.length > 0 ? true : false)

  const onSubmit: SubmitHandler<ArrayElement<addInfoFormSchemaType>> = data => {
    const validator = addInfoFormSchema.safeParse([data])
    if (!validator.success) {
      validator.error.errors.forEach(error => {
        formHook.setError(error.path[1] as keyof addInfoFormSchemaType[number], {
          type: 'manual',
          message: error.message
        })
      })
      return
    }

    setAdditionalInfo([...additionalInfos, data])
    formHook.reset()
    return
  }

  return (
    <>
      <div className="border-b-1 flex items-center justify-between border-b border-neutral-500/20 pb-1 text-sm font-semibold text-neutral-500">
        <h3>Add Additional Information</h3>
        <Button
          type="button"
          variant={'ghost'}
          onClick={() => setShowFields(true)}
          className="h-fit w-max p-2 hover:scale-105 hover:bg-slate-50"
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="grid gap-2">
        {showFields && (
          <Form {...formHook}>
            <div
              className="grid grid-flow-row place-items-end gap-2"
              style={{ gridTemplateColumns: '1fr 1fr max-content' }}
            >
              <FormField
                control={formHook.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-normal text-neutral-400">Name</FormLabel>
                      <FormMessage />
                      <FormControl className="-mt-2">
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={formHook.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-normal text-neutral-400">Description</FormLabel>
                      <FormMessage />
                      <FormControl className="-mt-2">
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <Button
                type="button"
                onClick={() => onSubmit(formHook.getValues())}
                className="w-max px-3 text-sm font-normal text-white"
              >
                <PlusIcon /> Add
              </Button>
            </div>
          </Form>
        )}
        {additionalInfos.length > 0 ? (
          <AdditionalInfoTable additionalInfos={additionalInfos} />
        ) : (
          <p className="mx-auto mt-2 max-w-[40ch] text-center text-xs text-muted">
            You have given no additional information click the plus icon at my upper right to start
            adding
          </p>
        )}
      </div>
    </>
  )
}

export default AdditionalInfoSection
