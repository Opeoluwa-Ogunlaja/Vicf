// --- TEMPLATE: Add ContactForm Methods ---
// TODO: Implement handleCreateContact
// TODO: Implement handleUpdateContact
// TODO: Implement handleDeleteContact
// TODO: Implement handleFetchContact
// --- END TEMPLATE ---
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContactFormSchema, ContactFormType, phoneNumberType } from '@/lib/utils/form-schemas'
import { useForm, SubmitHandler, useWatch } from 'react-hook-form'
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
import {
  FocusEvent,
  FocusEventHandler,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from 'react'
import { wait } from '@/lib/utils/promiseUtils'
import AdditionalInfoSection from '@/pages/save/AdditionalInfoSection'
import { useManager } from '@/hooks/useManager'
import { convertSlug, generateMongoId, slugifiedId } from '@/lib/utils/idUtils'
import { useContacts } from '@/hooks/useContacts'
import { useTimeout } from '@/hooks/useTimeout'
import { additionalInfoValue, contactsArray } from '@/types'
import { useManagerActions } from '@/hooks/useManagerActions'
import { useFormValueChangeDebounce } from '@/hooks/useFormValueChangeDebounce'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/hooks/useUser'
import { emptyBaseContact } from '@/lib/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { debounceFn } from '@/lib/utils/throttle'
import { contactTasks } from '@/feature/contactTaskQueues'
import { nanoid } from 'nanoid'
import useMounted from '@/hooks/useMounted'
import { useSocketActions } from '@/hooks/useSocketActions'
import { useSocketVars } from '@/hooks/useSocketVars'

const ContactForm = () => {
  const manager = useManager()
  const { add: addContact } = useContactsUpdate()
  const contacts = useContacts()
  const { toast } = useToast()
  const { toast: backupInputToast } = useToast()
  const user = useUser()
  const queryClient = useQueryClient()
  const mounted = useMounted()

  const { canSendMessages } = useSocketVars()
  const has_set_editing = useRef(false)
  const { sendMessage } = useSocketActions()

  const contactManager = useMemo(() => {
    return manager.find(mngr => mngr.url_id == contacts.url_id)
  }, [manager, contacts.url_id])
  const isInManager = Boolean(contactManager)

  const hasAddedManager = useRef(false)

  const formHook = useForm<ContactFormType>({
    mode: 'onChange',
    shouldFocusError: true,
    resolver: zodResolver(ContactFormSchema),
    defaultValues: isInManager
      ? { ...JSON.parse(contactManager?.input_backup as string), name: contactManager?.name }
      : {
          name: `New Contacts ${manager.length + 1}`,
          ...emptyBaseContact
        }
  })

  const [startManagerCreationTimeout] = useTimeout(
    () => {
      if (user.loggedIn) {
        createManager(
          {
            _id: generateMongoId(),
            backed_up: false,
            contacts_count: contacts.contacts.length,
            url_id: contacts.url_id as string,
            input_backup: JSON.stringify({ ...formHook.getValues(), name: undefined }),
            name: formHook.getValues().name
          },
          true
        )
      }
    },
    1500,
    false,
    [contactManager, formHook, user.loggedIn, contacts]
  )

  useEffect(() => {
    if (!isInManager && !hasAddedManager.current) {
      startManagerCreationTimeout()
      hasAddedManager.current = true
    }
  }, [isInManager, startManagerCreationTimeout])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wait(200).then(() => (document.querySelector('.title-field') as any)!.focus())
  }, [])

  const contactManagerRef = useRef(contactManager)
  contactManagerRef.current = contactManager

  const canSendMessageRef = useRef(canSendMessages)
  canSendMessageRef.current = canSendMessages

  const sendMessageRef = useRef(sendMessage)
  sendMessageRef.current = sendMessage

  useEffect(() => {
    if (!contactManagerRef.current || !canSendMessageRef.current) return
    const { organisation, _id } = contactManagerRef.current

    if (!organisation) return

    if (!has_set_editing.current) {
      // Send 'editing' on mount
      sendMessageRef.current({ listingId: _id }, 'set-editing')
      has_set_editing.current = true
    }
  }, [contactManager?._id, canSendMessages])

  useEffect(() => {
  // No-op on mount; cleanup runs only on unmount (when leaving the page)
  return () => {
    console.log("Leaving the page")
    if (has_set_editing.current) {
      sendMessageRef.current({ listingId: contactManagerRef.current!._id }, 'not-editing')
      has_set_editing.current = false
    }
  }
}, [])

  const { updateBackup, createManager, updateListingName } = useManagerActions()
  const updateNameMutation = useMutation({
    mutationKey: ['listing_name', contactManager?.url_id],
    mutationFn: (data: {
      id: string
      name: Parameters<typeof updateListingName>[1]
      upstream?: boolean
    }) =>
      contactTasks
        .runTask(() => updateListingName(data.id, data.name, data.upstream))
        .then(res => {
          queryClient.setQueryData(
            ['contacts', contactManager?.url_id],
            (myContacts: contactsArray) => {
              let position = 1
              return myContacts.map(contact => {
                if (!contact.overwrite_name) {
                  return {
                    ...contact,
                    name: convertSlug(
                      contactManager?.preferences?.slug_type || 'title_number',
                      data.name,
                      position++
                    )
                  }
                } else return contact
              })
            }
          )
          return res
        })
  })
  const addContactMutation = useMutation({
    mutationKey: ['contacts', contactManager?.url_id, 'add'],
    mutationFn: (data: ContactFormType) =>
      contactTasks.runTask(async () => {
        if (addContact)
          addContact({
            additional_information: data.additional_information,
            number: data.number,
            _id: generateMongoId(),
            name: !data.overwrite
              ? contactManager?.preferences?.slug_type == 'title_number'
                ? slugifiedId(data.name, contacts.contacts.length + 1)
                : slugifiedId(data.name, nanoid(6))
              : (data.overwrite_name as string),
            email: data?.email
          })
      })
  })
  const updateUserBackupMutation = useMutation({
    mutationKey: ['updated_contacts', contacts.url_id],
    mutationFn: (data: {
      id: string
      formState: Parameters<typeof updateBackup>[1]
      upstream?: boolean
    }) => {
      return updateBackup(data.id, data.formState, data.upstream)
      // return Promise.resolve(data)
    },
    retry: 0,
    networkMode: 'always',
    onSuccess: () => {
      backupInputToast({ title: 'Contact form', description: 'Backup successful' })
    }
  })

  const lastNameUpdate = useRef<string | null>(contactManager?.name || null)

  const number = useWatch({ control: formHook.control, name: 'number' })
  const overwrite_name = useWatch({ control: formHook.control, name: 'overwrite_name' })

  useLayoutEffect(() => {
    const { setError, formState, clearErrors } = formHook
    if (!number || formState.errors.number) return

    if (
      contacts.contacts.findIndex(
        contact => contact.number == phoneNumberType.safeParse(number).data
      ) > -1
    ) {
      setError('number', {
        type: 'manual',
        message: 'This number has already been entered'
      })
    }

    return () => {
      if (
        contacts.contacts.findIndex(
          contact => contact.number == phoneNumberType.safeParse(number).data
        ) == -1
      )
        clearErrors('number')
    }
  }, [number, formHook, contacts])

  useLayoutEffect(() => {
    const { setError, formState, clearErrors } = formHook
    if (!overwrite_name || formState.errors.overwrite_name) return

    if (contacts.contacts.findIndex(contact => contact.name == overwrite_name) > -1) {
      setError('overwrite_name', {
        type: 'manual',
        message: 'There is a contact with this name already'
      })
    }

    return () => {
      if (contacts.contacts.findIndex(contact => contact.overwrite_name == overwrite_name) == -1)
        clearErrors('overwrite_name')
    }
  }, [overwrite_name, formHook, contacts])

  useFormValueChangeDebounce({
    formHook,
    delay: isInManager ? 2000 : 4000,
    callback: () => {
      updateUserBackupMutation.mutate({
        id: contactManager?._id as string,
        formState: formHook.watch(),
        upstream: user.loggedIn
      })
    }
  })

  const onSubmit: SubmitHandler<ContactFormType> = async ({ ...data }) => {
    await addContactMutation.mutateAsync(data)
    toast({ title: 'Contact Added' })
    formHook.reset({
      name: contactManager?.name || undefined,
      email: '',
      number: '',
      additional_information: {},
      overwrite: false,
      overwrite_name: ''
    })
    updateUserBackupMutation.mutate({
      id: contactManager?._id as string,
      formState: { ...formHook.watch() },
      upstream: user.loggedIn
    })
  }

  const listing_name = formHook.getValues().name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTitleBlur = function <T extends FocusEventHandler<HTMLInputElement> = any>(
    fieldBlur: T
  ) {
    return debounceFn((e: FocusEvent<HTMLInputElement>) => {
      if (mounted) {
        fieldBlur(e)
        if (formHook.getValues().name == lastNameUpdate.current) return

        updateNameMutation
          .mutateAsync({
            id: contactManager?._id as string,
            name: listing_name,
            upstream: user.loggedIn
          })
          .then(
            (data: unknown) => {
              formHook.setValue('name', data as string)
              lastNameUpdate.current = data as string
            },
            () => {
              toast({
                variant: 'destructive',
                title: 'Update listing name',
                description: 'Unable to update listing name at the moment'
              })
            }
          )
      }
    }, 2000)
  }

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
                      {...{ ...field, onBlur: undefined }}
                      onBlur={handleTitleBlur<typeof field.onBlur>(field.onBlur)}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />
          <p className="-mt-3 text-sm font-medium text-neutral-400">
            Click "Add Contact" and Fill the form below to add people to your collection
          </p>
        </section>
        <Accordion type="multiple">
          <AccordionItem value="core" className="border-none">
            <AccordionTrigger className="font-bold text-neutral-500 underline">
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
                  <AccordionTrigger className="text-lg font-normal text-neutral-600">
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
                  disabled={!isInManager || Boolean(formHook.formState.errors.overwrite_name)}
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
                  disabled={!isInManager || Boolean(formHook.formState.errors.overwrite_name)}
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

export default memo(ContactForm)
