'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/navigation';

export default function TiltUpRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Map page
    router.replace(ROUTES.MAP);
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      <div className="text-blue-600 dark:text-blue-300 text-center">
        <div className="animate-pulse mb-4">Redirecting to Map φ...</div>
      </div>
    </div>
  );
}
