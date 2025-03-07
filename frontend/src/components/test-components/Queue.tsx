import { useContacts } from '@/hooks/useContacts'
import { useQueue } from '@/hooks/useQueue'
import { useTimeout } from '@/hooks/useTimeout'
import { testPromise } from '@/lib/utils/requestUtils'
import { FC } from 'react'

const Queue: FC<{ contacts: ReturnType<typeof useContacts> }> = ({ contacts }) => {
  const { queue, isMutating, lastRequest, requestHistory } = useQueue(contacts)
  console.log(isMutating, lastRequest, requestHistory)

  const [reset] = useTimeout(
    () => {
      queue(testPromise, (taskId, result) => {
        console.log(taskId, result)
      })
      reset()
    },
    1000,
    true
  )
  return <div>Queue</div>
}

export default Queue
