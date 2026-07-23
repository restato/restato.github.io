import { useState, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const BINGO_SIZE = 5;
const MAX_NUMBER = 75;

export default function BingoGame() {
  const { t } = useTranslation();
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Generate bingo card
  const generateCard = useCallback((): number[][] => {
    const card: number[][] = [];
    const usedNumbers = new Set<number>();

    for (let col = 0; col < BINGO_SIZE; col++) {
      const colNumbers: number[] = [];
      const min = col * 15 + 1;
      const max = col * 15 + 15;

      while (colNumbers.length < BINGO_SIZE) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!usedNumbers.has(num)) {
          usedNumbers.add(num);
          colNumbers.push(num);
        }
      }
      card.push(colNumbers);
    }

    // Transpose to get rows
    const rows: number[][] = [];
    for (let i = 0; i < BINGO_SIZE; i++) {
      rows.push(card.map(col => col[i]));
    }

    return rows;
  }, []);

  const [bingoCard, setBingoCard] = useState<number[][]>(() => generateCard());

  // Draw a number
  const drawNumber = useCallback(() => {
    if (drawnNumbers.length >= MAX_NUMBER || isAnimating) return;

    setIsAnimating(true);

    // Animation - show random numbers quickly
    let animationCount = 0;
    const animationInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * MAX_NUMBER) + 1;
      setCurrentNumber(randomNum);
      animationCount++;

      if (animationCount >= 15) {
        clearInterval(animationInterval);

        // Draw actual number
        const available = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1).filter(
          n => !drawnNumbers.includes(n)
        );
        const newNumber = available[Math.floor(Math.random() * available.length)];

        setCurrentNumber(newNumber);
        setDrawnNumbers(prev => [...prev, newNumber]);
        setIsAnimating(false);
      }
    }, 50);
  }, [drawnNumbers, isAnimating]);

  // Auto play
  useCallback(() => {
    if (autoPlay && !isAnimating && drawnNumbers.length < MAX_NUMBER) {
      const timer = setTimeout(drawNumber, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isAnimating, drawnNumbers.length, drawNumber]);

  // Reset game
  const resetGame = () => {
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setBingoCard(generateCard());
    setAutoPlay(false);
  };

  // Get letter for column
  const getBingoLetter = (index: number): string => {
    return 'BINGO'[index];
  };

  // Check if number is drawn
  const isDrawn = (num: number): boolean => drawnNumbers.includes(num);

  // Check for bingo
  const checkBingo = (): boolean => {
    // Check rows
    for (const row of bingoCard) {
      if (row.every(num => isDrawn(num))) return true;
    }

    // Check columns
    for (let col = 0; col < BINGO_SIZE; col++) {
      if (bingoCard.every(row => isDrawn(row[col]))) return true;
    }

    // Check diagonals
    if (bingoCard.every((row, i) => isDrawn(row[i]))) return true;
    if (bingoCard.every((row, i) => isDrawn(row[BINGO_SIZE - 1 - i]))) return true;

    return false;
  };

  const hasBingo = checkBingo();

  return (
    <div className="fc-game mx-auto flex w-full max-w-5xl flex-col gap-6 px-0 lg:flex-row">
      {/* Left - Drawing Area */}
      <div className="flex-1 flex flex-col items-center">
        {/* Current Number Display */}
        <div data-contrast-target="bingo-current" className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-6 ${
          isAnimating ? 'animate-pulse' : ''
        } border border-[var(--brand)] bg-[var(--surface-soft)] text-[var(--brand)]`}>
          <div className="text-center">
            {currentNumber && (
              <>
                <div className="text-lg font-bold">
                  {getBingoLetter(Math.floor((currentNumber - 1) / 15))}
                </div>
                <div className="text-5xl md:text-6xl font-bold">{currentNumber}</div>
              </>
            )}
            {!currentNumber && <div className="text-4xl">?</div>}
          </div>
        </div>

        {/* Draw Button */}
        <button
          type="button"
          onClick={drawNumber}
          disabled={isAnimating || drawnNumbers.length >= MAX_NUMBER || hasBingo}
          className="fc-button fc-button-primary px-8 text-xl"
        >
          {isAnimating
            ? t({ ko: '추첨 중...', en: 'Drawing...', ja: '抽選中...' })
            : t({ ko: '🎱 번호 뽑기!', en: '🎱 Draw Number!', ja: '🎱 番号を引く！' })}
        </button>

        {/* Stats */}
        <div className="mt-4 text-center text-[var(--color-text-muted)]">
          <p>
            {t({ ko: '뽑은 번호', en: 'Drawn', ja: '引いた番号' })}: {drawnNumbers.length} / {MAX_NUMBER}
          </p>
        </div>

        {/* Bingo! */}
        {hasBingo && (
          <div className="fc-surface fc-surface-soft mt-6 p-6 text-center" role="status">
            <div className="text-4xl font-bold text-[var(--accent)]">🎉 BINGO! 🎉</div>
          </div>
        )}

        {/* Drawn Numbers Grid */}
        <div className="mt-6 w-full">
          <h3 className="font-bold mb-3 text-center">
            {t({ ko: '뽑힌 번호', en: 'Drawn Numbers', ja: '引かれた番号' })}
          </h3>
          <div className="grid grid-cols-5 gap-1 text-xs">
            {['B', 'I', 'N', 'G', 'O'].map((letter, colIdx) => (
              <div key={letter} className="space-y-1">
                <div className="text-center font-bold text-primary-500">{letter}</div>
                {Array.from({ length: 15 }, (_, i) => colIdx * 15 + i + 1).map(num => (
                  <div
                    key={num}
                    className={`text-center py-1 rounded ${
                      isDrawn(num)
                        ? 'bg-primary-500 text-white'
                        : 'bg-[var(--color-card)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Bingo Card */}
      <div className="w-full lg:w-80">
        <h3 className="font-bold mb-3 text-center">
          {t({ ko: '빙고 카드', en: 'Bingo Card', ja: 'ビンゴカード' })}
        </h3>

        {/* BINGO Header */}
        <div className="grid grid-cols-5 gap-1 mb-1">
          {['B', 'I', 'N', 'G', 'O'].map(letter => (
            <div
              key={letter}
              className="text-center py-2 font-bold text-lg bg-primary-500 text-white rounded-t-lg"
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-5 gap-1 bg-[var(--color-card)] p-1 rounded-b-lg border border-[var(--color-border)]">
          {bingoCard.map((row, rowIdx) =>
            row.map((num, colIdx) => {
              const isCenterFree = rowIdx === 2 && colIdx === 2;
              const isMarked = isCenterFree || isDrawn(num);

              return (
                <div
                  data-contrast-target={isMarked ? 'bingo-marked' : undefined}
                  key={`${rowIdx}-${colIdx}`}
                  className={`aspect-square flex items-center justify-center font-bold text-lg rounded transition-colors ${
                    isMarked
                      ? 'border border-[var(--brand)] bg-[var(--surface-soft)] text-[var(--brand)]'
                      : 'bg-[var(--color-bg)]'
                  }`}
                >
                  {isCenterFree ? '⭐' : num}
                </div>
              );
            })
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setBingoCard(generateCard())}
            className="fc-button fc-button-secondary w-full"
          >
            {t({ ko: '새 카드 생성', en: 'New Card', ja: '新しいカード' })}
          </button>
          <button
            type="button"
            onClick={resetGame}
            className="fc-button fc-button-secondary w-full"
          >
            {t({ ko: '게임 초기화', en: 'Reset Game', ja: 'ゲームリセット' })}
          </button>
        </div>
      </div>
    </div>
  );
}
