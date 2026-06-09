import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { db } from '../db/connection.ts'
import { jobs } from '../db/schema.ts'
import { eq, and, desc } from 'drizzle-orm'

export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      companyName,
      jobTitle,
      jobDescription,
      currency,
      salary,
      isRemote,
    } = req.body

    // const result = await db.transaction(async (tx) => {
    //   const [newJob] = await tx
    //     .insert(jobs)
    //     .values({
    //       companyName,
    //       jobTitle,
    //       jobDescription,
    //       salary,
    //       currency,
    //       isRemote,
    //       userId: req.user?.id ?? '0',
    //     })
    //     .returning()
    // })

    const [result] = await db
      .insert(jobs)
      .values({
        companyName,
        jobTitle,
        jobDescription,
        salary,
        currency,
        isRemote,
        userId: req.user?.id ?? '0',
      })
      .returning()

    return res.status(201).json({
      message: 'Successfully created',
      result,
    })
  } catch (e) {
    console.error('Error creating jobs', e)
    res.status(500).json({ error: 'Failed to create jobs' })
  }
}

export const getSingleJob = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const [id] = req.params.id

    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, id),
    })
    return res.status(201).json({
      message: 'Get job',
      job,
    })
  } catch (e) {
    console.error('Error getting job', e)
    res.status(500).json({ error: 'Failed to get job' })
  }
}

export const getUserJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userJobs = await db.query.jobs.findMany({
      where: eq(jobs.id, req.user?.id ?? '0'),
      orderBy: [desc(jobs.createdAt)],
    })

    return res.status(201).json({
      message: 'Get all jobs',
      userJobs,
    })
  } catch (e) {
    console.error('Error getting jobs', e)
    res.status(500).json({ error: 'Failed to get jobs' })
  }
}

export const updateUserJobs = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const [id] = req.params.id

    const result = await db
      .update(jobs)
      .set({ ...req.body.params })
      .where(and(eq(jobs.id, id), eq(jobs.userId, req.user?.id ?? '0')))

    if (!result) {
      return res.status(404).end()
    }
    return res.status(200).json({
      message: 'update Success',
      result,
    })
  } catch (e) {}
}
