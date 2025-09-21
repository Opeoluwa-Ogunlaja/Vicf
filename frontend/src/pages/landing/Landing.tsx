import { TaskQueue } from '@/lib/taskQueue'
import { wait } from '@/lib/utils/promiseUtils'
import { memo, useMemo } from 'react'

const Landing = () => {
  const queue = useMemo(() => {
    const taskQueue = new TaskQueue(3)
    return taskQueue
  }, [])

  const hello = () => wait(2000, 'hello').then(res => console.log(res, queue.paused))
  return (
    <div className="flex gap-4">
      Landing
      <button onClick={() => queue.runTask(hello)}>QueueTask</button>
      <button onClick={() => queue.pause()}>Pause</button>
      <button onClick={() => queue.resume()}>Resume</button>
    </div>
  )
}

export default memo(Landing)
