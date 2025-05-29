'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  RotateCcw, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowRight, 
  RefreshCw,
  Trophy,
  Heart,
  Star,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Define maze cell types
type CellType = 'wall' | 'path' | 'player' | 'goal' | 'quantum';

// Define game state interface
interface GameState {
  maze: CellType[][];
  playerPosition: { x: number; y: number };
  goalPosition: { x: number; y: number };
  quantumPositions: { x: number; y: number }[];
  moves: number;
  gameWon: boolean;
  gameStarted: boolean;
  isPaused: boolean;
  timeElapsed: number;
  bestTime: number;
  bestMoves: number;
}

// Maze size
const MAZE_SIZE = 8;

// Generate a random maze
const generateMaze = (): CellType[][] => {
  const maze: CellType[][] = Array(MAZE_SIZE).fill(null).map(() => Array(MAZE_SIZE).fill('wall'));
  
  // Simple maze generation - create paths
  for (let y = 1; y < MAZE_SIZE - 1; y += 2) {
    for (let x = 1; x < MAZE_SIZE - 1; x += 2) {
      maze[y][x] = 'path';
      
      // Randomly create connections
      if (Math.random() > 0.3 && x < MAZE_SIZE - 2) {
        maze[y][x + 1] = 'path';
      }
      if (Math.random() > 0.3 && y < MAZE_SIZE - 2) {
        maze[y + 1][x] = 'path';
      }
    }
  }
  
  // Ensure start and end are accessible
  maze[1][1] = 'path'; // Start position
  maze[MAZE_SIZE - 2][MAZE_SIZE - 2] = 'path'; // Goal position
  
  // Add some quantum cells that change the maze
  const quantumCount = 3;
  for (let i = 0; i < quantumCount; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1;
      y = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1;
    } while (maze[y][x] !== 'path' || (x === 1 && y === 1) || (x === MAZE_SIZE - 2 && y === MAZE_SIZE - 2));
    
    maze[y][x] = 'quantum';
  }
  
  return maze;
};

// Initial game state factory function
const createInitialState = (bestTime: number = 0, bestMoves: number = 0): GameState => ({
  maze: generateMaze(),
  playerPosition: { x: 1, y: 1 },
  goalPosition: { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 },
  quantumPositions: [],
  moves: 0,
  gameWon: false,
  gameStarted: false,
  isPaused: false,
  timeElapsed: 0,
  bestTime,
  bestMoves
});

export default function QuantumMaze() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [isMuted, setIsMuted] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    
    // Load best scores from localStorage only on client side
    if (typeof window !== 'undefined') {
      const bestTime = parseInt(localStorage.getItem('quantumMazeBestTime') || '0');
      const bestMoves = parseInt(localStorage.getItem('quantumMazeBestMoves') || '0');
      
      setGameState(createInitialState(bestTime, bestMoves));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.gameStarted && !gameState.isPaused && !gameState.gameWon) {
      intervalRef.current = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.isPaused, gameState.gameWon]);

  // Save best scores
  useEffect(() => {
    if (gameState.gameWon && isClient && typeof window !== 'undefined') {
      const currentTime = gameState.timeElapsed;
      const currentMoves = gameState.moves;
      
      if (gameState.bestTime === 0 || currentTime < gameState.bestTime) {
        localStorage.setItem('quantumMazeBestTime', currentTime.toString());
        setGameState(prev => ({ ...prev, bestTime: currentTime }));
      }
      
      if (gameState.bestMoves === 0 || currentMoves < gameState.bestMoves) {
        localStorage.setItem('quantumMazeBestMoves', currentMoves.toString());
        setGameState(prev => ({ ...prev, bestMoves: currentMoves }));
      }
    }
  }, [gameState.gameWon, gameState.timeElapsed, gameState.moves, gameState.bestTime, gameState.bestMoves, isClient]);

  // Start game
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      maze: generateMaze(),
      playerPosition: { x: 1, y: 1 },
      goalPosition: { x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 },
      quantumPositions: [],
      moves: 0,
      gameWon: false,
      gameStarted: true,
      isPaused: false,
      timeElapsed: 0
    }));
  };

  // Pause/resume game
  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  // Reset game
  const resetGame = () => {
    const bestTime = isClient && typeof window !== 'undefined' 
      ? parseInt(localStorage.getItem('quantumMazeBestTime') || '0')
      : gameState.bestTime;
    const bestMoves = isClient && typeof window !== 'undefined'
      ? parseInt(localStorage.getItem('quantumMazeBestMoves') || '0')
      : gameState.bestMoves;
      
    setGameState(createInitialState(bestTime, bestMoves));
  };

  // Move player
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState.gameStarted || gameState.isPaused || gameState.gameWon) return;

    const { playerPosition, maze } = gameState;
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, newY - 1);
        break;
      case 'down':
        newY = Math.min(MAZE_SIZE - 1, newY + 1);
        break;
      case 'left':
        newX = Math.max(0, newX - 1);
        break;
      case 'right':
        newX = Math.min(MAZE_SIZE - 1, newX + 1);
        break;
    }

    // Check if the new position is valid (not a wall)
    if (maze[newY][newX] === 'wall') return;

    const newPosition = { x: newX, y: newY };
    let newMaze = [...maze.map(row => [...row])];
    let moves = gameState.moves + 1;

    // Check if player stepped on a quantum cell
    if (maze[newY][newX] === 'quantum') {
      // Quantum effect: regenerate part of the maze
      newMaze = generateMaze();
      // Ensure player and goal positions remain accessible
      newMaze[newPosition.y][newPosition.x] = 'path';
      newMaze[gameState.goalPosition.y][gameState.goalPosition.x] = 'path';
    }

    // Check if player reached the goal
    const gameWon = newX === gameState.goalPosition.x && newY === gameState.goalPosition.y;

    setGameState(prev => ({
      ...prev,
      maze: newMaze,
      playerPosition: newPosition,
      moves,
      gameWon
    }));
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
        case ' ':
          e.preventDefault();
          if (gameState.gameStarted) {
            togglePause();
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetGame();
          break;
      }
    };

    if (isClient) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameState, isClient]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get cell display
  const getCellDisplay = (cellType: CellType, x: number, y: number) => {
    const isPlayer = x === gameState.playerPosition.x && y === gameState.playerPosition.y;
    const isGoal = x === gameState.goalPosition.x && y === gameState.goalPosition.y;

    if (isPlayer) {
      return <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">P</div>;
    }
    
    if (isGoal) {
      return <Target className="w-full h-full text-green-500 p-1" />;
    }

    switch (cellType) {
      case 'wall':
        return <div className="w-full h-full bg-gray-800 dark:bg-gray-900" />;
      case 'path':
        return <div className="w-full h-full bg-blue-50 dark:bg-blue-900/30" />;
      case 'quantum':
        return (
          <div className="w-full h-full bg-purple-200 dark:bg-purple-800/50 flex items-center justify-center">
            <Zap className="text-purple-600 dark:text-purple-400" size={12} />
          </div>
        );
      default:
        return <div className="w-full h-full bg-blue-50 dark:bg-blue-900/30" />;
    }
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md shadow-sm p-4">
          <div className="max-w-1200 mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/tilt-left"
                className="flex items-center justify-center p-2 rounded-full bg-blue-100 dark:bg-blue-800"
              >
                <ArrowLeft className="text-blue-600 dark:text-blue-300" size={20} />
              </Link>
              <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-200">Quantum Maze</h1>
            </div>
          </div>
        </header>
        <div className="max-w-1200 mx-auto p-4 flex items-center justify-center min-h-[50vh]">
          <div className="text-blue-600 dark:text-blue-300">Loading game...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md shadow-sm p-4">
        <div className="max-w-1200 mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/tilt-left"
              className="flex items-center justify-center p-2 rounded-full bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="text-blue-600 dark:text-blue-300" size={20} />
            </Link>
            <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-200">Quantum Maze</h1>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
            >
              <Heart 
                size={20} 
                fill={isFavorite ? 'currentColor' : 'none'} 
                className={isFavorite ? 'text-red-500 dark:text-red-400' : ''}
              />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-1200 mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Game Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg overflow-hidden">
              {/* Game Status */}
              <div className="p-3 border-b border-blue-100 dark:border-blue-700/50 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Clock size={16} className="text-blue-500 mr-1" />
                    <span className="text-sm text-blue-700 dark:text-blue-200">
                      Time: {formatTime(gameState.timeElapsed)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-blue-500 mr-1" />
                    <span className="text-sm text-blue-700 dark:text-blue-200">
                      Moves: {gameState.moves}
                    </span>
                  </div>
                </div>
                
                {gameState.gameStarted && (
                  <button 
                    onClick={togglePause}
                    className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300"
                  >
                    {gameState.isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                )}
              </div>
              
              {/* Game Grid */}
              <div className="relative p-4">
                {/* Game Won Overlay */}
                {gameState.gameWon && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
                    <p className="text-white mb-2">Time: {formatTime(gameState.timeElapsed)}</p>
                    <p className="text-white mb-4">Moves: {gameState.moves}</p>
                    <button 
                      onClick={resetGame}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center"
                    >
                      <RefreshCw size={18} className="mr-2" />
                      Play Again
                    </button>
                  </div>
                )}
                
                {/* Pause Overlay */}
                {gameState.isPaused && !gameState.gameWon && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Paused</h2>
                    <button 
                      onClick={togglePause}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center"
                    >
                      <Play size={18} className="mr-2" />
                      Resume
                    </button>
                  </div>
                )}
                
                {/* Start Game Overlay */}
                {!gameState.gameStarted && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 rounded-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Quantum Maze</h2>
                    <p className="text-white mb-4 text-center">Navigate to the target while avoiding quantum cells that change the maze!</p>
                    <button 
                      onClick={startGame}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center"
                    >
                      <Play size={18} className="mr-2" />
                      Start Game
                    </button>
                  </div>
                )}
                
                {/* Maze Grid */}
                <div className="grid grid-cols-8 gap-1 aspect-square max-w-md mx-auto">
                  {gameState.maze.map((row, y) =>
                    row.map((cell, x) => (
                      <div 
                        key={`${x}-${y}`}
                        className="aspect-square border border-gray-300 dark:border-gray-600"
                      >
                        {getCellDisplay(cell, x, y)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Info and Controls */}
          <div className="md:w-64">
            <div className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">
                Best Scores
              </h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-300">Best Time:</span>
                  <span className="font-medium text-blue-700 dark:text-blue-200">
                    {gameState.bestTime > 0 ? formatTime(gameState.bestTime) : '--:--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-300">Best Moves:</span>
                  <span className="font-medium text-blue-700 dark:text-blue-200">
                    {gameState.bestMoves > 0 ? gameState.bestMoves : '--'}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={resetGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center"
              >
                <RotateCcw size={18} className="mr-2" />
                New Game
              </button>
            </div>
            
            {/* Controls */}
            <div className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">
                Controls
              </h2>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="col-start-2">
                  <button 
                    onClick={() => movePlayer('up')}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={!gameState.gameStarted || gameState.isPaused || gameState.gameWon}
                  >
                    <ArrowUp size={24} />
                  </button>
                </div>
                <div className="col-start-1 col-end-2 row-start-2">
                  <button 
                    onClick={() => movePlayer('left')}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={!gameState.gameStarted || gameState.isPaused || gameState.gameWon}
                  >
                    <ArrowLeftIcon size={24} />
                  </button>
                </div>
                <div className="col-start-2 row-start-2">
                  <button 
                    onClick={() => movePlayer('down')}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={!gameState.gameStarted || gameState.isPaused || gameState.gameWon}
                  >
                    <ArrowDown size={24} />
                  </button>
                </div>
                <div className="col-start-3 row-start-2">
                  <button 
                    onClick={() => movePlayer('right')}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={!gameState.gameStarted || gameState.isPaused || gameState.gameWon}
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-blue-500 dark:text-blue-400 space-y-1">
                <p>🎯 Reach the target to win</p>
                <p>⚡ Purple cells change the maze</p>
                <p>⌨️ Use arrow keys or WASD</p>
                <p>Space: Pause | R: Reset</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}