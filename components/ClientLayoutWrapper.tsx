'use client';

import { usePathname } from 'next/navigation';
import AppLayout from '@/components/AppLayout';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define public routes that don't need the AppLayout sidebar
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register';

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
