import { getUserFromCookie } from '@/utils/getUsersFromCookies';
import LayoutClientWrapper from './LayoutClientWrapper';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromCookie();

  return <LayoutClientWrapper user={user}>{children}</LayoutClientWrapper>;
}
