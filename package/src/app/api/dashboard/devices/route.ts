import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUser } from '@/utils/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
    }
    if (!user.isAdmin) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const devices = await prisma.device.findMany({
      where: { isActive: true },
      select: {
        id: true,
        scans: {
          select: { id: true },
        },
      },
    });

    const activeCount = devices.length;
    const scanCounts = devices.map((device) => device.scans.length);

    return NextResponse.json({
      activeCount,
      scanCounts,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
