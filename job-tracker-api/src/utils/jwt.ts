import { jwtVerify, SignJWT } from 'jose'
import { createSecretKey } from 'crypto'
import env from '../../env.ts'

export interface payload {
  id: string
  email: string
  firstName: string
}

export const generateToken = (payload: payload) => {
  const secret = env.JWT_SECRET
  const secretKey = createSecretKey(secret, 'utf-8')

  return new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secretKey)
}

export const verifyToken = async (token: string): Promise<payload> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
  const { payload } = await jwtVerify(token, secretKey)

  return payload as unknown as payload
}
