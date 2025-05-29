'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GamepadIcon, 
  X as XIcon, 
  Circle, 
  RefreshCw, 
  Trophy, 
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Define the board cell type
type Cell = 'X' | 'O' | null;
// Define the game status type
type GameStatus = 'playing' | 'won' | 'lost' | 'draw';
// Define the difficulty level
type Difficulty = 'easy' | 'medium' | 'hard';

export default function TicTacToeAI() {
  const router = useRouter();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const boardRef = useRef<HTMLDivElement>(null);

  // Check for win conditions
  const checkWinner = (boardState: Cell[]): Cell | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }

    return null;
  };

  // Check if the board is full
  const isBoardFull = (boardState: Cell[]): boolean => {
    return boardState.every(cell => cell !== null);
  };

  // Handle player move
  const handleCellClick = (index: number) => {
    if (board[index] || gameStatus !== 'playing' || !isPlayerTurn || isLoading) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner === 'X') {
      setGameStatus('won');
      setPlayerScore(prev => prev + 1);
      return;
    }
    
    if (isBoardFull(newBoard)) {
      setGameStatus('draw');
      return;
    }

    makeAIMove(newBoard);
  };

  // Make AI move
  const makeAIMove = async (currentBoard: Cell[]) => {
    setIsLoading(true);
    
    try {
      if (difficulty === 'easy') {
        await new Promise(resolve => setTimeout(resolve, 500));
        makeRandomMove(currentBoard);
      } else if (difficulty === 'medium') {
        await new Promise(resolve => setTimeout(resolve, 800));
        const randomFactor = Math.random();
        if (randomFactor < 0.4) {
          makeRandomMove(currentBoard);
        } else {
          makeSmartMove(currentBoard);
        }
      } else if (difficulty === 'hard') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        makeSmartMove(currentBoard);
      }
    } catch (err) {
      console.error('Error in AI move:', err);
      setError('An error occurred during the AI move. Please try again.');
      setIsPlayerTurn(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Make a random move
  const makeRandomMove = (currentBoard: Cell[]) => {
    const emptyCells = currentBoard
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);
    
    if (emptyCells.length === 0) return;
    
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    
    const winner = checkWinner(newBoard);
    if (winner === 'O') {
      setGameStatus('lost');
      setAiScore(prev => prev + 1);
    } else if (isBoardFull(newBoard)) {
      setGameStatus('draw');
    } else {
      setIsPlayerTurn(true);
    }
  };

  // Make a smart move (minimax algorithm simplified)
  const makeSmartMove = (currentBoard: Cell[]) => {
    // Check if AI can win in one move
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') {
          const newBoard = [...currentBoard];
          newBoard[i] = 'O';
          setBoard(newBoard);
          setGameStatus('lost');
          setAiScore(prev => prev + 1);
          return;
        }
      }
    }
    
    // Check if player can win in one move and block
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'X';
        if (checkWinner(testBoard) === 'X') {
          const newBoard = [...currentBoard];
          newBoard[i] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
          return;
        }
      }
    }
    
    // Take center if available
    if (currentBoard[4] === null) {
      const newBoard = [...currentBoard];
      newBoard[4] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);
      return;
    }
    
    // Take a corner if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => currentBoard[i] === null);
    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      const newBoard = [...currentBoard];
      newBoard[randomCorner] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);
      return;
    }
    
    makeRandomMove(currentBoard);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setError('');
  };

  // Get status message
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'won':
        return 'You won! 🎉';
      case 'lost':
        return 'AI won! 🤖';
      case 'draw':
        return 'It\'s a draw! 🤝';
      default:
        return isPlayerTurn ? 'Your turn' : 'AI thinking...';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4">
      <div className="max-w-1200 mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <GamepadIcon className="text-blue-600 dark:text-blue-300 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-200">Tic-Tac-Toe</h1>
          </div>
          <Link 
            href="/tilt-left"
            className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
          >
            Back to Games
          </Link>
        </motion.div>

        {error && (
          <div className="flex items-center bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game Board */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center mr-2">
                  <XIcon className="text-blue-600 dark:text-blue-300" size={16} />
                </div>
                <span className="text-blue-700 dark:text-blue-200 font-semibold">You: {playerScore}</span>
              </div>
              
              <div className="text-blue-600 dark:text-blue-300 font-medium">
                {getStatusMessage()}
              </div>
              
              <div className="flex items-center">
                <span className="text-blue-700 dark:text-blue-200 font-semibold">AI: {aiScore}</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center ml-2">
                  <Circle className="text-blue-600 dark:text-blue-300" size={16} />
                </div>
              </div>
            </div>
            
            {/* Game Grid */}
            <div 
              ref={boardRef}
              className="grid grid-cols-3 gap-3 mb-4 aspect-square"
            >
              {board.map((cell, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: cell === null && isPlayerTurn ? 1.05 : 1 }}
                  whileTap={{ scale: cell === null && isPlayerTurn ? 0.95 : 1 }}
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null || !isPlayerTurn || gameStatus !== 'playing' || isLoading}
                  className={`aspect-square rounded-lg flex items-center justify-center text-4xl font-bold ${
                    cell === null && isPlayerTurn
                      ? 'bg-blue-100 dark:bg-blue-700/50 hover:bg-blue-200 dark:hover:bg-blue-700 cursor-pointer'
                      : 'bg-blue-50 dark:bg-blue-800/30'
                  }`}
                >
                  {cell === 'X' && <XIcon size={48} className="text-blue-600 dark:text-blue-300" />}
                  {cell === 'O' && <Circle size={48} className="text-red-500 dark:text-red-400" />}
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={resetGame}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <RefreshCw size={18} className="mr-2" />
                New Game
              </button>
              
              <div className="flex items-center">
                <span className="text-blue-700 dark:text-blue-200 mr-2">Difficulty:</span>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Game Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-blue-800/50 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4 flex items-center">
              <Trophy className="mr-2" size={20} />
              Game Information
            </h2>
            
            <div className="mb-6">
              <h3 className="text-blue-600 dark:text-blue-300 font-medium mb-2">How to Play</h3>
              <p className="text-blue-700 dark:text-blue-200 text-sm mb-2">
                Click on any empty cell to place your X. The goal is to get three of your marks in a row (horizontally, vertically, or diagonally).
              </p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                You're playing against an AI opponent. The difficulty level determines how smart the AI plays.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-blue-600 dark:text-blue-300 font-medium mb-2">Difficulty Levels</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full mr-2 mt-0.5">Easy</span>
                  <p className="text-blue-700 dark:text-blue-200 text-sm">
                    The AI makes random moves. Perfect for beginners or casual play.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs px-2 py-0.5 rounded-full mr-2 mt-0.5">Medium</span>
                  <p className="text-blue-700 dark:text-blue-200 text-sm">
                    The AI plays more strategically but still makes occasional mistakes.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full mr-2 mt-0.5">Hard</span>
                  <p className="text-blue-700 dark:text-blue-200 text-sm">
                    The AI uses advanced strategy to make optimal moves. Very challenging!
                  </p>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-blue-600 dark:text-blue-300 font-medium mb-2">Game Features</h3>
              <p className="text-blue-700 dark:text-blue-200 text-sm mb-2">
                This simplified version of Tic-Tac-Toe provides a challenging AI opponent without requiring external services.
              </p>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                The AI uses strategic algorithms to provide an engaging gaming experience at different difficulty levels.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}