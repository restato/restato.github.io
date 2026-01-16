import { useState, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type Player = 'X' | 'O' | null;
type Board = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

export default function TicTacToe() {
  const { t } = useTranslation();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Check for winner
  const checkWinner = useCallback((currentBoard: Board): { winner: Player | 'draw' | null; line: number[] | null } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'draw', line: null };
    }
    return { winner: null, line: null };
  }, []);

  // Get available moves
  const getAvailableMoves = (currentBoard: Board): number[] => {
    return currentBoard.reduce<number[]>((acc, cell, idx) => {
      if (cell === null) acc.push(idx);
      return acc;
    }, []);
  };

  // Minimax algorithm for hard difficulty
  const minimax = useCallback((currentBoard: Board, depth: number, isMaximizing: boolean): number => {
    const { winner } = checkWinner(currentBoard);

    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'draw') return 0;

    const availableMoves = getAvailableMoves(currentBoard);

    if (isMaximizing) {
      let best = -Infinity;
      for (const move of availableMoves) {
        currentBoard[move] = 'O';
        best = Math.max(best, minimax(currentBoard, depth + 1, false));
        currentBoard[move] = null;
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of availableMoves) {
        currentBoard[move] = 'X';
        best = Math.min(best, minimax(currentBoard, depth + 1, true));
        currentBoard[move] = null;
      }
      return best;
    }
  }, [checkWinner]);

  // AI move
  const makeAIMove = useCallback((currentBoard: Board) => {
    const availableMoves = getAvailableMoves(currentBoard);
    if (availableMoves.length === 0) return;

    let move: number;

    if (difficulty === 'easy') {
      // Random move
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficulty === 'medium') {
      // 50% optimal, 50% random
      if (Math.random() < 0.5) {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      } else {
        // Find best move
        let bestScore = -Infinity;
        let bestMove = availableMoves[0];

        for (const m of availableMoves) {
          const testBoard = [...currentBoard];
          testBoard[m] = 'O';
          const score = minimax(testBoard, 0, false);
          if (score > bestScore) {
            bestScore = score;
            bestMove = m;
          }
        }
        move = bestMove;
      }
    } else {
      // Hard - always optimal
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];

      for (const m of availableMoves) {
        const testBoard = [...currentBoard];
        testBoard[m] = 'O';
        const score = minimax(testBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = m;
        }
      }
      move = bestMove;
    }

    const newBoard = [...currentBoard];
    newBoard[move] = 'O';
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      if (gameWinner === 'O') {
        setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
      } else if (gameWinner === 'draw') {
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setIsPlayerTurn(true);
    }
  }, [difficulty, minimax, checkWinner]);

  // Handle player click
  const handleClick = useCallback((index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      if (gameWinner === 'X') {
        setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else if (gameWinner === 'draw') {
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      setIsPlayerTurn(false);
      // AI move after short delay
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  }, [board, winner, isPlayerTurn, checkWinner, makeAIMove]);

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine(null);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md lg:max-w-lg mx-auto px-4">
      {/* Stats */}
      <div className="flex gap-4 mb-6 p-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.wins}</div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '승', en: 'Wins', ja: '勝' })}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-500">{stats.draws}</div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '무', en: 'Draws', ja: '引分' })}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{stats.losses}</div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '패', en: 'Losses', ja: '敗' })}
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex gap-2 mb-6">
        {(['easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => changeDifficulty(diff)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              difficulty === diff
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:bg-[var(--color-card-hover)]'
            }`}
          >
            {diff === 'easy' && t({ ko: '쉬움', en: 'Easy', ja: '簡単' })}
            {diff === 'medium' && t({ ko: '보통', en: 'Medium', ja: '普通' })}
            {diff === 'hard' && t({ ko: '어려움', en: 'Hard', ja: '難しい' })}
          </button>
        ))}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`w-24 h-24 md:w-28 md:h-28 text-5xl font-bold rounded-xl transition-all ${
              winningLine?.includes(index)
                ? 'bg-yellow-500/30 border-2 border-yellow-500'
                : 'bg-[var(--color-card)] border border-[var(--color-border)]'
            } ${
              !cell && !winner && isPlayerTurn
                ? 'hover:bg-[var(--color-card-hover)] cursor-pointer'
                : 'cursor-not-allowed'
            }`}
          >
            {cell === 'X' && <span className="text-blue-500">✕</span>}
            {cell === 'O' && <span className="text-red-500">○</span>}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        {winner ? (
          <div className="text-2xl font-bold">
            {winner === 'X' && (
              <span className="text-green-500">
                🎉 {t({ ko: '승리!', en: 'You Win!', ja: '勝利!' })}
              </span>
            )}
            {winner === 'O' && (
              <span className="text-red-500">
                😢 {t({ ko: '패배', en: 'You Lose', ja: '敗北' })}
              </span>
            )}
            {winner === 'draw' && (
              <span className="text-gray-500">
                🤝 {t({ ko: '무승부', en: 'Draw', ja: '引き分け' })}
              </span>
            )}
          </div>
        ) : (
          <div className="text-lg text-[var(--color-text-muted)]">
            {isPlayerTurn
              ? t({ ko: '당신의 차례입니다', en: 'Your turn', ja: 'あなたの番です' })
              : t({ ko: 'AI가 생각 중...', en: 'AI is thinking...', ja: 'AIが考え中...' })}
          </div>
        )}
      </div>

      {/* New Game Button */}
      <button
        onClick={resetGame}
        className="px-6 py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition-colors"
      >
        {t({ ko: '새 게임', en: 'New Game', ja: '新しいゲーム' })}
      </button>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-sm text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <span className="text-blue-500 text-xl">✕</span>
          {t({ ko: '당신', en: 'You', ja: 'あなた' })}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-500 text-xl">○</span>
          AI
        </span>
      </div>
    </div>
  );
}
