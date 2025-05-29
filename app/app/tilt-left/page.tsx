'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GamepadIcon, 
  Star, 
  Search, 
  ChevronRight, 
  Heart, 
  Clock, 
  Award, 
  Zap, 
  X
} from 'lucide-react';
import Link from 'next/link';

// Sample games data
const gamesData = [
  {
    id: 1,
    title: "Tetris φ",
    description: "The classic block-stacking game with a PHI twist. Arrange falling blocks to create complete lines.",
    image: "/ChatPHI.png",
    category: "Puzzle",
    difficulty: "Medium",
    playTime: "5-10 min",
    favorite: false,
    featured: true,
    route: "/tilt-left/tetris"
  },
  {
    id: 2,
    title: "Quantum Maze",
    description: "Navigate through a maze that changes based on quantum probability. No two games are the same!",
    image: "/ChatPHI.png",
    category: "Puzzle",
    difficulty: "Hard",
    playTime: "10-15 min",
    favorite: true,
    featured: false,
    route: "/tilt-left/quantum-maze"
  },
  {
    id: 3,
    title: "AI Tic-Tac-Toe",
    description: "Challenge an AI opponent in the classic game of Tic-Tac-Toe with adjustable difficulty levels.",
    image: "/ChatPHI.png",
    category: "Strategy",
    difficulty: "Variable",
    playTime: "2-5 min",
    favorite: false,
    featured: true,
    route: "/tilt-left/game/ai-opponent"
  }
];

export default function GamePhi() {
  const router = useRouter();
  const [games, setGames] = useState(gamesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, favorite: !game.favorite } : game
    ));
  };

  // Filter games based on search query and active filter
  const filteredGames = games.filter(game => {
    const matchesSearch = 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'favorites') {
      return matchesSearch && game.favorite;
    } else if (activeFilter === 'featured') {
      return matchesSearch && game.featured;
    } else {
      return matchesSearch;
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md shadow-sm p-4">
        <div className="max-w-1200 mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center p-2 rounded-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors">
              <GamepadIcon className="text-blue-600 dark:text-blue-300" size={20} />
            </Link>
            <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-200">Game φ</h1>
          </div>
        </div>
      </header>

      <div className="max-w-1200 mx-auto p-4">
        {/* Search and Filters */}
        <div className="mb-4">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300" size={18} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-blue-800/50 text-blue-600 dark:text-blue-300'
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
                activeFilter === 'favorites'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-blue-800/50 text-blue-600 dark:text-blue-300'
              }`}
            >
              <Heart size={16} className="mr-1" />
              Favorites
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center ${
                activeFilter === 'featured'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-blue-800/50 text-blue-600 dark:text-blue-300'
              }`}
            >
              <Award size={16} className="mr-1" />
              Featured
            </button>
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-4">
          {filteredGames.length === 0 ? (
            <div className="bg-white dark:bg-blue-800/50 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <GamepadIcon size={40} className="text-blue-400 dark:text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">
                No games found
              </h3>
              <p className="text-blue-600 dark:text-blue-300">
                Try adjusting your search or filters to find games.
              </p>
            </div>
          ) : (
            filteredGames.map(game => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-blue-800/50 rounded-xl shadow-sm overflow-hidden"
              >
                <Link href={game.route} className="block">
                  <div className="flex cursor-pointer">
                    <div className="relative w-24 h-24 bg-blue-100 dark:bg-blue-700/50 flex-shrink-0">
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-blue-700 dark:text-blue-200">
                            {game.title}
                          </h3>
                          <p className="text-xs text-blue-500 dark:text-blue-400 mb-1">
                            {game.category}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(game.id);
                          }}
                          className="text-blue-600 dark:text-blue-300"
                        >
                          <Heart 
                            size={18} 
                            fill={game.favorite ? 'currentColor' : 'none'} 
                            className={game.favorite ? 'text-red-500 dark:text-red-400' : ''}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-300 line-clamp-2 mb-2">
                        {game.description}
                      </p>
                      <div className="flex space-x-2 text-xs">
                        <span className="flex items-center text-blue-500 dark:text-blue-400">
                          <Zap size={12} className="mr-1" />
                          {game.difficulty}
                        </span>
                        <span className="flex items-center text-blue-500 dark:text-blue-400">
                          <Clock size={12} className="mr-1" />
                          {game.playTime}
                        </span>
                        {game.featured && (
                          <span className="flex items-center text-yellow-500 dark:text-yellow-400">
                            <Star size={12} className="mr-1" fill="currentColor" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center pr-3">
                      <ChevronRight className="text-blue-400 dark:text-blue-500" size={20} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}