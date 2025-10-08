import { useUser } from '@/hooks/useUser'
import { Button } from './ui/button'
import { connectGoogle } from '@/lib/utils/requestUtils'
import { memo } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BackupButton = (props: { manager: any }) => {
  const { loggedIn, user } = useUser()
  console.log(props)
  return (
    loggedIn && <Button className="text-white" onClick={() => connectGoogle()}>{user?.drive_linked ? "Back up to drive" : "Connect your drive" }</Button>
  )
}

export default memo(BackupButton)