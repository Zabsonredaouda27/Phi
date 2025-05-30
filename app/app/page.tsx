'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Robust navigation handler
  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    console.log('Navigating to:', path);
    
    // Use router.push for programmatic navigation
    router.push(path);
    
    // Fallback: use window.location if router fails
    setTimeout(() => {
      if (window.location.pathname === '/' && path !== '/') {
        console.log('Router navigation failed, using window.location');
        window.location.href = path;
      }
    }, 1000);
  };

  // Navigation configuration with proper paths
  const navigationConfig = [
    {
      direction: 'up',
      path: '/map',
      label: 'Map φ',
      position: { gridColumn: '2', gridRow: '1' },
      hoverEffect: { y: -5 },
      description: 'Location services and travel recommendations'
    },
    {
      direction: 'down',
      path: '/job',
      label: 'Job φ',
      position: { gridColumn: '2', gridRow: '3' },
      hoverEffect: { y: 5 },
      description: 'Job search and resume analysis'
    },
    {
      direction: 'left',
      path: '/tilt-left/game',
      label: 'Game φ',
      position: { gridColumn: '1', gridRow: '2' },
      hoverEffect: { x: -5 },
      description: 'Interactive games and entertainment'
    },
    {
      direction: 'right',
      path: '/tilt-right',
      label: 'Multi φ',
      position: { gridColumn: '3', gridRow: '2' },
      hoverEffect: { x: 5 },
      description: 'Social media platform'
    },
    {
      direction: 'center',
      path: '/chat-phi',
      label: 'ChatPHI',
      position: { gridColumn: '2', gridRow: '2' },
      hoverEffect: { scale: 1.1 },
      description: 'AI-powered chat interface',
      isCenter: true
    }
  ];

  if (!mounted) {
    return (
      <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 flex items-center justify-center">
        <div className="text-blue-600 dark:text-blue-300">Loading PHI...</div>
      </main>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      {/* Background Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent dark:from-blue-500/10" />
      </motion.div>

      {/* Navigation Grid */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full max-w-sm h-full max-h-96">
          {navigationConfig.map((nav, index) => (
            <motion.div
              key={nav.direction}
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                ...nav.hoverEffect 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: 0,
                y: 0
              }}
              transition={{ 
                delay: 0.4 + (index * 0.1), 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              style={{
                gridColumn: nav.position.gridColumn,
                gridRow: nav.position.gridRow
              }}
              className="relative"
            >
              <Link 
                href={nav.path} 
                prefetch={true}
                className="block w-full h-full"
                aria-label={`Navigate to ${nav.label} - ${nav.description}`}
                onClick={(e) => handleNavigation(nav.path, e)}
              >
                <motion.div
                  whileHover={{ 
                    scale: nav.isCenter ? 1.1 : 1.05,
                    ...nav.hoverEffect,
                    boxShadow: nav.isCenter 
                      ? "0 10px 25px -5px rgba(0, 102, 204, 0.4)" 
                      : "0 8px 20px -5px rgba(0, 102, 204, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    w-full h-full min-h-[80px] bg-white dark:bg-blue-800 rounded-2xl shadow-lg 
                    flex flex-col items-center justify-center transition-all duration-300
                    hover:shadow-xl active:scale-95
                    ${nav.isCenter ? 'ring-2 ring-blue-200 dark:ring-blue-600' : ''}
                    touch-manipulation select-none cursor-pointer
                  `}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleNavigation(nav.path)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNavigation(nav.path);
                    }
                  }}
                >
                  {nav.isCenter ? (
                    <div className="relative w-16 h-16 mb-2">
                      <Image
                        src="/ChatPHI.png"
                        alt="ChatPHI Logo"
                        fill
                        className="object-contain"
                        priority
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="mb-2">
                      <div className={`
                        w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 
                        flex items-center justify-center text-blue-600 dark:text-blue-300
                      `}>
                        <span className="text-lg font-bold">φ</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-blue-700 dark:text-blue-200 font-medium text-center text-sm px-2">
                    {nav.label}
                  </p>
                </motion.div>
              </Link>
              
              {/* Tooltip for better UX */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="bg-blue-900 dark:bg-blue-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                  {nav.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-900 dark:border-t-blue-700"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center px-4"
      >
        <p className="text-blue-600 dark:text-blue-300 text-sm mb-2">
          Tap any button to navigate to that section
        </p>
        <p className="text-blue-500 dark:text-blue-400 text-xs">
          Explore all sections of the PHI application
        </p>
      </motion.div>

      {/* Accessibility improvements */}
      <div className="sr-only">
        <h1>PHI Application Welcome Page</h1>
        <p>Navigate to different sections of the PHI application using the buttons below.</p>
        <ul>
          {navigationConfig.map((nav) => (
            <li key={nav.direction}>
              <button 
                onClick={() => handleNavigation(nav.path)}
                className="text-left underline text-blue-600 hover:text-blue-800"
              >
                {nav.label}: {nav.description}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}