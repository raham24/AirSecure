import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const latestScan = await prisma.scan.findFirst({
      orderBy: { timestamp: 'desc' },
      include: {
        device: true,
      },
    });

    if (!latestScan) {
      return NextResponse.json({ message: 'No scan data found.' }, { status: 404 });
    }

    return NextResponse.json({
      apn: latestScan.apn,
      timestamp: latestScan.timestamp,
      deviceName: latestScan.device.name,
      serialNumber: latestScan.device.serialNumber,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch latest scan' }, { status: 500 });
  }
}
