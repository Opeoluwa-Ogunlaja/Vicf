import { SyncContext } from '@/contexts/SyncContext'
import { db, QueuedTask } from '@/stores/dexie/db'
import { myTaskManager } from '@/lib/taskManager'
import { FC, memo, ReactNode, useCallback, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

const SyncProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
      myTaskManager.unlisten(queueTask)
    }
  }, [queueTask])

  useEffect(() => {
    let mounted = true
    if (mounted) myTaskManager.keepSync()
    return () => {
      mounted = false
    }
  }, [])

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
