// --- TEMPLATE: Add ContactsTable Methods ---
// TODO: Implement fetchContacts
// TODO: Implement updateContact
// TODO: Implement deleteContact
// --- END TEMPLATE ---
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { twMerge } from 'tailwind-merge'
import EditButton from './table-components/EditButton'
import DeleteButton from './table-components/DeleteButton'
import { useContacts } from '@/hooks/useContacts'
import { phoneNumberType } from '../lib/utils/form-schemas'
import ContactsTableProvider from '@/hoc/ContactsTableProvider'
import useMediaQuery from '@/hooks/useMediaQuery'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DotsHorizontalIcon } from '@/assets/icons'
import AdditionalInfoTable from './AdditionalInfoTable'
import { useSocketEvent } from '@/hooks/useSocketEvent'
import { useToast } from '@/hooks/use-toast'
import { useManager } from '@/hooks/useManager'
import { memo } from 'react'
import clsx from 'clsx'

const ContactsTable = memo(
  ({
    className,
    contacts,
    url_id
  }: {
    className?: string
    contacts: ReturnType<typeof useContacts>['contacts']
    url_id: string
  }) => {
    const { toast } = useToast()
    useSocketEvent('add-contacts', () => {
      toast({ title: 'Contacts Added' })
    })
    const manager = useManager()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contactManager = manager.find((mngr: any) => mngr.url_id == url_id)
    const lgScreen = useMediaQuery('(min-width: 1024px)')

    const { loading } = useContacts()

    if (loading) return <>Loading Table</>

    return (
      <ContactsTableProvider>
        <div className={twMerge('mx-auto h-20 rounded-t-lg bg-neutral-600', className)}></div>
        <Table className="overflow-x-auto border-y px-6 text-center [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_th]:py-4 [&_th]:!text-center">
          <TableCaption>
            {contacts.length} out of {contactManager?.contacts_count} contacts
          </TableCaption>
          <TableHeader className="sticky bg-muted/10 shadow-lg shadow-neutral-50 [&_*]:!font-medium">
            <TableRow className="font-normal hover:bg-secondary">
              <TableHead className="w-fit text-sm font-normal">Number</TableHead>
              <TableHead className="w-fit text-sm font-normal max-lg:hidden">Name</TableHead>
              <TableHead className="w-fit text-sm font-normal max-lg:hidden">Email</TableHead>
              <TableHead className="w-fit text-sm font-normal">
                {lgScreen ? 'Additional Information' : 'Info'}
              </TableHead>
              <TableHead className="text-right text-sm font-normal">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center [&_td]:!text-center">
            {[...contacts].map(contact => {
              const lockedColor = contactManager?.users_editing?.find(
                e => e._id == contact.locked_by
              )?.color
              return (
                <TableRow
                  className={clsx('transition-colors hover:bg-neutral-100', {
                    ['outline']: contact.locked
                  })}
                  style={{
                    'outlineColor': lockedColor!
                  }}
                  key={contact.number + contact._id}
                >
                  <TableCell className="font-medium">
                    {phoneNumberType.parse(contact.number)}
                  </TableCell>
                  <TableCell className="max-lg:hidden">{contact.name}</TableCell>
                  <TableCell className="max-lg:hidden">{contact.email || '--'}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger>
                        <DotsHorizontalIcon />
                      </PopoverTrigger>
                      <PopoverContent side="top">
                        <h5 className="mb-3 font-medium">Additional info</h5>
                        {contact.additional_information &&
                        Object.values(contact.additional_information)?.length > 0 ? (
                          <AdditionalInfoTable additionalInfos={contact.additional_information} />
                        ) : (
                          <p className="text-xs text-neutral-400">
                            No additional information assigned
                          </p>
                        )}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-4 text-center">
                      <EditButton listing_id={contactManager?._id || ''} contact={contact} disabled={contact.locked}/>
                      <DeleteButton listing_id={contactManager?._id || ''} contact={contact} disabled={contact.locked}/>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ContactsTableProvider>
    )
  }
)

export default ContactsTable
