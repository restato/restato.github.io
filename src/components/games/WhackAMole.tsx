import { useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const GRID_SIZE = 9;
const GAME_DURATION = 30;

export default function WhackAMole() {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('whack-a-mole-best');
    if (saved) {
      setBestScore(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setMoleIndex(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const moveMole = () => {
      setMoleIndex(Math.floor(Math.random() * GRID_SIZE));
    };

    moveMole();
    const moleTimer = setInterval(moveMole, 650);

    return () => clearInterval(moleTimer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying && timeLeft === 0 && score > bestScore) {
      setBestScore(score);
      localStorage.setItem('whack-a-mole-best', score.toString());
    }
  }, [isPlaying, timeLeft, score, bestScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
  };

  const hitMole = (index: number) => {
    if (!isPlaying || moleIndex !== index) return;

    setScore(prev => prev + 1);
    setMoleIndex(Math.floor(Math.random() * GRID_SIZE));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">{t({ ko: '점수', en: 'Score', ja: 'スコア' })}</p>
          <p className="text-2xl font-bold text-primary-500">{score}</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">{t({ ko: '남은 시간', en: 'Time', ja: '残り時間' })}</p>
          <p className="text-2xl font-bold text-orange-500">{timeLeft}</p>
        </div>
        <div className="p-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">{t({ ko: '최고 기록', en: 'Best', ja: 'ベスト' })}</p>
          <p className="text-2xl font-bold text-green-500">{bestScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => hitMole(index)}
            className="h-20 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] hover:border-primary-500 transition-colors"
            aria-label={t({ ko: `${index + 1}번 구멍`, en: `Hole ${index + 1}`, ja: `${index + 1}番ホール` })}
          >
            <span className="text-3xl">{moleIndex === index ? '🐹' : '🕳️'}</span>
          </button>
        ))}
      </div>

      <div className="text-center">
        {!isPlaying && timeLeft > 0 && (
          <p className="text-[var(--color-text-muted)] mb-4">
            {t({ ko: '30초 동안 두더지를 최대한 많이 잡아보세요!', en: 'Catch as many moles as you can in 30 seconds!', ja: '30秒でできるだけ多くモグラを捕まえよう！' })}
          </p>
        )}

        {!isPlaying && timeLeft === 0 && (
          <p className="text-lg font-bold mb-4">
            {t({ ko: '게임 종료!', en: 'Time Up!', ja: 'ゲーム終了！' })} {t({ ko: '최종 점수', en: 'Final Score', ja: '最終スコア' })}: {score}
          </p>
        )}

        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors"
        >
          {isPlaying
            ? t({ ko: '다시 시작', en: 'Restart', ja: 'リスタート' })
            : t({ ko: '게임 시작', en: 'Start Game', ja: 'ゲーム開始' })}
        </button>
      </div>
    </div>
  );
}
