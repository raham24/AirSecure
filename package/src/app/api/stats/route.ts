import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const timeframe = url.searchParams.get('timeframe') || '30d';

    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const devices = await prisma.device.findMany({
      include: {
        scans: {
          where: {
            timestamp: {
              gte: startDate,
              lte: now,
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    const dailyScans: { [date: string]: number } = {};
    let current = new Date(startDate);
    while (current <= now) {
      dailyScans[current.toISOString().split('T')[0]] = 0;
      current.setDate(current.getDate() + 1);
    }

    devices.forEach((device) => {
      device.scans.forEach((scan) => {
        const key = scan.timestamp.toISOString().split('T')[0];
        if (dailyScans[key] !== undefined) {
          dailyScans[key]++;
        }
      });
    });

    const timeSeriesData = Object.entries(dailyScans).map(([date, count]) => ({
      x: date,
      y: count,
    }));

    const deviceEfficiency = devices.map((device) => {
      const total = device.scans.length;
      const completed = device.scans.filter((s) => s.status === 'completed').length;
      const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        id: device.id,
        name: device.name,
        serialNumber: device.serialNumber,
        efficiency,
        totalScans: total,
      };
    });

    const apnsByDevice = devices.map((device) => ({
      name: device.name,
      scanCount: device.scans.length,
    }));

    return NextResponse.json({
      timeSeriesData,
      deviceEfficiency,
      apnsByDevice,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
