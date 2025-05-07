import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUser } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(devices);
  } catch (error) {
    console.error('GET /api/devices error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
