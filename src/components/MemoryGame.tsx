import { useState, useEffect, useCallback } from 'react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🐶', '🐱', '🐼', '🦊', '🦁', '🐸', '🐵', '🐰', '🐻', '🐨', '🐯', '🦄'];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createCards = (pairCount: number): Card[] => {
  const selectedEmojis = EMOJIS.slice(0, pairCount);
  const pairs = [...selectedEmojis, ...selectedEmojis];
  const shuffled = shuffleArray(pairs);

  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [isChecking, setIsChecking] = useState(false);

  const getDifficultySettings = (diff: typeof difficulty) => {
    switch (diff) {
      case 'easy':
        return { pairs: 4, cols: 4, label: '쉬움 (4쌍)' };
      case 'hard':
        return { pairs: 8, cols: 4, label: '어려움 (8쌍)' };
      default:
        return { pairs: 6, cols: 4, label: '보통 (6쌍)' };
    }
  };

  const settings = getDifficultySettings(difficulty);

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const startNewGame = useCallback(() => {
    setCards(createCards(settings.pairs));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(false);
    setGameOver(false);
    setTime(0);
    setIsChecking(false);
  }, [settings.pairs]);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isChecking) return;

      const card = cards[cardId];
      if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

      if (!gameStarted) {
        setGameStarted(true);
      }

      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
      );

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1);
        setIsChecking(true);

        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.emoji === secondCard.emoji) {
          // 매치!
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isMatched: true }
                  : c
              )
            );
            setMatches((prev) => {
              const newMatches = prev + 1;
              if (newMatches === settings.pairs) {
                setGameOver(true);
                // 최고 점수 업데이트
                setBestScores((prev) => {
                  const currentBest = prev[difficulty];
                  if (!currentBest || time < currentBest) {
                    return { ...prev, [difficulty]: time };
                  }
                  return prev;
                });
              }
              return newMatches;
            });
            setFlippedCards([]);
            setIsChecking(false);
          }, 500);
        } else {
          // 매치 실패
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedCards([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [cards, flippedCards, gameStarted, isChecking, settings.pairs, time, difficulty]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fc-game mx-auto max-w-lg">
      {/* 난이도 선택 */}
      <div className="flex justify-center gap-2 mb-6">
        {(['easy', 'normal', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => setDifficulty(diff)}
            className={`fc-button text-sm ${
              difficulty === diff
                ? 'fc-button-primary'
                : 'fc-button-secondary'
            }`}
          >
            {getDifficultySettings(diff).label}
          </button>
        ))}
      </div>

      {/* 게임 정보 */}
      <div className="fc-surface mb-6 flex items-center justify-between p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--brand)]">{formatTime(time)}</div>
          <div className="text-sm text-[var(--color-text-muted)]">시간</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--brand)]">{matches}/{settings.pairs}</div>
          <div className="text-sm text-[var(--color-text-muted)]">매치</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--accent)]">{moves}</div>
          <div className="text-sm text-[var(--color-text-muted)]">시도</div>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div
        className="grid gap-2 mb-6"
        style={{ gridTemplateColumns: `repeat(${settings.cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            aria-label={card.isFlipped || card.isMatched ? card.emoji : '숨겨진 카드'}
            className={`aspect-square rounded-xl text-3xl md:text-4xl flex items-center justify-center transition-colors duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-[var(--surface-raised)] border border-[var(--border-subtle)]'
                : 'bg-[var(--brand)] hover:bg-[var(--brand-hover)]'
            } ${card.isMatched ? 'opacity-70' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-flip-in">{card.emoji}</span>
            ) : (
              <span className="text-white text-2xl">❓</span>
            )}
          </button>
        ))}
      </div>

      {/* 게임 오버 */}
      {gameOver && (
        <div className="fc-surface fc-surface-soft mb-6 p-6 text-center" role="status">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">축하합니다!</h3>
          <p className="text-[var(--color-text-muted)] mb-4">
            {formatTime(time)} / {moves}번 시도
          </p>
          <button
            type="button"
            onClick={startNewGame}
            className="fc-button fc-button-primary"
          >
            다시 하기
          </button>
        </div>
      )}

      {/* 새 게임 버튼 */}
      {!gameOver && (
        <button
          type="button"
          onClick={startNewGame}
          className="fc-button fc-button-secondary w-full"
        >
          새 게임
        </button>
      )}

      {/* 최고 기록 */}
      {Object.keys(bestScores).length > 0 && (
        <div className="fc-surface mt-6 p-4">
          <h3 className="font-bold mb-3 text-center">🏆 최고 기록</h3>
          <div className="space-y-2">
            {(['easy', 'normal', 'hard'] as const).map((diff) => {
              const score = bestScores[diff];
              if (!score) return null;
              return (
                <div
                  key={diff}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-[var(--color-text-muted)]">
                    {getDifficultySettings(diff).label}
                  </span>
                  <span className="font-bold text-[var(--accent)]">{formatTime(score)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes flip-in {
          from { transform: rotateY(90deg); }
          to { transform: rotateY(0deg); }
        }
        .animate-flip-in {
          animation: flip-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
