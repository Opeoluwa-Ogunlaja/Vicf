import { FC, useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { cx } from 'class-variance-authority'
import Loader from './ui/loader'
import { useToggle } from '@/hooks/useToggle'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateListingId, generateMongoId } from '@/lib/utils/idUtils'
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
import { useManagerActions } from '@/hooks/useManagerActions'
import { useUser } from '@/hooks/useUser'
import { useManager } from '@/hooks/useManager'
import { useToast } from '@/hooks/use-toast'
import { emptyBaseContactManager } from '@/lib/consts'
import { useThrottleAsync } from '@/hooks/useThrottleAsync'
import { PlusIcon } from '@radix-ui/react-icons'

const CreateNewButton: FC<{ className?: string }> = ({ className }) => {
  const [isProcessing, toggle] = useToggle(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isOnSave = location.pathname.includes('/save')
  const [open, setOpen] = useState(false)
  const { loggedIn } = useUser()
  const manager = useManager()
  const managerLength = useRef<number>(manager.length)

  useEffect(() => {
    managerLength.current = manager.length
  }, [manager])

  const { createManager } = useManagerActions()
  const { toast } = useToast()

  const handleNewListing = useThrottleAsync(async () => {
    toggle()
    const id = generateListingId()
    if (loggedIn) {
      ;(
        createManager(
          {
            _id: generateMongoId(),
            backed_up: false,
            contacts_count: 0,
            url_id: id as string,
            input_backup: JSON.stringify({ name: undefined }),
            name: `New Contacts ${managerLength.current + 1}`
          },
          loggedIn
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any
      )
        .then(() => {
          toggle()
          navigate(`/save/${id}?new=true`)
        })
        .catch(() => {
          toast({
            title: 'Listing creation failed',
            description: 'Please check your internet connection',
            variant: 'destructive',
            className: 'text-white scale-110'
          })
          toggle()
        })
    } else {
      createManager(
        {
          _id: generateMongoId(),
          url_id: id as string,
          name: `New Contact ${managerLength.current + 1}`,
          ...emptyBaseContactManager
        },
        loggedIn
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any
      navigate(`/save/${id}?new=true`)
    }
  }, 5000)

  return (
    <AlertDialog open={open} onOpenChange={isOpen => (isOnSave ? setOpen(isOpen) : null)}>
      <AlertDialogTrigger asChild>
        <Button
          variant={'secondary'}
          className={cx(className, 'items-center')}
          onClick={() => (isOnSave ? null : handleNewListing())}
        >
          <PlusIcon /> <span className="-mb-1 self-center">Create New Listing </span>
          {isProcessing && <Loader className="w-3" />}
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
            Create {isProcessing && <Loader className="w-3" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CreateNewButton
