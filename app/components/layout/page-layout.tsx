'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSwipe } from '@/hooks/use-swipe';
import SidebarMenu from '@/components/sidebar-menu';
import { useContext } from 'react';
import { ScrollSettingsContext } from '@/contexts/scroll-settings-context';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { resetInitialTilt } = useContext(ScrollSettingsContext);

  // Reset initial tilt when navigating between pages
  useEffect(() => {
    resetInitialTilt();
    
    // Force a re-render of the children when pathname changes
    // This ensures the page content updates properly
    const handleRouteChangeComplete = () => {
      console.log('Route change completed to:', pathname);
      
      // Force focus on the main content area to ensure proper rendering
      if (pageRef.current) {
        pageRef.current.focus();
      }
    };

    handleRouteChangeComplete();
  }, [pathname, resetInitialTilt]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Setup swipe detection
  useSwipe(pageRef, {
    onSwipeRight: openSidebar,
    onSwipeLeft: closeSidebar,
  });

  return (
    <div 
      ref={pageRef} 
      className="min-h-screen"
      tabIndex={-1} // Make div focusable but not in tab order
    >
      <SidebarMenu isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}