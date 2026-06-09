import { Router } from 'express'
import { validateBody } from '../middleware/validation.ts'
import { login, register } from '../controllers/authController.ts'
import { insertUserSchema } from '../db/schema.ts'
import z from 'zod'
const router = Router()

const registerSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string(),
  lastName: z.string(),
})

const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

// Authentication routes
router.post('/register', validateBody(registerSchema), register)

router.post('/login', validateBody(loginSchema), login)

router.post('/logout', (req, res) => {
  res.json({ message: 'User logged out' })
})

router.post('/refresh', (req, res) => {
  res.json({ message: 'Token refreshed' })
})

export default router
