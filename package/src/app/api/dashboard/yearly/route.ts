import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || '');

    if (isNaN(year)) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }

    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const scans = await prisma.scan.findMany({
      where: {
        status: 'completed',
        timestamp: {
          gte: start,
          lt: end,
        },
      },
      select: {
        timestamp: true,
      },
    });

    const monthlyCounts = Array(12).fill(0);
    scans.forEach((scan) => {
      const month = new Date(scan.timestamp).getMonth();
      monthlyCounts[month]++;
    });

    const response = monthlyCounts.map((count) => ({ completed: count }));
    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
