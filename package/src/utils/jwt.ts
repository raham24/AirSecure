import jwt, { SignOptions } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET as string

export function signJwt(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions)
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}
