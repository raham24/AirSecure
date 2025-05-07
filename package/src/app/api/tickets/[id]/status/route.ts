import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthUser } from '@/utils/auth';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Please login to continue' }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const ticketId = parseInt(params.id);
    const { status } = await req.json();

    if (!['open', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
