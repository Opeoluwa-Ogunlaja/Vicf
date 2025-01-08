import { FC } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { additionalInfoValue } from '@/types'

const AdditionalInfoTable: FC<{ additionalInfos: additionalInfoValue }> = ({ additionalInfos }) => {
  return (
    <Table className="border-none">
      <TableHeader>
        <TableRow className="bg-neutral-300/70 font-normal hover:bg-neutral-400/80">
          <TableHead className="w-fit text-xs font-normal">Name</TableHead>
          <TableHead className="w-fit text-xs font-normal">Desc</TableHead>
          <TableHead className="text-right text-xs font-normal">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {additionalInfos &&
          Object.entries(additionalInfos).map((info, index) => {
            return (
              <TableRow className="transition-colors hover:bg-slate-100" key={info[0] + index}>
                <TableCell>{info[0]}</TableCell>
                <TableCell>{info[1]}</TableCell>
                <TableCell>Icon</TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}

export default AdditionalInfoTable
