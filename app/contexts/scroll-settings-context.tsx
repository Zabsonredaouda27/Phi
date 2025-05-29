'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

interface ScrollSettingsContextType {
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
  isScrollingEnabled: boolean;
  setIsScrollingEnabled: (enabled: boolean) => void;
  initialTilt: { beta: number | null; gamma: number | null };
  setInitialTilt: (tilt: { beta: number | null; gamma: number | null }) => void;
  resetInitialTilt: () => void;
}

export const ScrollSettingsContext = createContext<ScrollSettingsContextType>({
  scrollSpeed: 3,
  setScrollSpeed: () => {},
  isScrollingEnabled: true,
  setIsScrollingEnabled: () => {},
  initialTilt: { beta: null, gamma: null },
  setInitialTilt: () => {},
  resetInitialTilt: () => {}
});

interface ScrollSettingsProviderProps {
  children: ReactNode;
}

export function ScrollSettingsProvider({ children }: ScrollSettingsProviderProps) {
  const [scrollSpeed, setScrollSpeed] = useState(3);
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(true);
  const [initialTilt, setInitialTilt] = useState<{ beta: number | null; gamma: number | null }>({
    beta: null,
    gamma: null
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSpeed = localStorage.getItem('scrollSpeed');
      const savedEnabled = localStorage.getItem('isScrollingEnabled');
      
      if (savedSpeed) setScrollSpeed(parseInt(savedSpeed));
      if (savedEnabled) setIsScrollingEnabled(savedEnabled === 'true');
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scrollSpeed', scrollSpeed.toString());
      localStorage.setItem('isScrollingEnabled', isScrollingEnabled.toString());
    }
  }, [scrollSpeed, isScrollingEnabled]);

  const resetInitialTilt = () => {
    setInitialTilt({ beta: null, gamma: null });
  };

  return (
    <ScrollSettingsContext.Provider
      value={{
        scrollSpeed,
        setScrollSpeed,
        isScrollingEnabled,
        setIsScrollingEnabled,
        initialTilt,
        setInitialTilt,
        resetInitialTilt
      }}
    >
      {children}
    </ScrollSettingsContext.Provider>
  );
}