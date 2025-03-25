import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // TODO: Add JWT or session logic here
  return NextResponse.json({ message: 'Login successful', userId: user.id })
}
