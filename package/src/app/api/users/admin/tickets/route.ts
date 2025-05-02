import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthUser } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const tickets = await prisma.ticket.findMany({
      orderBy: { created: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("API ERROR in /api/admin/tickets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
