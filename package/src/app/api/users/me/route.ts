import { NextResponse } from "next/server";
import { getAuthUser } from "@/utils/auth"; 

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
  }
  if (!user.isAdmin) {
    return NextResponse.json({ error: "You are not authorized to view this page" }, { status: 403 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}
