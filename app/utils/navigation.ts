'use client';

import { useRouter } from 'next/navigation';

// Centralized navigation paths
export const ROUTES = {
  HOME: '/',
  MAP: '/map',
  JOB: '/job',
  GAME: '/tilt-left/game',
  MULTI: '/tilt-right',
  CHAT_PHI: '/chat-phi',
};

// Navigation utility function
export const useNavigation = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    // Force a hard navigation to ensure page content updates
    router.push(path);
  };

  return {
    navigateTo,
    routes: ROUTES,
  };
};
