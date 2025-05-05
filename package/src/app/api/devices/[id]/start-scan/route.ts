import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ScanStatus } from '@prisma/client';
import { getAuthUser } from '@/utils/auth'; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deviceId = parseInt(params.id);
    if (isNaN(deviceId)) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    const user = await getAuthUser(req);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    if ((device.scan_status as ScanStatus) !== ScanStatus.idle) {
      return NextResponse.json(
        { error: "Scan already in progress or completed" },
        { status: 400 }
      );
    }

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: {
        scan_status: ScanStatus.requested,
      },
    });

    return NextResponse.json(updatedDevice);
  } catch (err) {
    console.error("Error in start-scan route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
