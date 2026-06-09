import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import { validateBody, validateParams } from '../middleware/validation.ts'
import {
  createJob,
  getSingleJob,
  getUserJobs,
  updateUserJobs,
} from '../controllers/jobController.ts'
import { insertJobSchema } from '../db/schema.ts'
import z from 'zod'

const paramJobSchema = z.object({
  id: z.string(),
})

const patchJobSchema = z.object({
  companyName: z.string().min(1).max(100).optional(),
  jobTitle: z.string().min(1).max(100).optional(),
  jobDescription: z.string().optional(),
  currency: z.enum(['LKR', 'USD', 'AUD', 'CAD', 'INR']).optional(),
  isRemote: z.boolean().optional(),
  status: z.int().optional(),
  salary: z.int().optional(),
})

const router = Router()

router.use(authenticateToken)

//get job
router.get('/:id', validateParams(paramJobSchema), getSingleJob)
router.get('/', getUserJobs)

// create-new-job
router.post('/', validateBody(insertJobSchema), createJob)

// job update
router.patch(
  '/:id',
  validateParams(paramJobSchema),
  validateBody(patchJobSchema),
  updateUserJobs,
)

export default router
