import type { NextFunction, Request, Response } from 'express'
import { type payload, verifyToken } from '../utils/jwt.ts'

export interface AuthenticatedRequest extends Request {
  user?: payload
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Bad Request' })
    }

    const payload = await verifyToken(token)
    req.user = payload
    next()
  } catch (e) {
    return res.status(403).json({ error: 'Forbidden' })
  }
}
