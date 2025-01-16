import { FC, useState } from 'react'
import { Button } from './ui/button'
import { cx } from 'class-variance-authority'
import Loader from './ui/loader'
import { useToggle } from '@/hooks/useToggle'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateListingId } from '@/lib/utils/idUtils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

const CreateNewButton: FC<{ className?: string }> = ({ className }) => {
  const [isProcessing, toggle] = useToggle(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isOnSave = location.pathname.includes('/save')
  const [open, setOpen] = useState(false)

  const handleNewListing = () => {
    toggle()
    const id = generateListingId()
    navigate(`/save/${id}?new=true`)
  }

  return (
    <AlertDialog open={open} onOpenChange={isOpen => (isOnSave ? setOpen(isOpen) : null)}>
      <AlertDialogTrigger asChild>
        <Button
          variant={'secondary'}
          className={cx(className)}
          onClick={() => (isOnSave ? null : handleNewListing())}
        >
          Create New {isProcessing && <Loader className="w-3" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this listing?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleNewListing} className="text-white">
            Create New {isProcessing && <Loader className="w-3" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateNewButton
