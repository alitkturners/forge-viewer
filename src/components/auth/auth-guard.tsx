'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token === null) {
      router.replace('/auth/sign-in');
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  if (isChecking) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}