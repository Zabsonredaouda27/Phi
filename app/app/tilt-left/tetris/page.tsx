'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Star
} from 'lucide-react';

// Define types for tetrominos
type TetrominoType = '0' | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
type TetrominoShape = (0 | TetrominoType)[][];

interface Tetromino {
  shape: TetrominoShape;
  color: string;
}

interface TetrominosDict {
  [key: string]: Tetromino;
}

// Tetris piece types
const TETROMINOS: TetrominosDict = {
  '0': { shape: [[0]], color: '0, 0, 0' },
  'I': {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0]
    ],
    color: '80, 227, 230'
  },
  'J': {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0]
    ],
    color: '36, 95, 223'
  },
  'L': {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L']
    ],
    color: '223, 173, 36'
  },
  'O': {
    shape: [
      ['O', 'O'],
      ['O', 'O']
    ],
    color: '223, 217, 36'
  },
  'S': {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0]
    ],
    color: '48, 211, 56'
  },
  'T': {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0]
    ],
    color: '132, 61, 198'
  },
  'Z': {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0]
    ],
    color: '227, 78, 78'
  }
};

// Define cell type for the grid
type Cell = [0 | TetrominoType, 'clear' | 'merged'];

// Define game state interface
interface GameState {
  grid: Cell[][];
  position: { x: number; y: number };
  tetromino: TetrominoShape;
  collided: boolean;
  score: number;
  rows: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
  nextPiece: TetrominoType;
  highScore: number;
}

// Initial game state
const initialState: GameState = {
  grid: Array.from({ length: 20 }, () => Array(10).fill([0, 'clear']) as Cell[]),
  position: { x: 0, y: 0 },
  tetromino: TETROMINOS['0'].shape,
  collided: false,
  score: 0,
  rows: 0,
  level: 0,
  gameOver: false,
  isPaused: false,
  nextPiece: 'I',
  highScore: 0
};

export default function TetrisGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [dropTime, setDropTime] = useState<number | undefined>(1000);
  const [isMuted, setIsMuted] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;
    
    if (dropTime === undefined) return;
    
    const gameLoop = setTimeout(() => {
      drop();
    }, dropTime);
    
    return () => {
      clearTimeout(gameLoop);
    };
  }, [gameState, dropTime]);

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('tetrisHighScore');
      if (savedHighScore) {
        setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }
  }, []);

  // Save high score to localStorage when game over
  useEffect(() => {
    if (gameState.gameOver && gameState.score > gameState.highScore) {
      setGameState(prev => ({ ...prev, highScore: prev.score }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('tetrisHighScore', gameState.score.toString());
      }
    }
  }, [gameState.gameOver, gameState.score, gameState.highScore]);

  // Random tetromino generator
  const randomTetromino = (): Tetromino => {
    const tetrominos = 'IJLOSTZ';
    const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)] as TetrominoType;
    return TETROMINOS[randTetromino];
  };

  // Start game
  const startGame = () => {
    // Reset everything
    const newTetromino = randomTetromino();
    const nextPiece = Object.keys(TETROMINOS).filter(key => key !== '0')[
      Math.floor(Math.random() * 7)
    ] as TetrominoType;
    
    setGameState({
      ...initialState,
      tetromino: newTetromino.shape,
      position: { x: 3, y: 0 },
      nextPiece: nextPiece,
      highScore: gameState.highScore
    });
    setDropTime(1000);
  };

  // Pause/resume game
  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    if (gameState.isPaused) {
      setDropTime(1000 / (gameState.level + 1));
    } else {
      setDropTime(undefined);
    }
  };

  // Move tetromino
  const movePlayer = (dir: number) => {
    if (gameState.gameOver || gameState.isPaused) return;
    
    // Check if move is valid
    const newPos = { ...gameState.position, x: gameState.position.x + dir };
    if (!checkCollision(gameState.grid, gameState.tetromino, newPos)) {
      setGameState(prev => ({
        ...prev,
        position: newPos
      }));
    }
  };

  // Drop tetromino
  const drop = () => {
    if (gameState.gameOver || gameState.isPaused) return;
    
    // Increase level when player has cleared 10 rows
    if (gameState.rows > (gameState.level + 1) * 10) {
      setGameState(prev => ({ ...prev, level: prev.level + 1 }));
      setDropTime(1000 / (gameState.level + 2));
    }
    
    const newPos = { ...gameState.position, y: gameState.position.y + 1 };
    if (!checkCollision(gameState.grid, gameState.tetromino, newPos)) {
      setGameState(prev => ({
        ...prev,
        position: newPos
      }));
    } else {
      // Game over if collision at the top
      if (gameState.position.y < 1) {
        setGameState(prev => ({ ...prev, gameOver: true }));
        setDropTime(undefined);
        return;
      }
      
      // Merge tetromino with stage
      updateStage();
    }
  };

  // Hard drop
  const hardDrop = () => {
    if (gameState.gameOver || gameState.isPaused) return;
    
    let newY = gameState.position.y;
    while (!checkCollision(gameState.grid, gameState.tetromino, { x: gameState.position.x, y: newY + 1 })) {
      newY += 1;
    }
    
    setGameState(prev => ({
      ...prev,
      position: { ...prev.position, y: newY },
      collided: true
    }));
  };

  // Rotate tetromino
  const rotate = () => {
    if (gameState.gameOver || gameState.isPaused) return;
    
    const rotatedTetromino = gameState.tetromino.map((_, index) =>
      gameState.tetromino.map(col => col[index])
    ).map(row => row.reverse()) as TetrominoShape;
    
    // Check if rotation is valid
    if (!checkCollision(gameState.grid, rotatedTetromino, gameState.position)) {
      setGameState(prev => ({
        ...prev,
        tetromino: rotatedTetromino
      }));
    }
  };

  // Check collision
  const checkCollision = (grid: Cell[][], tetromino: TetrominoShape, pos: { x: number, y: number }): boolean => {
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        // Check that we're on a tetromino cell
        if (tetromino[y][x] !== 0) {
          // Check boundaries
          if (
            // Below the bottom of the play area
            !grid[y + pos.y] ||
            // Off the left or right of the play area
            !grid[y + pos.y][x + pos.x] ||
            // Check if position is occupied
            grid[y + pos.y][x + pos.x][1] !== 'clear'
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Update stage
  const updateStage = () => {
    // First flush the stage
    const newStage = gameState.grid.map(row =>
      row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell) as Cell)
    );

    // Then draw the tetromino
    gameState.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newStage[y + gameState.position.y][x + gameState.position.x] = [
            value,
            `${gameState.collided ? 'merged' : 'clear'}`
          ] as Cell;
        }
      });
    });

    // Then check if we collided
    if (gameState.collided) {
      // Get new tetromino
      const newTetromino = randomTetromino();
      const nextPiece = Object.keys(TETROMINOS).filter(key => key !== '0')[
        Math.floor(Math.random() * 7)
      ] as TetrominoType;
      
      // Check for completed rows
      const [clearedRows, newGrid] = clearRows(newStage);
      
      // Update score
      const points = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 rows
      const newScore = gameState.score + (points[clearedRows as number] || 0) * (gameState.level + 1);
      
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        position: { x: 3, y: 0 },
        tetromino: newTetromino.shape,
        collided: false,
        score: newScore,
        rows: prev.rows + clearedRows,
        nextPiece: nextPiece
      }));
    }
  };

  // Clear completed rows
  const clearRows = (grid: Cell[][]): [number, Cell[][]] => {
    let clearedRows = 0;
    const newGrid = grid.reduce((acc: Cell[][], row) => {
      // If row has no empty cells (all filled)
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        clearedRows += 1;
        // Add empty row at the top
        acc.unshift(new Array(grid[0].length).fill([0, 'clear']) as Cell[]);
        return acc;
      }
      acc.push(row);
      return acc;
    }, []);
    
    return [clearedRows, newGrid];
  };

  // Handle keydown events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.gameOver) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        movePlayer(-1);
        break;
      case 'ArrowRight':
        movePlayer(1);
        break;
      case 'ArrowDown':
        drop();
        break;
      case 'ArrowUp':
        rotate();
        break;
      case ' ':
        hardDrop();
        break;
      case 'p':
        togglePause();
        break;
      default:
        break;
    }
  }, [gameState]);

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Render tetromino cell
  const renderCell = (type: 0 | TetrominoType, color: string) => {
    return (
      <div
        style={{
          width: 'auto',
          background: `rgba(${color})`,
          border: type === 0 ? '0px solid' : '4px solid',
          borderBottomColor: `rgba(${color}, 0.1)`,
          borderRightColor: `rgba(${color}, 1)`,
          borderTopColor: `rgba(${color}, 1)`,
          borderLeftColor: `rgba(${color}, 0.3)`
        }}
      />
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md shadow-sm p-4">
        <div className="max-w-1200 mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/tilt-left')}
              className="flex items-center justify-center p-2 rounded-full bg-blue-100 dark:bg-blue-800"
            >
              <ArrowLeft className="text-blue-600 dark:text-blue-300" size={20} />
            </button>
            <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-200">Tetris φ</h1>
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
            <div 
              ref={gameAreaRef}
              className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Game Status */}
              <div className="p-3 border-b border-blue-100 dark:border-blue-700/50 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Trophy size={16} className="text-yellow-500 mr-1" />
                    <span className="text-sm text-blue-700 dark:text-blue-200">
                      High Score: {gameState.highScore}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-blue-500 mr-1" />
                    <span className="text-sm text-blue-700 dark:text-blue-200">
                      Score: {gameState.score}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={togglePause}
                  className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300"
                  disabled={gameState.gameOver}
                >
                  {gameState.isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              </div>
              
              {/* Game Grid */}
              <div className="relative">
                {/* Game Over Overlay */}
                {gameState.gameOver && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Game Over</h2>
                    <p className="text-white mb-4">Score: {gameState.score}</p>
                    <button 
                      onClick={startGame}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center"
                    >
                      <RefreshCw size={18} className="mr-2" />
                      Play Again
                    </button>
                  </div>
                )}
                
                {/* Pause Overlay */}
                {gameState.isPaused && !gameState.gameOver && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
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
                
                {/* Game Grid */}
                <div className="grid grid-cols-10 gap-0 bg-gray-100 dark:bg-blue-900/30 p-1 aspect-[1/2]">
                  {Array.from({ length: 20 * 10 }).map((_, index) => {
                    const x = index % 10;
                    const y = Math.floor(index / 10);
                    
                    // Get cell type and color
                    let cellType: 0 | TetrominoType = 0;
                    let cellColor = '0, 0, 0';
                    
                    // Check if cell is part of active tetromino
                    if (
                      gameState.tetromino[y - gameState.position.y] &&
                      gameState.tetromino[y - gameState.position.y][x - gameState.position.x] !== 0 &&
                      y >= gameState.position.y &&
                      x >= gameState.position.x &&
                      x < gameState.position.x + gameState.tetromino[0].length &&
                      y < gameState.position.y + gameState.tetromino.length
                    ) {
                      const tetrominoType = gameState.tetromino[y - gameState.position.y][x - gameState.position.x];
                      cellType = tetrominoType as TetrominoType;
                      cellColor = TETROMINOS[cellType].color;
                    }
                    // Check if cell is part of merged tetrominos
                    else if (gameState.grid[y] && gameState.grid[y][x] && gameState.grid[y][x][0] !== 0) {
                      cellType = gameState.grid[y][x][0];
                      cellColor = TETROMINOS[cellType].color;
                    }
                    
                    return (
                      <div 
                        key={index}
                        className={`aspect-square ${cellType === 0 ? 'bg-gray-200 dark:bg-blue-800/20' : ''}`}
                      >
                        {cellType !== 0 && renderCell(cellType, cellColor)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Info and Controls */}
          <div className="md:w-64">
            <div className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">
                Next Piece
              </h2>
              <div className="bg-gray-100 dark:bg-blue-900/30 p-2 rounded-lg mb-4">
                <div className="grid grid-cols-4 gap-0 aspect-square">
                  {TETROMINOS[gameState.nextPiece].shape.map((row, y) => 
                    row.map((cell, x) => (
                      <div 
                        key={`${y}-${x}`}
                        className={`aspect-square ${cell === 0 ? 'bg-transparent' : ''}`}
                      >
                        {cell !== 0 && renderCell(
                          cell as TetrominoType, 
                          TETROMINOS[cell as TetrominoType].color
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-300">Level:</span>
                  <span className="font-medium text-blue-700 dark:text-blue-200">{gameState.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-300">Rows:</span>
                  <span className="font-medium text-blue-700 dark:text-blue-200">{gameState.rows}</span>
                </div>
              </div>
              
              {!gameState.gameOver && (
                <button 
                  onClick={startGame}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <RotateCcw size={18} className="mr-2" />
                  Restart
                </button>
              )}
              
              {gameState.gameOver && (
                <button 
                  onClick={startGame}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <Play size={18} className="mr-2" />
                  Start Game
                </button>
              )}
            </div>
            
            {/* Controls */}
            <div className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-3">
                Controls
              </h2>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="col-start-2">
                  <button 
                    onClick={rotate}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={gameState.gameOver || gameState.isPaused}
                  >
                    <ArrowUp size={24} />
                  </button>
                </div>
                <div className="col-start-1 col-end-2 row-start-2">
                  <button 
                    onClick={() => movePlayer(-1)}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={gameState.gameOver || gameState.isPaused}
                  >
                    <ArrowLeftIcon size={24} />
                  </button>
                </div>
                <div className="col-start-2 row-start-2">
                  <button 
                    onClick={drop}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={gameState.gameOver || gameState.isPaused}
                  >
                    <ArrowDown size={24} />
                  </button>
                </div>
                <div className="col-start-3 row-start-2">
                  <button 
                    onClick={() => movePlayer(1)}
                    className="w-full aspect-square bg-blue-100 dark:bg-blue-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300"
                    disabled={gameState.gameOver || gameState.isPaused}
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={hardDrop}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-2 flex items-center justify-center"
                disabled={gameState.gameOver || gameState.isPaused}
              >
                <ArrowDown size={18} className="mr-2" />
                Hard Drop
              </button>
              
              <div className="text-xs text-blue-500 dark:text-blue-400 space-y-1">
                <p>↑ or tap top: Rotate</p>
                <p>← → or tap sides: Move left/right</p>
                <p>↓ or tap bottom: Move down</p>
                <p>Space or Hard Drop: Drop to bottom</p>
                <p>P or Pause button: Pause game</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}