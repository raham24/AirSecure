import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUser } from '@/utils/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
  }

  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing title or description' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: 'medium',
        status: 'open',
        created: new Date(),
        userId: user.id,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    let whereClause = {};
    if (status === 'open' || status === 'closed') {
      whereClause = { status };
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        created: 'desc',
      },
    });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
