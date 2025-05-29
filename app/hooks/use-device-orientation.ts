'use client';

import { useState, useEffect, useContext } from 'react';
import { ScrollSettingsContext } from '@/contexts/scroll-settings-context';

interface DeviceOrientation {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  relativeBeta: number | null;
  relativeGamma: number | null;
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
    relativeBeta: null,
    relativeGamma: null
  });
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const { initialTilt, setInitialTilt } = useContext(ScrollSettingsContext);

  useEffect(() => {
    // Check if the DeviceOrientationEvent is supported
    if (typeof window !== 'undefined' && !window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Set initial tilt reference if not set yet
      if (initialTilt.beta === null && event.beta !== null) {
        setInitialTilt({
          beta: event.beta,
          gamma: event.gamma
        });
      }

      // Calculate relative tilt based on initial reference
      const relativeBeta = event.beta !== null && initialTilt.beta !== null 
        ? event.beta - initialTilt.beta 
        : null;
        
      const relativeGamma = event.gamma !== null && initialTilt.gamma !== null 
        ? event.gamma - initialTilt.gamma 
        : null;

      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        relativeBeta,
        relativeGamma
      });
    };

    // Try to add the event listener
    try {
      window.addEventListener('deviceorientation', handleOrientation);
    } catch (error) {
      console.error('Device orientation not supported:', error);
      setIsSupported(false);
    }

    // Check if we're getting actual values after a short delay
    const timer = setTimeout(() => {
      if (
        orientation.alpha === null &&
        orientation.beta === null &&
        orientation.gamma === null
      ) {
        setIsSupported(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearTimeout(timer);
    };
  }, [initialTilt, setInitialTilt]);

  return { orientation, isSupported };
}