import expressAsyncHandler from 'express-async-handler'
import { dashboardUseCases } from '../use cases/DashboardUseCases'
import { AsyncHandler } from '../types'

class DashboardController {
  get_stats: AsyncHandler<any, any> = async (req, res) => {
    const userId = req.user?.id
    const stats = await dashboardUseCases.getUserStats(userId)
    res.json({ ok: true, data: stats })
  }
}

export const dashboardController = new Proxy(new DashboardController(), {
  get(target: DashboardController, prop: keyof DashboardController) {
    const obj = target[prop]
    if (typeof obj == 'function') {
      return expressAsyncHandler(obj as (req: any, res: any, next: any) => any)
    }
    return obj
  }
})
