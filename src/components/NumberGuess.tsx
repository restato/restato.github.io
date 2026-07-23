import { useState, useCallback } from 'react';

interface GameState {
  target: number;
  attempts: number;
  maxAttempts: number;
  guesses: { value: number; hint: 'up' | 'down' | 'correct' }[];
  gameOver: boolean;
  won: boolean;
}

const generateTarget = () => Math.floor(Math.random() * 100) + 1;

export default function NumberGuess() {
  const [game, setGame] = useState<GameState>({
    target: generateTarget(),
    attempts: 0,
    maxAttempts: 7,
    guesses: [],
    gameOver: false,
    won: false,
  });
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({ played: 0, won: 0, avgAttempts: 0 });
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  const getDifficultySettings = (diff: typeof difficulty) => {
    switch (diff) {
      case 'easy':
        return { max: 50, attempts: 10, label: '쉬움 (1-50)' };
      case 'hard':
        return { max: 200, attempts: 5, label: '어려움 (1-200)' };
      default:
        return { max: 100, attempts: 7, label: '보통 (1-100)' };
    }
  };

  const settings = getDifficultySettings(difficulty);

  const makeGuess = useCallback(() => {
    const guess = parseInt(input);
    if (isNaN(guess) || guess < 1 || guess > settings.max || game.gameOver) return;

    const newAttempts = game.attempts + 1;
    let hint: 'up' | 'down' | 'correct' = 'correct';
    let gameOver = false;
    let won = false;

    if (guess < game.target) {
      hint = 'up';
    } else if (guess > game.target) {
      hint = 'down';
    } else {
      gameOver = true;
      won = true;
    }

    if (newAttempts >= game.maxAttempts && !won) {
      gameOver = true;
    }

    setGame((prev) => ({
      ...prev,
      attempts: newAttempts,
      guesses: [...prev.guesses, { value: guess, hint }],
      gameOver,
      won,
    }));

    if (gameOver) {
      setStats((prev) => ({
        played: prev.played + 1,
        won: prev.won + (won ? 1 : 0),
        avgAttempts: won
          ? (prev.avgAttempts * prev.won + newAttempts) / (prev.won + 1)
          : prev.avgAttempts,
      }));
    }

    setInput('');
  }, [input, game, settings.max]);

  const newGame = (newDifficulty?: typeof difficulty) => {
    const diff = newDifficulty || difficulty;
    const newSettings = getDifficultySettings(diff);
    setGame({
      target: Math.floor(Math.random() * newSettings.max) + 1,
      attempts: 0,
      maxAttempts: newSettings.attempts,
      guesses: [],
      gameOver: false,
      won: false,
    });
    setInput('');
    if (newDifficulty) setDifficulty(newDifficulty);
  };

  const getHintText = (hint: 'up' | 'down' | 'correct') => {
    if (hint === 'up') return '⬆️ UP';
    if (hint === 'down') return '⬇️ DOWN';
    return '🎯 정답!';
  };

  const getHintColor = (hint: 'up' | 'down' | 'correct') => {
    if (hint === 'up') return 'bg-blue-500';
    if (hint === 'down') return 'bg-red-500';
    return 'bg-green-500';
  };

  const getProximityColor = (guess: number) => {
    const diff = Math.abs(guess - game.target);
    const maxDiff = settings.max;
    const ratio = diff / maxDiff;

    if (ratio < 0.05) return 'border-green-500 bg-green-500/20';
    if (ratio < 0.1) return 'border-yellow-500 bg-yellow-500/20';
    if (ratio < 0.2) return 'border-orange-500 bg-orange-500/20';
    return 'border-red-500 bg-red-500/20';
  };

  return (
    <div className="fc-game mx-auto max-w-md">
      {/* 난이도 선택 */}
      <div className="flex justify-center gap-2 mb-6">
        {(['easy', 'normal', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => newGame(diff)}
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

      {/* 게임 상태 */}
      <div className="fc-surface mb-6 p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔢</div>
          <h2 className="text-xl font-bold mb-2">
            1부터 {settings.max}까지의 숫자를 맞춰보세요!
          </h2>
          <p className="text-[var(--color-text-muted)]">
            남은 기회: <span className="font-bold text-[var(--brand)]">{game.maxAttempts - game.attempts}</span>회
          </p>
        </div>

        {/* 입력 */}
        {!game.gameOver && (
          <div className="flex gap-2">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && makeGuess()}
              min={1}
              max={settings.max}
              placeholder={`1-${settings.max}`}
              aria-label="추측할 숫자"
              className="fc-input flex-1 text-center text-xl font-bold"
            />
            <button
              type="button"
              onClick={makeGuess}
              disabled={!input}
              className="fc-button fc-button-primary"
            >
              확인
            </button>
          </div>
        )}

        {/* 게임 오버 */}
        {game.gameOver && (
          <div
            role="status"
            className={`text-center p-6 rounded-xl ${
              game.won
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-red-500/20 border border-red-500'
            }`}
          >
            <div className="text-5xl mb-4">{game.won ? '🎉' : '😢'}</div>
            <h3 className="text-2xl font-bold mb-2">
              {game.won ? '정답입니다!' : '게임 오버'}
            </h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              {game.won
                ? `${game.attempts}번 만에 맞추셨어요!`
                : `정답은 ${game.target}이었어요`}
            </p>
            <button
              type="button"
              onClick={() => newGame()}
              className="fc-button fc-button-primary"
            >
              다시 하기
            </button>
          </div>
        )}
      </div>

      {/* 추측 기록 */}
      {game.guesses.length > 0 && (
        <div className="fc-surface mb-6 p-4">
          <h3 className="font-bold mb-4">추측 기록</h3>
          <div className="flex flex-wrap gap-2">
            {game.guesses.map((guess, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-lg border-2 ${getProximityColor(guess.value)}`}
              >
                <span className="font-bold">{guess.value}</span>
                <span className="ml-2 text-sm">{getHintText(guess.hint)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="fc-surface p-4">
        <h3 className="font-bold mb-4 text-center">📊 통계</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[var(--brand)]">{stats.played}</div>
            <div className="text-sm text-[var(--color-text-muted)]">플레이</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">승률</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--accent)]">
              {stats.won > 0 ? stats.avgAttempts.toFixed(1) : '-'}
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">평균 시도</div>
          </div>
        </div>
      </div>
    </div>
  );
}
