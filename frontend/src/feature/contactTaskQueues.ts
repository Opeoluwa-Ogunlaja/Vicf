import { TaskQueue } from '@/lib/taskQueue'
import { isMobile } from 'react-device-detect'

export const contactTasks = new TaskQueue(isMobile ? 3 : 10)
