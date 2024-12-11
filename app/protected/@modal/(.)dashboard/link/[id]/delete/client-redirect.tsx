'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const ClientRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/protected/dashboard');
  }, [router]);

  return null;
};
