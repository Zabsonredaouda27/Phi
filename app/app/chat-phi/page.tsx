'use client';

import { useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User as UserIcon } from 'lucide-react';
import { useDeviceOrientation } from '@/hooks/use-device-orientation';
import { ScrollSettingsContext } from '@/contexts/scroll-settings-context';

// Predefined responses for the simplified chat
const chatResponses = [
  "Welcome to PHI! I'm here to help you explore the multiverse.",
  "The PHI application offers multiple sections for different experiences.",
  "You can navigate between realities using the various sections of PHI.",
  "Each section of PHI provides unique functionality for multiverse exploration.",
  "PHI stands for the golden ratio, representing perfect balance in the multiverse.",
  "Try exploring the different sections: Multi φ, Job φ, Map φ, and Game φ.",
  "The multiverse is vast and full of possibilities. PHI helps you navigate it.",
  "Thank you for using PHI! Feel free to explore all the available sections.",
];

// Initial welcome message
const getInitialMessages = () => [
  { 
    id: 1, 
    sender: 'PHI', 
    content: 'Hello! Welcome to ChatPHI. I\'m your guide to the PHI multiverse. How can I help you explore today?', 
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  }
];

export default function ChatPhi() {
  const router = useRouter();
  const { orientation, isSupported } = useDeviceOrientation();
  const { scrollSpeed, isScrollingEnabled, resetInitialTilt } = useContext(ScrollSettingsContext);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [messages, setMessages] = useState(getInitialMessages());
  const [newMessage, setNewMessage] = useState('');
  const [touchActive, setTouchActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Reset initial tilt when component unmounts
  useEffect(() => {
    return () => {
      resetInitialTilt();
    };
  }, [resetInitialTilt]);

  // Handle touch events to control scrolling
  const handleTouchStart = () => {
    setTouchActive(true);
  };

  const handleTouchEnd = () => {
    setTouchActive(false);
  };

  // Handle tilt-based scrolling
  useEffect(() => {
    if (!orientation || !chatContainerRef.current || !isScrollingEnabled || touchActive) return;

    const { relativeBeta } = orientation;
    
    if (relativeBeta !== null) {
      const scrollSpeedFactor = scrollSpeed * 0.5;
      
      if (relativeBeta < -5) {
        setScrollDirection('down');
        chatContainerRef.current.scrollBy({ 
          top: Math.abs(relativeBeta) * scrollSpeedFactor * 0.1, 
          behavior: 'smooth' 
        });
        setShowScrollIndicator(true);
      } else if (relativeBeta > 5) {
        setScrollDirection('up');
        chatContainerRef.current.scrollBy({ 
          top: -Math.abs(relativeBeta) * scrollSpeedFactor * 0.1, 
          behavior: 'smooth' 
        });
        setShowScrollIndicator(true);
      } else {
        setScrollDirection(null);
        setShowScrollIndicator(false);
      }
    }
  }, [orientation, isScrollingEnabled, touchActive, scrollSpeed]);

  // Get a random response
  const getRandomResponse = () => {
    return chatResponses[Math.floor(Math.random() * chatResponses.length)];
  };

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: 'User',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Auto-scroll to bottom after sending a message
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
    
    // Simulate typing delay
    setIsTyping(true);
    
    setTimeout(() => {
      const phiResponse = {
        id: messages.length + 2,
        sender: 'PHI',
        content: getRandomResponse(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, phiResponse]);
      setIsTyping(false);
      
      // Auto-scroll to bottom after receiving response
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-1200 mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-blue-800/50 rounded-2xl shadow-lg p-4 mb-4"
        >
          <div className="flex items-center mb-4">
            <div className="relative w-10 h-10 mr-3">
              <Image
                src="/ChatPHI.png"
                alt="ChatPHI Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                ChatPHI Interface
              </h2>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Your guide to the PHI multiverse
              </p>
            </div>
          </div>
          
          {/* Scroll Indicators */}
          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center mb-2"
              >
                {scrollDirection === 'up' ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/70 px-3 py-1 rounded-full">
                    <span className="text-xs">Scrolling Up</span>
                  </div>
                ) : scrollDirection === 'down' ? (
                  <div className="flex items-center text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/70 px-3 py-1 rounded-full">
                    <span className="text-xs">Scrolling Down</span>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Chat Messages Container */}
          <div 
            ref={chatContainerRef}
            className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-3 h-[60vh] overflow-y-auto mb-4 chat-container"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-3 ${message.sender === 'User' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'User' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {message.sender === 'User' ? (
                        <UserIcon size={14} className="mr-1" />
                      ) : (
                        <Bot size={14} className="mr-1" />
                      )}
                      <span className="font-medium text-sm">
                        {message.sender}
                      </span>
                    </div>
                    <span className="text-xs opacity-70">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className={`text-sm ${message.sender === 'User' ? 'text-white' : 'text-blue-700 dark:text-blue-200'}`}>
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-3"
              >
                <div className="bg-white dark:bg-blue-800 rounded-lg p-3 flex items-center text-blue-700 dark:text-blue-200">
                  <Bot size={14} className="mr-2" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="ml-2 text-sm">PHI is thinking...</span>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me about the PHI multiverse..."
              className="flex-1 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              className={`${
                isTyping
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-full p-2 transition-colors`}
              disabled={isTyping}
            >
              <Send size={20} />
            </button>
          </form>
        </motion.div>

        {!isSupported && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-blue-800/50 rounded-2xl shadow-lg p-4"
          >
            <div className="flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg mb-2">
              <p className="text-sm">
                Device orientation not supported. Manual scrolling is enabled.
              </p>
            </div>
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              For the best experience, please use a device with orientation sensors.
            </p>
          </motion.div>
        )}
        
        {touchActive && (
          <div className="fixed bottom-4 left-0 right-0 text-center">
            <div className="inline-block bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm">
              Touch detected - scrolling paused
            </div>
          </div>
        )}
      </div>
    </main>
  );
}