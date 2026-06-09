import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from '../src/routes/authRoute.ts'
import jobRoutes from '../src/routes/jobRoute.ts'
import userRoutes from '../src/routes/userRoute.ts'
import { isTestEnv } from '../env.ts'

// Create Express application
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(
  morgan('dev', {
    skip: () => isTestEnv(),
  }),
)

// Health check endpoint - always good to have!
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: 'App is working',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)

// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app
