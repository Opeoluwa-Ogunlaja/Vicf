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
import { addInfoFormSchemaType, phoneNumberType } from '../lib/utils/form-schemas'
import ContactsTableProvider from '@/hoc/ContactsTableProvider'
import useMediaQuery from '@/hooks/useMediaQuery'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DotsHorizontalIcon } from '@/assets/icons'
import AdditionalInfoTable from './AdditionalInfoTable'

function ContactsTable({ className }: { className?: string }) {
  const { contacts } = useContacts()
  const lgScreen = useMediaQuery('(min-width: 1024px)')
  console.log(contacts)
  return (
    <ContactsTableProvider>
      <div className={twMerge('mx-auto h-16 rounded-t-lg bg-neutral-600', className)}></div>
      <Table className="overflow-x-auto border-y px-6 text-center [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_th]:py-4 [&_th]:!text-center">
        <TableCaption>
          {contacts.length} out of {contacts.length} contacts
        </TableCaption>
        <TableHeader className="sticky bg-muted/10 shadow-md shadow-neutral-50 [&_*]:!font-medium">
          <TableRow className="font-normal hover:bg-secondary">
            <TableHead className="w-fit text-sm font-normal">Number</TableHead>
            <TableHead className="w-fit text-sm font-normal max-lg:hidden">Slug</TableHead>
            <TableHead className="w-fit text-sm font-normal max-lg:hidden">Email</TableHead>
            <TableHead className="w-fit text-sm font-normal">
              {lgScreen ? 'Additional Information' : 'Info'}
            </TableHead>
            <TableHead className="text-right text-sm font-normal">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center [&_td]:!text-center">
          {[...contacts].reverse().map(contact => {
            return (
              <TableRow
                className="transition-colors hover:bg-neutral-100"
                key={contact.number + contact._id}
              >
                <TableCell className="font-medium">
                  {phoneNumberType.parse(contact.number)}
                </TableCell>
                <TableCell className="max-lg:hidden">{contact._id}</TableCell>
                <TableCell className="max-lg:hidden">{contact.email || '--'}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <DotsHorizontalIcon />
                    </PopoverTrigger>
                    <PopoverContent side="top">
                      <h5 className="mb-3 font-medium">Additional info</h5>
                      {contact.additional_information &&
                      contact.additional_information?.length > 0 ? (
                        <AdditionalInfoTable
                          additionalInfos={contact.additional_information as addInfoFormSchemaType}
                        />
                      ) : (
                        <p className="text-xs text-neutral-400">
                          No additional information assigned
                        </p>
                      )}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="flex items-center justify-center gap-4 text-center">
                  <EditButton contactId={`${contact.number}_${contact.email}`} />
                  <DeleteButton contactId={`${contact.number}_${contact.email}`} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </ContactsTableProvider>
  )
}

export default ContactsTable
