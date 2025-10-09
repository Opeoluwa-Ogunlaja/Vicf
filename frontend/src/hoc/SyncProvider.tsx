import { SyncContext } from '@/contexts/SyncContext'
import { db, QueuedTask } from '@/stores/dexie/db'
import { myTaskManager } from '@/lib/taskManager'
import { FC, memo, ReactNode, useCallback, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useOnline } from '@/hooks/useOnline'
import { asyncForeach } from '@/lib/utils/promiseUtils'

const SyncProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isOnline } = useOnline()
  const tasks = useLiveQuery(async () => {
    return await db.queuedTasks.toArray()
  })

  const queueTask = useCallback(async (entry: QueuedTask) => {
    // upsert the full task entry so status/attempts/nextAttemptAt etc are preserved when re-queueing
    await db.queuedTasks.put(entry)
  }, [])
  useEffect(() => {
    myTaskManager.listen(queueTask)
    return () => {
      // Task manager may expose different removal APIs; try common names safely
      
      myTaskManager.unlisten(queueTask)
    }
  }, [])
  const keepSync = useCallback(async () => {
    // Query DB for eligible tasks: idle and due
    const now = Date.now()
    const eligible = await db.queuedTasks
      .where('status')
      .equals('idle')
      .and(t => (t.nextAttemptAt || 0) <= now)
      .toArray()

    if (!eligible || eligible.length === 0) return

    // Try to claim each eligible task. TaskManager.retry performs an atomic claim.
    await asyncForeach(eligible, async task => {
      try {
        await myTaskManager.retry(task._id)
      } catch (e) {
        console.error('sync task retry failed', e)
      }
    })
  }, [])

  useEffect(() => {
    if (isOnline) keepSync()
  }, [isOnline, keepSync])

  return (
    <SyncContext.Provider
      value={{
        tasks: tasks!
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}

export default memo(SyncProvider)
