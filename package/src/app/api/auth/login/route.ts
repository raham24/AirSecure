import { NextResponse } from 'next/server'
import { signJwt } from '@/utils/jwt'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'
import { serialize } from 'cookie'

export async function POST(req: Request) {
  const { email,name, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = signJwt({ userId: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin })

  const response = NextResponse.json({ message: 'Login successful' })

  response.headers.set(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  )

  return response
}
