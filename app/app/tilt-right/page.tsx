'use client';

import { useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Home, 
  Bell, 
  User, 
  Users, 
  Compass, 
  Bookmark, 
  Plus, 
  Camera, 
  Video, 
  Image as ImageIcon, 
  Smile, 
  Send, 
  ThumbsUp, 
  X,
  MapPin
} from 'lucide-react';
import { useDeviceOrientation } from '@/hooks/use-device-orientation';
import { ScrollSettingsContext } from '@/contexts/scroll-settings-context';

// Sample user data
const currentUser = {
  id: 1,
  name: "Alex Quantum",
  username: "alex_quantum",
  avatar: "/ChatPHI.png",
  bio: "Exploring the multiverse one reality at a time. PHI enthusiast and quantum navigator."
};

// Sample posts data
const postsData = [
  {
    id: 1,
    user: {
      id: 2,
      name: "Sophia Dimension",
      username: "sophia_d",
      avatar: "/ChatPHI.png"
    },
    content: "Just discovered an amazing new reality through PHI! The physics here are completely different - gravity works sideways and time flows backwards on Tuesdays. Anyone else visited Reality #42B yet? #PHIexplorer #multiversetravel",
    image: "/Croll auto 01.png",
    likes: 128,
    comments: 24,
    shares: 7,
    timestamp: "2 hours ago",
    liked: false
  },
  {
    id: 2,
    user: {
      id: 3,
      name: "Quantum Labs",
      username: "quantum_official",
      avatar: "/ChatPHI.png",
      verified: true
    },
    content: "Exciting news! We've just released the latest update to PHI that allows for smoother transitions between realities. Download the update now to experience enhanced multiverse navigation! #PHIupdate #quantumleap",
    image: "/croll 02.png",
    likes: 342,
    comments: 56,
    shares: 89,
    timestamp: "5 hours ago",
    liked: true
  },
  {
    id: 3,
    user: {
      id: 4,
      name: "Max Reality",
      username: "max_reality",
      avatar: "/ChatPHI.png"
    },
    content: "Working on a new theory about how the multiverse is connected. I think PHI is just scratching the surface of what's possible. Who wants to collaborate on this research? #theoreticalphysics #multiverse",
    likes: 76,
    comments: 31,
    shares: 5,
    timestamp: "Yesterday",
    liked: false
  },
  {
    id: 4,
    user: {
      id: 5,
      name: "Parallel Pathways",
      username: "parallel_paths",
      avatar: "/ChatPHI.png",
      verified: true
    },
    content: "Join our upcoming webinar on 'Navigating the Ethical Implications of Multiverse Travel' this Friday at 7 PM CET. We'll discuss the responsibilities of reality travelers and how to respect the integrity of each universe. Register now! #ethics #PHIresponsibility",
    image: "/ChatPHI.png",
    likes: 215,
    comments: 42,
    shares: 38,
    timestamp: "2 days ago",
    liked: false
  }
];

// Predefined post suggestions
const postSuggestions = [
  "Just discovered an incredible new reality where music creates visible colors in the air! The PHI experience never ceases to amaze me. #PHIexplorer #multiversemusic",
  "Working on mapping the quantum pathways between realities. PHI technology makes interdimensional research so much more accessible! #quantumresearch #PHI",
  "The sunset in Reality #73A is absolutely breathtaking - three suns setting in perfect harmony. PHI opens up so many beautiful worlds! #multiversetravel #PHIadventures",
  "Collaborating with my parallel self from another dimension on a joint project. PHI makes cross-reality teamwork possible! #parallelcollaboration #PHItech"
];

export default function MultiPhi() {
  const router = useRouter();
  const feedRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState(postsData);
  const [touchActive, setTouchActive] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  const { orientation, isSupported } = useDeviceOrientation();
  const { scrollSpeed, isScrollingEnabled, resetInitialTilt } = useContext(ScrollSettingsContext);

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
    if (!orientation || !feedRef.current || !isScrollingEnabled || touchActive) return;

    const { relativeBeta } = orientation;
    
    if (relativeBeta !== null) {
      const scrollSpeedFactor = scrollSpeed * 0.5;
      
      if (relativeBeta < -5) {
        setScrollDirection('down');
        feedRef.current.scrollBy({ 
          top: Math.abs(relativeBeta) * scrollSpeedFactor * 0.1, 
          behavior: 'smooth' 
        });
        setShowScrollIndicator(true);
      } else if (relativeBeta > 5) {
        setScrollDirection('up');
        feedRef.current.scrollBy({ 
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

  // Toggle like on a post
  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          } 
        : post
    ));
  };

  // Generate post idea (simplified without AI)
  const generatePostIdea = () => {
    const randomSuggestion = postSuggestions[Math.floor(Math.random() * postSuggestions.length)];
    setNewPostContent(randomSuggestion);
  };

  // Add a new post
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: posts.length + 1,
      user: currentUser,
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Just now",
      liked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPostForm(false);
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-blue-900/90 backdrop-blur-md shadow-sm">
        <div className="max-w-1200 mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src="/ChatPHI.png"
                  alt="PHI Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-200">Multi φ</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                <User size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-between mt-4 border-b border-blue-100 dark:border-blue-800">
            <button 
              onClick={() => setActiveTab('home')}
              className={`pb-2 px-3 ${
                activeTab === 'home' 
                  ? 'text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300' 
                  : 'text-blue-400 dark:text-blue-500'
              }`}
            >
              <Home size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('friends')}
              className={`pb-2 px-3 ${
                activeTab === 'friends' 
                  ? 'text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300' 
                  : 'text-blue-400 dark:text-blue-500'
              }`}
            >
              <Users size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('explore')}
              className={`pb-2 px-3 ${
                activeTab === 'explore' 
                  ? 'text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300' 
                  : 'text-blue-400 dark:text-blue-500'
              }`}
            >
              <Compass size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`pb-2 px-3 ${
                activeTab === 'saved' 
                  ? 'text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300' 
                  : 'text-blue-400 dark:text-blue-500'
              }`}
            >
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-1200 mx-auto p-4">
        {/* Scroll Indicators */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 left-0 right-0 flex justify-center z-20"
            >
              <div className={`flex items-center ${
                scrollDirection === 'up' 
                  ? 'bg-blue-600/80 text-white' 
                  : 'bg-blue-600/80 text-white'
              } px-3 py-1 rounded-full text-sm`}>
                {scrollDirection === 'up' ? 'Scrolling Up' : 'Scrolling Down'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Post Button */}
        <button 
          onClick={() => setShowNewPostForm(true)}
          className="w-full bg-white dark:bg-blue-800/50 rounded-xl p-3 shadow-sm mb-4 flex items-center"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image
              src={currentUser.avatar}
              alt={currentUser.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-left text-blue-400 dark:text-blue-500">
            What's on your mind, {currentUser.name.split(' ')[0]}?
          </div>
          <div className="flex space-x-2">
            <button className="text-red-500 dark:text-red-400">
              <Camera size={18} />
            </button>
            <button className="text-green-500 dark:text-green-400">
              <Video size={18} />
            </button>
            <button className="text-blue-500 dark:text-blue-400">
              <ImageIcon size={18} />
            </button>
          </div>
        </button>

        {/* Posts Feed */}
        <div 
          ref={feedRef}
          className="space-y-4 pb-20"
        >
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-blue-800/50 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={post.user.avatar}
                      alt={post.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-200">
                        {post.user.name}
                      </h3>
                      {post.user.verified && (
                        <span className="ml-1 bg-blue-500 text-white rounded-full p-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="flex text-xs text-blue-500 dark:text-blue-400">
                      <span>@{post.user.username}</span>
                      <span className="mx-1">•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                <button className="text-blue-500 dark:text-blue-400">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              {/* Post Content */}
              <div className="px-3 pb-3">
                <p className="text-blue-700 dark:text-blue-200 mb-3">
                  {post.content}
                </p>
                
                {post.image && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={post.image}
                      alt="Post image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                {/* Post Stats */}
                <div className="flex justify-between text-xs text-blue-500 dark:text-blue-400 mb-3">
                  <div>
                    {post.likes > 0 && (
                      <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {post.comments > 0 && (
                      <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
                    )}
                    {post.shares > 0 && (
                      <span>{post.shares} {post.shares === 1 ? 'share' : 'shares'}</span>
                    )}
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="flex justify-between border-t border-blue-100 dark:border-blue-700/50 pt-3">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center ${
                      post.liked ? 'text-blue-600 dark:text-blue-300' : 'text-blue-500 dark:text-blue-400'
                    }`}
                  >
                    <ThumbsUp size={18} className="mr-1" fill={post.liked ? 'currentColor' : 'none'} />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center text-blue-500 dark:text-blue-400">
                    <MessageCircle size={18} className="mr-1" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center text-blue-500 dark:text-blue-400">
                    <Share2 size={18} className="mr-1" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Scroll Status Indicator */}
          <div className="text-center py-4">
            {touchActive ? (
              <div className="text-blue-500 dark:text-blue-400 text-sm">
                Touch detected - scrolling paused
              </div>
            ) : isScrollingEnabled ? (
              <div className="text-blue-500 dark:text-blue-400 text-sm animate-pulse">
                Tilt to scroll
              </div>
            ) : (
              <div className="text-blue-500 dark:text-blue-400 text-sm">
                Tilt scrolling disabled - enable in sidebar
              </div>
            )}
          </div>
          
          {!isSupported && (
            <div className="bg-white dark:bg-blue-800/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg mb-2">
                <p className="text-sm">
                  Device orientation not supported. Manual scrolling is enabled.
                </p>
              </div>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                For the best experience, please use a device with orientation sensors.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPostForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-blue-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-blue-100 dark:border-blue-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                  Create Post
                </h3>
                <button 
                  onClick={() => setShowNewPostForm(false)}
                  className="text-blue-600 dark:text-blue-300"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddPost} className="p-4">
                <div className="flex items-center mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-200">
                      {currentUser.name}
                    </h4>
                    <div className="text-xs text-blue-500 dark:text-blue-400">
                      @{currentUser.username}
                    </div>
                  </div>
                </div>
                
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={5}
                  className="w-full bg-blue-50 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                {/* Post Idea Generator */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={generatePostIdea}
                    className="w-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 text-blue-600 dark:text-blue-300 py-2 rounded-lg transition-colors"
                  >
                    Get post idea
                  </button>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-blue-600 dark:text-blue-300">
                    Add to your post
                  </div>
                  <div className="flex space-x-3">
                    <button type="button" className="text-green-500 dark:text-green-400">
                      <ImageIcon size={20} />
                    </button>
                    <button type="button" className="text-blue-500 dark:text-blue-400">
                      <Users size={20} />
                    </button>
                    <button type="button" className="text-yellow-500 dark:text-yellow-400">
                      <Smile size={20} />
                    </button>
                    <button type="button" className="text-red-500 dark:text-red-400">
                      <MapPin size={20} />
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <Send size={18} className="mr-2" />
                  Post
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-blue-900/90 backdrop-blur-md shadow-lg border-t border-blue-100 dark:border-blue-800 py-2 px-4">
        <div className="max-w-1200 mx-auto flex justify-between">
          <button 
            onClick={() => router.push('/')}
            className="p-2 text-blue-600 dark:text-blue-300"
          >
            <Home size={24} />
          </button>
          <button className="p-2 text-blue-600 dark:text-blue-300">
            <Users size={24} />
          </button>
          <button 
            onClick={() => setShowNewPostForm(true)}
            className="p-2 bg-blue-600 text-white rounded-full -mt-6 shadow-lg"
          >
            <Plus size={24} />
          </button>
          <button className="p-2 text-blue-600 dark:text-blue-300">
            <Bell size={24} />
          </button>
          <button className="p-2 text-blue-600 dark:text-blue-300">
            <User size={24} />
          </button>
        </div>
      </div>
      
      {touchActive && (
        <div className="fixed bottom-20 left-0 right-0 text-center z-30">
          <div className="inline-block bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm">
            Touch detected - scrolling paused
          </div>
        </div>
      )}
    </main>
  );
}