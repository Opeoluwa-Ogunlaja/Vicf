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
      <div className={twMerge('h-16 bg-neutral-600 rounded-t-lg mx-auto', className)}></div>
      <Table className="overflow-x-auto px-6 [&_th]:px-6 [&_th]:!text-center [&_td]:px-6 [&_th]:py-4 [&_td]:py-4 text-center border-y">
        <TableCaption>5 out of 5 contacts</TableCaption>
        <TableHeader className="sticky bg-muted/10 [&_*]:!font-medium shadow-md shadow-neutral-50">
          <TableRow className="font-normal">
            <TableHead className="w-fit font-normal text-sm">Number</TableHead>
            <TableHead className="max-lg:hidden w-fit font-normal text-sm">Slug</TableHead>
            <TableHead className="max-lg:hidden w-fit font-normal text-sm">Email</TableHead>
            <TableHead className="w-fit font-normal text-sm">Additional Information</TableHead>
            <TableHead className="text-right font-normal text-sm">Actions</TableHead>
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
