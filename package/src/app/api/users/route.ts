import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Please log in to continue" }, 
      { status: 401 }
    );
  }
  if (!user.isAdmin) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 403 }
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      isAdmin: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
