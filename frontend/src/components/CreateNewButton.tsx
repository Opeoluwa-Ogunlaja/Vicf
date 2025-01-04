import { FC } from 'react'
import { Button } from './ui/button'
import { cx } from 'class-variance-authority'
import Loader from './ui/loader'
import { useToggle } from '@/hooks/useToggle'
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom'

const CreateNewButton: FC<{ className?: string }> = ({ className }) => {
  const [isProcessing, toggle] = useToggle(false)
  const navigate = useNavigate()

  const handleNewListing = () => {
    toggle()
    const id = nanoid(10)
    navigate(`/save/${id}?new=true`)
  }
  return (
    <Button variant={'secondary'} className={cx(className)} onClick={handleNewListing}>
      Create New {isProcessing && <Loader className="w-3" />}
    </Button>
  )
}

export default CreateNewButton
