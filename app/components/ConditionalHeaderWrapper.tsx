'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalHeaderWrapperProps {
  children: ReactNode;
}

export default function ConditionalHeaderWrapper({ children }: ConditionalHeaderWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return null;
  }

  return <>{children}</>;
}