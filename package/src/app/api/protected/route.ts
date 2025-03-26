import { NextResponse } from 'next/server'
import { verifyJwt } from '@/utils/jwt'
import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const decoded = verifyJwt(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return NextResponse.json({ message: 'You are authenticated', user: decoded })
}
