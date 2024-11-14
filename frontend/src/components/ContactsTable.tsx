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

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card'
  }
]

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
          {invoices.map(invoice => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell className="max-lg:hidden">{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">Okay</TableCell>
              <TableCell className="text-right">Okay</TableCell>
            </TableRow>
          ))}
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
