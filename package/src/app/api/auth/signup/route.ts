import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { email, name, password } = await req.json()

  if (!email || !password || !name ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  return NextResponse.json({ message: 'User created', userId: user.id })
}
