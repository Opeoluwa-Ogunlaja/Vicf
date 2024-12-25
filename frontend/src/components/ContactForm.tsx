import {
  addInfoFormSchema,
  addInfoFormSchemaType,
  ContactFormSchema,
  ContactFormType
} from '@/utils/form-schemas'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { PhonePlusIcon, PlusIcon } from '@/assets/icons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { useContactsUpdate } from '@/hooks/useContactsUpdate'
import { FC, memo, useEffect, useState } from 'react'
import { wait } from '@/utils/promiseUtils'
import { useUser } from '@/hooks/useUser'
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from './ui/table'
import { ArrayElement } from '@/types'

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

const ContactForm = () => {
  const { add: addContact } = useContactsUpdate()
  const { user } = useUser()
  const formHook = useForm<ContactFormType>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      title: user ? 'Apo boiz' : 'New Group',
      email: '',
      number: '',
      additional_info: [],
      overwrite: false,
      overwrite_name: ''
    }
  })

  console.log(formHook.watch())

  const onSubmit: SubmitHandler<ContactFormType> = ({ title, ...data }) => {
    console.log(title)
    if (addContact) addContact(data)
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wait(200).then(() => (document.querySelector('.title-field') as any)!.focus())
  }, [])

  return (
    <Form {...formHook}>
      <form className="flex flex-col gap-2" onSubmit={formHook.handleSubmit(onSubmit)}>
        <section className="form-header flex flex-col gap-6">
          <span className="inline-grid aspect-square w-max place-content-center rounded-full bg-neutral-200 px-3 text-center">
            <PhonePlusIcon className="shadow-neutral-300 drop-shadow-md" />
          </span>
          <FormField
            control={formHook.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="contents">
                  <FormControl>
                    <Input
                      className="title-field inline min-w-[4ch] max-w-[20ch] self-start border-none p-1 font-semibold shadow-none focus-within:border max-md:text-lg md:text-2xl"
                      autoCorrect="off"
                      style={{
                        width: `${field.value.length}ch`
                      }}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
          <p className="-mt-3 text-sm text-neutral-400">
            Click "Add Contact" and Fill the form below to add people to your collection
          </p>
        </section>
        <Accordion type="multiple">
          <AccordionItem value="core" className="border-none">
            <AccordionTrigger className="font-bold text-neutral-500 underline transition-all">
              Add Contact
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-1">
              <FormField
                control={formHook.control}
                name="number"
                render={({ field }) => {
                  return (
                    <FormItem className="md:w-4/5">
                      <FormLabel>Number</FormLabel>
                      <FormControl className="-mt-2">
                        <Input placeholder="+234 801 234 5678" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs text-neutral-400">
                        This should contain the contact's number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
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
                      This should contain the contact's email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="mt-3 grid gap-2">
                <AdditionalInfoTable
                  setAdditionalInfo={(value: addInfoFormSchemaType) =>
                    formHook.setValue('additional_info', value)
                  }
                  additionalInfos={formHook.getValues('additional_info')}
                />
              </section>
              <Accordion type="multiple" className="mt-4">
                <AccordionItem value="additional">
                  <AccordionTrigger className="text-lg font-normal text-neutral-600 transition-all">
                    Overwrites
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={formHook.control}
                      name="overwrite"
                      render={({ field }) => (
                        <FormItem className="mx-1 md:w-4/5">
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="form-footer mt-6 contents">
                <Button
                  variant="secondary"
                  className="w-max px-5 text-lg font-normal max-md:w-full"
                >
                  Save Contact
                </Button>
              </div>
              <div className="form-footer mt-6 hidden max-md:contents" key={'button 2'}>
                <Button
                  id="save-contact-btn"
                  variant="secondary"
                  className="w-max bg-secondary/50 px-5 text-base font-normal max-md:absolute max-md:mx-auto max-md:mt-28 max-md:w-4/5"
                >
                  Save just number
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}

export default ContactForm
