import { cookies } from 'next/headers';
import { verifyJwt } from './jwt';
import { prisma } from './prisma';

export async function getUserFromCookie() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  const decoded = verifyJwt(token) as { userId: number } | null;
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { name: true, email: true }, 
  });
  

  return user;
}
// Compare this snippet from package/src/app/api/auth/signup/route.ts: