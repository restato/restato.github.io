import { useState, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type CellState = 'hidden' | 'revealed' | 'flagged';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Cell {
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
}

interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
  label: { ko: string; en: string; ja: string };
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 8, cols: 8, mines: 10, label: { ko: '쉬움 (8x8)', en: 'Easy (8x8)', ja: '簡単 (8x8)' } },
  medium: { rows: 12, cols: 12, mines: 30, label: { ko: '보통 (12x12)', en: 'Medium (12x12)', ja: '普通 (12x12)' } },
  hard: { rows: 16, cols: 16, mines: 50, label: { ko: '어려움 (16x16)', en: 'Hard (16x16)', ja: '難しい (16x16)' } },
};

export default function Minesweeper() {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [flagMode, setFlagMode] = useState(false);

  const config = DIFFICULTIES[difficulty];

  const createEmptyBoard = useCallback((): Cell[][] => (
    Array(config.rows)
      .fill(null)
      .map(() =>
        Array(config.cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            state: 'hidden' as CellState,
            adjacentMines: 0,
          }))
      )
  ), [config]);

  // Initialize board
  const initBoard = useCallback((excludeRow?: number, excludeCol?: number, pregameBoard?: Cell[][]) => {
    const { rows, cols, mines } = config;

    const newBoard = createEmptyBoard();

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);

      // Don't place mine on first click or adjacent cells
      if (
        !newBoard[row][col].isMine &&
        !(excludeRow !== undefined && Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol!) <= 1)
      ) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newBoard[ni][nj].isMine) {
                count++;
              }
            }
          }
          newBoard[i][j].adjacentMines = count;
        }
      }
    }

    pregameBoard?.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.state === 'flagged') {
          newBoard[rowIndex][colIndex].state = 'flagged';
        }
      });
    });

    return newBoard;
  }, [config, createEmptyBoard]);

  // Reveal cell
  const revealCell = useCallback((board: Cell[][], row: number, col: number): Cell[][] => {
    const { rows, cols } = config;
    const newBoard = board.map(r => r.map(c => ({ ...c })));

    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      if (newBoard[r][c].state !== 'hidden') return;

      newBoard[r][c].state = 'revealed';

      if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            reveal(r + di, c + dj);
          }
        }
      }
    };

    reveal(row, col);
    return newBoard;
  }, [config]);

  // Check win condition
  const checkWin = useCallback((board: Cell[][]): boolean => {
    return board.every(row =>
      row.every(cell => cell.isMine || cell.state === 'revealed')
    );
  }, []);

  // Handle cell click
  const handleClick = (row: number, col: number) => {
    if (gameOver || won) return;

    let currentBoard = board;

    if (flagMode) {
      if (!currentBoard.length) currentBoard = createEmptyBoard();
      if (currentBoard[row][col].state === 'revealed') return;

      const newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
      const cell = newBoard[row][col];
      if (cell.state === 'hidden') {
        cell.state = 'flagged';
        setFlagCount(prev => prev + 1);
      } else {
        cell.state = 'hidden';
        setFlagCount(prev => prev - 1);
      }
      setBoard(newBoard);
      return;
    }

    if (board[row]?.[col]?.state === 'flagged' || (started && board[row]?.[col]?.state !== 'hidden')) return;

    // First click - initialize board
    if (!started) {
      currentBoard = initBoard(row, col, board);
      setStarted(true);
    }

    const cell = currentBoard[row][col];

    if (cell.isMine) {
      // Game over - reveal all mines
      const newBoard = currentBoard.map(r =>
        r.map(c => ({
          ...c,
          state: c.isMine ? 'revealed' as CellState : c.state,
        }))
      );
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const newBoard = revealCell(currentBoard, row, col);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setWon(true);
    }
  };

  // Handle right click (flag)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || won) return;

    const currentBoard = board.length ? board : createEmptyBoard();
    if (currentBoard[row][col].state === 'revealed') return;

    const newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
    const cell = newBoard[row][col];

    if (cell.state === 'hidden') {
      cell.state = 'flagged';
      setFlagCount(prev => prev + 1);
    } else if (cell.state === 'flagged') {
      cell.state = 'hidden';
      setFlagCount(prev => prev - 1);
    }

    setBoard(newBoard);
  };

  // Reset game
  const resetGame = () => {
    setBoard([]);
    setGameOver(false);
    setWon(false);
    setStarted(false);
    setFlagCount(0);
    setFlagMode(false);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  // Get cell display
  const getCellContent = (cell: Cell) => {
    if (cell.state === 'flagged') return '🚩';
    if (cell.state === 'hidden') return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines === 0) return '';
    return cell.adjacentMines;
  };

  const getCellColor = (count: number) => {
    const colors = ['', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-yellow-600', 'text-cyan-500', 'text-gray-700', 'text-gray-500'];
    return colors[count] || '';
  };

  const getCellLabel = (cell: Cell, row: number, col: number) => {
    const position = t({
      ko: `${row + 1}행 ${col + 1}열`,
      en: `Row ${row + 1}, column ${col + 1}`,
      ja: `${row + 1}行 ${col + 1}列`,
    });
    if (cell.state === 'flagged') {
      return `${position} ${t({ ko: '깃발', en: 'flagged', ja: '旗' })}`;
    }
    if (cell.state === 'hidden') {
      return `${position} ${t({ ko: '숨김', en: 'hidden', ja: '非表示' })}`;
    }
    if (cell.isMine) {
      return `${position} ${t({ ko: '지뢰', en: 'mine', ja: '地雷' })}`;
    }
    return `${position} ${cell.adjacentMines}`;
  };

  const displayBoard = board.length ? board : createEmptyBoard();

  return (
    <div className="fc-game mx-auto flex w-full max-w-lg flex-col items-center px-0 lg:max-w-2xl">
      {/* Difficulty */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {(Object.entries(DIFFICULTIES) as [Difficulty, DifficultyConfig][]).map(([diff, cfg]) => (
          <button
            type="button"
            key={diff}
            onClick={() => changeDifficulty(diff)}
            aria-pressed={difficulty === diff}
            className={`fc-button text-sm ${
              difficulty === diff
                ? 'fc-button-primary'
                : 'fc-button-secondary'
            }`}
          >
            {t(cfg.label)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="fc-surface mb-4 flex gap-4 p-3">
        <div className="text-center">
          <div className="text-xl font-bold">💣</div>
          <div className="text-sm">{config.mines - flagCount}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">🚩</div>
          <div className="text-sm">{flagCount}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFlagMode(current => !current)}
        aria-pressed={flagMode}
        aria-label={t({ ko: '깃발 모드', en: 'Flag mode', ja: '旗モード' })}
        className="fc-button fc-button-secondary mb-4"
      >
        {t({ ko: '🚩 깃발 모드', en: '🚩 Flag mode', ja: '🚩 旗モード' })}
      </button>

      {/* Board */}
      <div className="w-full max-w-full overflow-x-auto pb-2">
        <div
          className="grid w-max gap-0.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-2"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          }}
        >
        {displayBoard.map((row, i) =>
          row.map((cell: Cell, j: number) => (
            <button
              type="button"
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              onContextMenu={(e) => handleRightClick(e, i, j)}
              disabled={gameOver || won}
              aria-label={getCellLabel(cell, i, j)}
              className={`fc-game-cell flex h-6 w-6 items-center justify-center text-xs font-bold md:h-7 md:w-7 md:text-sm ${
                cell.state === 'revealed'
                  ? cell.isMine
                    ? 'bg-red-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                  : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
              } ${getCellColor(cell.adjacentMines)}`}
            >
              {getCellContent(cell)}
            </button>
          ))
        )}
        </div>
      </div>

      {/* Game Status */}
      {(gameOver || won) && (
        <div
          className={`fc-surface fc-surface-soft mt-4 p-4 text-center ${won ? 'border-green-500' : 'border-red-500'}`}
          role="status"
          aria-live="polite"
        >
          <div className="text-2xl font-bold">
            {won
              ? t({ ko: '🎉 승리!', en: '🎉 You Win!', ja: '🎉 勝利!' })
              : t({ ko: '💥 게임 오버', en: '💥 Game Over', ja: '💥 ゲームオーバー' })}
          </div>
        </div>
      )}

      {/* New Game Button */}
      <button
        type="button"
        onClick={resetGame}
        className="fc-button fc-button-primary mt-4"
      >
        {t({ ko: '새 게임', en: 'New Game', ja: '新しいゲーム' })}
      </button>

      {/* Instructions */}
      <div className="mt-4 text-sm text-[var(--color-text-muted)] text-center">
        <p>{t({
          ko: '클릭: 셀 열기 | 깃발 모드 또는 우클릭: 깃발 표시',
          en: 'Click: Reveal | Flag mode or right-click: Flag',
          ja: 'クリック: 開く | 旗モードまたは右クリック: 旗',
        })}</p>
      </div>
    </div>
  );
}
