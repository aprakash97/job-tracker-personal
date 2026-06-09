import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()
router.use(authenticateToken)

// job-specific routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all jobs' })
})

// create-new-job
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Job created' })
})

// job completion routes
router.post('/:id/complete', (req, res) => {
  res.json({ message: `Mark habit ${req.params.id} complete` })
})

router.get('/:id/stats', (req, res) => {
  res.json({ message: `Get stats for habit ${req.params.id}` })
})

export default router
