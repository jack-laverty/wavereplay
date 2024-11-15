'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalHeaderWrapperProps {
  children: ReactNode;
}

export default function ConditionalHeaderWrapper({ children }: ConditionalHeaderWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  if (isLoginPage || isRegisterPage) {
    return null;
  }

  return <>{children}</>;
}