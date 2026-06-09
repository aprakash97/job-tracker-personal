import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { users, type NewUser } from '../../src/db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { comparePasswords, hashPassword } from '../utils/password.ts'
import db from '../db/connection.ts'
import { DatabaseError } from 'pg'

// Request generic accepts <Params, ResBody, ReqBody, Query> in that exact order. And if you know there aren't any params, you can pass an empty object {} instead of any for maximum type safety.

export const register = async (
  req: Request<any, NewUser, NewUser>,
  res: Response,
) => {
  try {
    const hashedPassword = await hashPassword(req.body.password)

    const [user] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    })

    return res.status(200).json({
      message: 'User Created',
      user,
      token,
    })
  } catch (e) {
    console.error('Registration error', e)
    const dbError = e as DatabaseError
    if ((dbError.code = '23502')) {
      res.status(409).json({
        error: 'Email already exists',
      })
    } else {
      res.status(500).json({
        error: 'Failed to create user',
      })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      return res.status(401).json({ error: 'Invalid Credentials' })
    }

    const isValidPassword = comparePasswords(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid Credentials' })
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    })

    return res.status(200).json({
      message: 'Login success',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      }
    })
  } catch (e) {
    console.error('Login error', e)
    res.status(500).json({
      error: 'Failed to login user',
    })
  }
}
