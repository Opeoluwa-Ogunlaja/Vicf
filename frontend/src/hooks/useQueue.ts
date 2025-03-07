import { TaskQueue } from '@/lib/taskQueue'
import { useCallback, useEffect, useRef } from 'react'
import useHistoryState from './useHistory'
import { generageTaskId } from '@/lib/utils/idUtils'
import { useArray } from './useArray'

export const useQueue = (defaultValue: unknown, concurrency: number = 10, capacity = 50) => {
  const taskQueue = useRef<TaskQueue>()
  const isMutating = useArray()
  useEffect(() => {
    taskQueue.current = new TaskQueue(concurrency)
  }, [concurrency])

  const [lastRequest, setLastRequest, controls] = useHistoryState(
    { transactionId: generageTaskId(), data: defaultValue },
    { capacity }
  )

  const queue = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (callback: (...args: any[]) => Promise<any>, mapFn: (...args: any[]) => any) => {
      const taskId = generageTaskId()
      isMutating.push(taskId)
      taskQueue.current
        ?.runTask(callback)
        .then(
          (result: unknown) => {
            setLastRequest({ transactionId: taskId, data: mapFn(taskId, result) })
          },
          e => {
            console.error(e)
          }
        )
        .finally(() => {
          isMutating.removeExact(taskId)
        })
    },
    [isMutating]
  )
  const { history: requestHistory } = controls as { history: (typeof lastRequest)[] }

  return { lastRequest, queue, requestHistory, isMutating: isMutating.values }
}
