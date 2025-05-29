'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Send
} from 'lucide-react';

// Sample post data with different colors
const samplePosts = [
  { 
    id: 1, 
    username: 'user1', 
    content: 'Exploring the multiverse today! #PHI #exploration', 
    likes: 42, 
    comments: 7,
    color: 'bg-blue-800 text-white',
    timestamp: '2 hours ago'
  },
  { 
    id: 2, 
    username: 'cosmic_traveler', 
    content: 'Just discovered an amazing parallel universe! The physics here are mind-bending. #multiverse #discovery', 
    likes: 128, 
    comments: 24,
    color: 'bg-yellow-500 text-black',
    timestamp: '4 hours ago'
  },
  { 
    id: 3, 
    username: 'quantum_jumper', 
    content: 'Quantum leaping between realities has never been so fun! Who else is enjoying the new PHI update?', 
    likes: 76, 
    comments: 15,
    color: 'bg-red-600 text-white',
    timestamp: '5 hours ago'
  },
  { 
    id: 4, 
    username: 'reality_shifter', 
    content: 'The boundaries between universes are thinner than we thought. My research is finally paying off!', 
    likes: 93, 
    comments: 31,
    color: 'bg-black text-white',
    timestamp: '6 hours ago'
  },
  { 
    id: 5, 
    username: 'phi_enthusiast', 
    content: 'PHI has changed how I view multiple realities. Anyone want to join my exploration group?', 
    likes: 54, 
    comments: 12,
    color: 'bg-blue-400 text-white',
    timestamp: '8 hours ago'
  },
  { 
    id: 6, 
    username: 'dimension_hopper', 
    content: 'Just visited universe #42 - they have talking plants and the sky is purple! #strangeworlds', 
    likes: 112, 
    comments: 28,
    color: 'bg-purple-600 text-white',
    timestamp: '10 hours ago'
  },
  { 
    id: 7, 
    username: 'parallel_self', 
    content: 'Met my parallel self today. Turns out I\'m a rock star in that universe! #parallellife', 
    likes: 87, 
    comments: 19,
    color: 'bg-green-500 text-white',
    timestamp: '12 hours ago'
  },
  { 
    id: 8, 
    username: 'universe_collector', 
    content: 'Added three new universes to my collection today. The diversity is astounding!', 
    likes: 65, 
    comments: 14,
    color: 'bg-indigo-600 text-white',
    timestamp: '14 hours ago'
  },
  { 
    id: 9, 
    username: 'reality_architect', 
    content: 'Working on designing a new universe from scratch. Any suggestions for the laws of physics?', 
    likes: 103, 
    comments: 42,
    color: 'bg-pink-500 text-white',
    timestamp: '16 hours ago'
  },
  { 
    id: 10, 
    username: 'multiverse_explorer', 
    content: 'The multiverse is infinite, but PHI makes it feel like home. #gratitude', 
    likes: 74, 
    comments: 8,
    color: 'bg-orange-500 text-white',
    timestamp: '18 hours ago'
  },
  { 
    id: 11, 
    username: 'quantum_observer', 
    content: 'Remember: observing a universe changes it. Be mindful of your impact! #multiverseethics', 
    likes: 91, 
    comments: 23,
    color: 'bg-teal-500 text-white',
    timestamp: '20 hours ago'
  },
  { 
    id: 12, 
    username: 'reality_surfer', 
    content: 'Surfing the waves between realities. The cosmic ocean is particularly calm today.', 
    likes: 68, 
    comments: 17,
    color: 'bg-cyan-600 text-white',
    timestamp: '22 hours ago'
  },
];

// Sample comments
const generateComments = (postId: number) => {
  const commentCount = Math.floor(Math.random() * 10) + 5; // 5-15 comments
  return Array.from({ length: commentCount }).map((_, index) => ({
    id: index + 1,
    username: ['quantum_fan', 'universe_hopper', 'phi_lover', 'reality_bender', 'cosmic_wanderer'][
      Math.floor(Math.random() * 5)
    ],
    content: [
      'This is amazing! I had a similar experience in universe #37.',
      'Have you tried the new PHI update? It makes multiverse travel so much smoother.',
      'I completely agree with your perspective on this!',
      'The multiverse theory has changed my life. PHI makes it accessible to everyone.',
      'Can you share more details about this? I am fascinated!',
      'This reminds me of my journey through the quantum realm last week.',
      'PHI has revolutionized how we perceive reality. Great post!',
      'I would love to connect and share multiverse experiences sometime.',
      'The colors in that universe must be breathtaking!',
      'How long did it take you to adapt to the physics there?'
    ][Math.floor(Math.random() * 10)],
    timestamp: `${Math.floor(Math.random() * 59) + 1}m ago`,
    likes: Math.floor(Math.random() * 50)
  }));
};

// Sample related posts (checkerboard pattern with blue and yellow)
const generateRelatedPosts = () => {
  return samplePosts
    .filter((_, index) => index % 3 === 0) // Take every third post for variety
    .map((post, index) => ({
      ...post,
      id: 100 + index, // New IDs to avoid conflicts
      color: index % 2 === 0 ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-black' // Alternating colors
    }));
};

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const postId = parseInt(params.id);
  const post = samplePosts.find(p => p.id === postId) || samplePosts[0];
  
  const [comments, setComments] = useState(generateComments(postId));
  const [relatedPosts, setRelatedPosts] = useState(generateRelatedPosts());
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isCommentsScrolling, setIsCommentsScrolling] = useState(true);
  const [isRelatedScrolling, setIsRelatedScrolling] = useState(true);
  const [touchActive, setTouchActive] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const commentsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  // Handle like/dislike
  const handleLike = () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);
  };

  const handleDislike = () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);
  };

  // Handle touch events to control scrolling
  const handleTouchStart = () => {
    setTouchActive(true);
  };

  const handleTouchEnd = () => {
    setTouchActive(false);
  };

  // Auto-scroll comments
  useEffect(() => {
    if (!isCommentsScrolling || touchActive || !commentsRef.current) return;

    const interval = setInterval(() => {
      if (commentsRef.current) {
        commentsRef.current.scrollBy({ top: 1, behavior: 'smooth' });
        
        // Reset scroll position when reached bottom
        const { scrollTop, scrollHeight, clientHeight } = commentsRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          commentsRef.current.scrollTop = 0;
        }
      }
    }, 50); // Slow continuous scroll

    return () => clearInterval(interval);
  }, [isCommentsScrolling, touchActive]);

  // Auto-scroll related posts
  useEffect(() => {
    if (!isRelatedScrolling || touchActive || !relatedRef.current) return;

    const interval = setInterval(() => {
      if (relatedRef.current) {
        // Scroll horizontally for related posts
        relatedRef.current.scrollBy({ left: 1, behavior: 'smooth' });
        
        // Reset scroll position when reached end
        const { scrollLeft, scrollWidth, clientWidth } = relatedRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          relatedRef.current.scrollLeft = 0;
        }
      }
    }, 50); // Slow continuous scroll

    return () => clearInterval(interval);
  }, [isRelatedScrolling, touchActive]);

  // Add a new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: comments.length + 1,
      username: 'you',
      content: newComment,
      timestamp: 'just now',
      likes: 0
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Red top section with post details */}
      <section className={`bg-red-600 text-white p-4 pb-6`}>
        <div className="max-w-1200 mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center mb-4"
          >
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center p-2 rounded-full bg-white/20"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="ml-4 text-xl font-bold">Post Details</h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-red-700/50 rounded-xl p-4 mb-4"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold">@{post.username}</h2>
                <p className="text-xs opacity-80">{post.timestamp}</p>
              </div>
            </div>
            
            <p className="mb-4">{post.content}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${isLiked ? 'text-pink-300' : ''}`}
                >
                  <Heart size={20} fill={isLiked ? "#f9a8d4" : "none"} />
                  <span>{isLiked ? post.likes + 1 : post.likes}</span>
                </button>
                <button 
                  onClick={handleDislike}
                  className={`flex items-center space-x-1 ${isDisliked ? 'text-gray-400' : ''}`}
                >
                  <ThumbsDown size={20} fill={isDisliked ? "#9ca3af" : "none"} />
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1">
                  <MessageSquare size={20} />
                  <span>{post.comments}</span>
                </button>
                <button>
                  <Share2 size={20} />
                </button>
                <button>
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* White section with comments */}
      <section className="bg-white dark:bg-blue-900 p-4">
        <div className="max-w-1200 mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                Comments ({comments.length})
              </h3>
              <button 
                onClick={() => setIsCommentsScrolling(!isCommentsScrolling)}
                className="text-sm text-blue-600 dark:text-blue-300"
              >
                {isCommentsScrolling ? 'Pause Scroll' : 'Auto Scroll'}
              </button>
            </div>
            
            {/* Comment input */}
            <form onSubmit={handleAddComment} className="mb-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
            
            {/* Comments list with auto-scroll */}
            <div 
              ref={commentsRef}
              className="h-60 overflow-y-auto bg-gray-50 dark:bg-blue-800/30 rounded-xl p-3 mb-6"
            >
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-blue-800/50 rounded-lg p-3 mb-3 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-blue-700 dark:text-blue-200">
                      @{comment.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm mb-2">
                    {comment.content}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-300">
                      <Heart size={14} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {touchActive && (
                <div className="text-center text-sm text-blue-600 dark:text-blue-300 mt-2">
                  Touch detected - scrolling paused
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blue and yellow checkerboard section with related posts */}
      <section className="bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 p-4">
        <div className="max-w-1200 mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                More from Multivers φ
              </h3>
              <button 
                onClick={() => setIsRelatedScrolling(!isRelatedScrolling)}
                className="text-sm text-blue-600 dark:text-blue-300"
              >
                {isRelatedScrolling ? 'Pause Scroll' : 'Auto Scroll'}
              </button>
            </div>
            
            {/* Horizontal scrolling related posts in checkerboard pattern */}
            <div 
              ref={relatedRef}
              className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide"
            >
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`${relatedPost.color} rounded-xl shadow-lg flex-shrink-0 w-60 h-40 cursor-pointer`}
                  onClick={() => router.push(`/tilt-right/post/${relatedPost.id % 12 + 1}`)}
                >
                  <div className="p-3 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm">@{relatedPost.username}</h4>
                        <span className="text-xs opacity-70">{relatedPost.timestamp}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{relatedPost.content}</p>
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>❤️ {relatedPost.likes}</span>
                      <span>💬 {relatedPost.comments}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {touchActive && (
                <div className="flex items-center justify-center min-w-40 text-center text-sm text-blue-600 dark:text-blue-300">
                  Touch detected - scrolling paused
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}