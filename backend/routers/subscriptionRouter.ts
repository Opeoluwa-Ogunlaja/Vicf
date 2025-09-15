import express from 'express'
const router = express.Router()

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/', async (req, res) => {
  // Integrate with payment provider here
  // For now, just return success
  res.json({ status: 'active' })
})

export default router
