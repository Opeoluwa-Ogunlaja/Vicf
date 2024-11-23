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

function ContactsTable({ className }: { className?: string }) {
  return (
    <>
      <div className={twMerge('mx-auto h-16 rounded-t-lg bg-neutral-600', className)}></div>
      <Table className="overflow-x-auto border-y px-6 text-center [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_th]:py-4 [&_th]:!text-center">
        <TableCaption>5 out of 5 contacts</TableCaption>
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
          <TableRow className="transition-colors hover:bg-neutral-100">
            <TableCell className="font-medium">+234 807 2660 055</TableCell>
            <TableCell className="max-lg:hidden">1Adi</TableCell>
            <TableCell>me@gmail.com</TableCell>
            <TableCell className="text-right">300</TableCell>
            <TableCell className="flex items-center justify-center gap-4 text-center">
              <EditButton contactId="hello" />
              <DeleteButton contactId="hello" />
            </TableCell>
          </TableRow>
        </TableBody>
        {/* <TableFooter>
          <TableRow className="text-start">
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </>
  )
}

export default ContactsTable
