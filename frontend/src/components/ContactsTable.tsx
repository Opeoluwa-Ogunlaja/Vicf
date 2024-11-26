import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { twMerge } from 'tailwind-merge'
import EditButton from './table-components/EditButton'
import DeleteButton from './table-components/DeleteButton'
import { useContacts } from '@/hooks/useContacts'
import { phoneNumberType } from './../utils/form-schemas'
import ContactsTableProvider from '@/hoc/ContactsTableProvider'

function ContactsTable({ className }: { className?: string }) {
  const contacts = useContacts()
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
            <TableHead className="w-fit text-sm font-normal">Additional Information</TableHead>
            <TableHead className="text-right text-sm font-normal">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center [&_td]:!text-center">
          {[...contacts].reverse().map(contact => {
            return (
              <TableRow
                className="transition-colors hover:bg-neutral-100"
                key={contact.number + contact.slug}
              >
                <TableCell className="font-medium">
                  {phoneNumberType.parse(contact.number)}
                </TableCell>
                <TableCell className="max-lg:hidden">{contact.slug}</TableCell>
                <TableCell>{contact.email || '--'}</TableCell>
                <TableCell className="text-right">300</TableCell>
                <TableCell className="flex items-center justify-center gap-4 text-center">
                  <EditButton contactId="hello" />
                  <DeleteButton contactId="hello" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        {/* <TableFooter>
          <TableRow className="text-start">
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </ContactsTableProvider>
  )
}

export default ContactsTable
