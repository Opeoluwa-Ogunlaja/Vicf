/* eslint-disable @typescript-eslint/no-explicit-any */
import { TaskQueue } from './lib/taskQueue'
import { isMobile } from 'react-device-detect'

const globalKey = '__ONLINE_TASK_QUEUE__'

if (!(globalThis as any)[globalKey]) {
  (globalThis as any)[globalKey] = new TaskQueue(isMobile ? 3 : 10, true)
}

export const OnlineTaskQueue: TaskQueue = (globalThis as any)[globalKey]