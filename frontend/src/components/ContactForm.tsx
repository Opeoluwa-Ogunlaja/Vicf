import { ContactFormSchema, ContactFormType } from '@/lib/utils/form-schemas'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { PhonePlusIcon } from '@/assets/icons'
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
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { wait } from '@/lib/utils/promiseUtils'
import AdditionalInfoSection from '@/pages/save/AdditionalInfoSection'
import { useManager } from '@/hooks/useManager'
import { generateMongoId, slugifiedId } from '@/lib/utils/idUtils'
import { useContacts } from '@/hooks/useContacts'
import { useTimeout } from '@/hooks/useTimeout'
import { additionalInfoValue } from '@/types'
import { useManagerActions } from '@/hooks/useManagerActions'
import { useFormValueChangeDebounce } from '@/hooks/useFormValueChangeDebounce'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/hooks/useUser'
import { emptyBaseContact } from '@/lib/consts'

const ContactForm = () => {
  const manager = useManager()
  const { add: addContact } = useContactsUpdate()
  const contacts = useContacts()
  const { toast } = useToast()
  const user = useUser()

  const contactManager = useMemo(() => {
    return manager.find(mngr => mngr.url_id == contacts.url_id)
  }, [manager, contacts.url_id])
  const isInManager = Boolean(contactManager)

  const { updateBackup, createManager } = useManagerActions()

  const formHook = useForm<ContactFormType>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: isInManager
      ? { ...JSON.parse(contactManager?.input_backup as string), name: contactManager?.name }
      : {
          name: `New Contacts ${manager.length + 1}`,
          ...emptyBaseContact
        }
  })

  useFormValueChangeDebounce({
    formHook,
    delay: isInManager ? 2000 : 4000,
    callback: () => {
      updateBackup(contactManager?._id as string, formHook.watch(), user.loggedIn)
    }
  })

  const [startManagerCreationTimeout] = useTimeout(
    () => {
      if (!user.loggedIn) {
        createManager(
          {
            _id: generateMongoId(),
            backed_up: false,
            contacts_count: contacts.contacts.length,
            url_id: contacts.url_id as string,
            input_backup: JSON.stringify({ ...formHook.getValues(), name: undefined }),
            name: formHook.getValues().name
          },
          user.loggedIn
        )
      }
    },
    2500,
    false,
    [contactManager, formHook, user.loggedIn]
  )

  const onSubmit: SubmitHandler<ContactFormType> = ({ ...data }) => {
    if (addContact)
      addContact({
        additional_information: data.additional_information,
        number: data.number,
        _id: generateMongoId(),
        name: !data.overwrite
          ? slugifiedId(data.name, contacts.contacts.length)
          : (data.overwrite_name as string),
        email: data?.email
      })
    toast({ title: 'Contact Added' })
    formHook.reset({
      email: '',
      number: '',
      additional_information: {},
      overwrite: false,
      overwrite_name: ''
    })
    updateBackup(contactManager?._id as string, { ...formHook.watch() })
  }

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wait(200).then(() => (document.querySelector('.title-field') as any)!.focus())
  }, [])

  useEffect(() => {
    if (!isInManager) startManagerCreationTimeout()

    if (contactManager) toast({ title: 'Syncing listing...', description: 'Syncing...' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            name="name"
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
          <p className="-mt-3 text-sm font-bold text-neutral-400">
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
                <AdditionalInfoSection
                  setAdditionalInfo={(value: additionalInfoValue) => {
                    formHook.setValue('additional_information', value)
                  }}
                  additionalInfos={formHook.watch().additional_information}
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
                  type="submit"
                  disabled={!isInManager}
                  className="w-max px-5 text-lg font-normal max-md:w-full"
                >
                  Save Contact
                </Button>
              </div>
              <div className="form-footer mt-6 hidden max-md:contents" key={'button 2'}>
                <Button
                  id="save-contact-btn"
                  variant="secondary"
                  type="submit"
                  disabled={!isInManager}
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
