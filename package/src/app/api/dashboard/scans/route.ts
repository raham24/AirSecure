import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 7,
      include: {
        device: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(scans);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
