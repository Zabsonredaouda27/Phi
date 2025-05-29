'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
  Bell,
  X,
  Settings,
  ChevronRight,
  Sliders,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ScrollSettingsContext } from '@/contexts/scroll-settings-context';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Function to handle navigation with proper route updates
  const navigateTo = (path: string) => {
    router.push(path);
    onClose(); // Close sidebar after navigation
  };
  const { theme, setTheme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { 
    scrollSpeed, 
    setScrollSpeed, 
    isScrollingEnabled, 
    setIsScrollingEnabled 
  } = useContext(ScrollSettingsContext);

  // Check if current page is ChatPHI or Multi φ
  const isScrollingPage = pathname === '/chat-phi' || pathname === '/tilt-right';

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle swipe to close
  const handleSwipe = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentX = moveEvent.touches[0].clientX;
      const diff = currentX - touchStartX;
      
      // If swiping left (negative diff), close the sidebar
      if (diff < -50) {
        onClose();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Increase scroll speed
  const increaseSpeed = () => {
    setScrollSpeed(Math.min(scrollSpeed + 1, 5));
  };

  // Decrease scroll speed
  const decreaseSpeed = () => {
    setScrollSpeed(Math.max(scrollSpeed - 1, 1));
  };

  // Toggle scrolling
  const toggleScrolling = () => {
    setIsScrollingEnabled(!isScrollingEnabled);
  };

  const menuItems = [
    {
      title: 'Account Settings',
      items: [
        { 
          icon: <User size={20} />, 
          label: 'Profile', 
          onClick: () => console.log('Profile clicked') 
        },
        { 
          icon: <LogOut size={20} />, 
          label: 'Logout', 
          onClick: () => console.log('Logout clicked') 
        }
      ]
    },
    {
      title: 'Application Settings',
      items: [
        { 
          icon: theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />, 
          label: theme === 'dark' ? 'Light Mode' : 'Dark Mode', 
          onClick: toggleTheme 
        },
        { 
          icon: <Globe size={20} />, 
          label: 'Language', 
          onClick: () => console.log('Language clicked') 
        },
        { 
          icon: <Bell size={20} />, 
          label: 'Notifications', 
          onClick: () => console.log('Notifications clicked') 
        }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white dark:bg-blue-900 shadow-xl z-50"
            onTouchStart={handleSwipe}
          >
            <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-blue-800">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-200 flex items-center">
                <Settings className="mr-2" size={20} />
                Settings
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-64px)]">
              {/* Scrolling Controls (only shown on ChatPHI or Multi φ pages) */}
              {isScrollingPage && (
                <div className="p-4 border-b border-blue-100 dark:border-blue-800">
                  <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-3 flex items-center">
                    <Sliders size={16} className="mr-2" />
                    Scrolling Controls
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Toggle Scrolling */}
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 dark:text-blue-200">Tilt Scrolling</span>
                      <button 
                        onClick={toggleScrolling}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isScrollingEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-blue-800'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isScrollingEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Scrolling Speed */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-700 dark:text-blue-200">Scrolling Speed</span>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={decreaseSpeed}
                            className="p-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
                            disabled={scrollSpeed === 1}
                          >
                            <ChevronDown size={16} />
                          </button>
                          <span className="text-blue-700 dark:text-blue-200 w-5 text-center">
                            {scrollSpeed}
                          </span>
                          <button 
                            onClick={increaseSpeed}
                            className="p-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
                            disabled={scrollSpeed === 5}
                          >
                            <ChevronUp size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={scrollSpeed}
                        onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 dark:bg-blue-700 rounded-lg appearance-none cursor-pointer"
                      />
                      
                      <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                        Tilt your device to scroll. The current tilt when you entered the page is used as the reference point.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Menu Items */}
              {menuItems.map((section, idx) => (
                <div key={idx} className="p-4 border-b border-blue-100 dark:border-blue-800">
                  <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <button
                          onClick={item.onClick}
                          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-200"
                        >
                          <div className="flex items-center">
                            <span className="mr-3 text-blue-600 dark:text-blue-300">
                              {item.icon}
                            </span>
                            {item.label}
                          </div>
                          <ChevronRight size={16} className="text-blue-400 dark:text-blue-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}