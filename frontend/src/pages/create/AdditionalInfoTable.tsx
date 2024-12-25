import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from '../../components/ui/table'
import { ArrayElement } from '@/types'
import { FC, memo, useState } from 'react'
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

const AdditionalInfoTable: FC<{
  additionalInfos: addInfoFormSchemaType
  setAdditionalInfo: (infos: addInfoFormSchemaType) => void
}> = memo(({ setAdditionalInfo, additionalInfos }) => {
  const formHook = useForm<addInfoFormSchemaType[number]>({
    resolver: zodResolver(addInfoFormSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const [showFields, setShowFields] = useState(additionalInfos.length > 0 ? true : false)

  const onSubmit: SubmitHandler<ArrayElement<addInfoFormSchemaType>> = data => {
    console.log(data)
    const validator = addInfoFormSchema.safeParse([data])
    console.log(validator)
    if (!validator.success) {
      validator.error.errors.forEach(error => {
        formHook.setError(error.path[1] as keyof addInfoFormSchemaType[number], {
          type: 'manual',
          message: error.message
        })
      })
      return
    }

    formHook.reset()
    return setAdditionalInfo([...additionalInfos, data])
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
          <Table className="border-none">
            <TableHeader>
              <TableRow className="font-normal hover:bg-neutral-300/70">
                <TableHead className="w-fit text-xs font-normal">Name</TableHead>
                <TableHead className="w-fit text-xs font-normal">Desc</TableHead>
                <TableHead className="text-right text-xs font-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {additionalInfos.map((info, index) => {
                return (
                  <TableRow
                    className="transition-colors hover:bg-slate-100"
                    key={info.name + index}
                  >
                    <TableCell>{info.name}</TableCell>
                    <TableCell>{info.description}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="mx-auto mt-2 max-w-[40ch] text-center text-xs text-muted">
            You have given no additional information click the plus icon at my upper right to add
            one
          </p>
        )}
      </div>
    </>
  )
})

export default AdditionalInfoTable
