import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthUser } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // Authenticate the requester
  const user = await getAuthUser(req);

  if (!user) {
    return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const targetUserId = parseInt(params.id);
  if (isNaN(targetUserId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { isAdmin: !targetUser.isAdmin },
  });

  return NextResponse.json(updatedUser);
}
