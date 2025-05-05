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

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const tickets = await prisma.ticket.findMany({
      where: {
        created: {
          gte: startOfYear,
        },
      },
      select: {
        status: true,
      },
    });

    const total = tickets.length;
    const resolved = tickets.filter(t => t.status.toLowerCase() === 'closed').length;
    const unresolved = total - resolved;

    return NextResponse.json({
      total,
      resolved,
      unresolved,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
