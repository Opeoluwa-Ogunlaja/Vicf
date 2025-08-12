import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FC, ReactNode } from 'react'

export const EmptyDialog: FC<{ trigger: ReactNode }> = ({ trigger }) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent>
      {/* Empty dialog for now */}
    </DialogContent>
  </Dialog>
)
