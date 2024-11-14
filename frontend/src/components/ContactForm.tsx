import { ContactFormSchema, ContactFormType } from '@/utils/form-schemas'
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

const ContactForm = () => {
  const formHook = useForm<ContactFormType>({
    resolver: zodResolver(ContactFormSchema)
  })

  const onSubmit: SubmitHandler<ContactFormType> = data => {
    console.log(data)
  }

  return (
    <Form {...formHook}>
      <form className="flex flex-col gap-2" onSubmit={formHook.handleSubmit(onSubmit)}>
        <section className="form-header flex flex-col gap-6">
          <span className="inline-grid aspect-square w-max place-content-center rounded-full bg-neutral-200 px-3 text-center">
            <PhonePlusIcon className="shadow-neutral-300 drop-shadow-md" />
          </span>
          <h2 className="text-2xl font-semibold">Apo boiz</h2>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number</FormLabel>
                    <FormControl className="-mt-2">
                      <Input placeholder="+234 801 234 5678" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs text-neutral-400">
                      This should contain the contact's number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formHook.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
              <Accordion type="multiple" className="-mt-2">
                <AccordionItem value="additional">
                  <AccordionTrigger className="text-lg font-normal text-neutral-600 transition-all">
                    Additional Information
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="form-footer mt-6">
                <Button variant="secondary" className="w-max px-5 text-lg font-normal">
                  Save Contact
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
