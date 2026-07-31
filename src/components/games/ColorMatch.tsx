import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

const COLORS = [
  { name: { ko: '빨강', en: 'RED', ja: '赤' }, value: '#ef4444' },
  { name: { ko: '파랑', en: 'BLUE', ja: '青' }, value: '#3b82f6' },
  { name: { ko: '초록', en: 'GREEN', ja: '緑' }, value: '#22c55e' },
  { name: { ko: '노랑', en: 'YELLOW', ja: '黄' }, value: '#eab308' },
  { name: { ko: '보라', en: 'PURPLE', ja: '紫' }, value: '#a855f7' },
  { name: { ko: '주황', en: 'ORANGE', ja: 'オレンジ' }, value: '#f97316' },
];

type GameMode = 'text-color' | 'color-text';

export default function ColorMatch() {
  const { t, lang } = useTranslation();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    text: string;
    textColor: string;
    correctAnswer: string;
  } | null>(null);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mode, setMode] = useState<GameMode>('text-color');
  const [streak, setStreak] = useState(0);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('colormatch-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Generate question
  const generateQuestion = useCallback(() => {
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    let displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    // 30% chance to make them match
    if (Math.random() < 0.3) {
      displayColor = textColor;
    }

    // Shuffle options
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      text: textColor.name[lang as keyof typeof textColor.name] || textColor.name.en,
      textColor: displayColor.value,
      correctAnswer: mode === 'text-color' ? displayColor.value : textColor.value,
    });
    setOptions(shuffled);
  }, [lang, mode]);

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setStreak(0);
    generateQuestion();
  };

  // Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('colormatch-highscore', score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  // Handle answer
  const handleAnswer = (colorValue: string) => {
    if (!currentQuestion || !isPlaying) return;

    const isCorrect = colorValue === currentQuestion.correctAnswer;

    if (isCorrect) {
      const newStreak = streak + 1;
      const points = 10 + Math.floor(newStreak / 3) * 5; // Bonus points for streaks
      setScore(prev => prev + points);
      setStreak(newStreak);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      generateQuestion();
    }, 200);
  };

  return (
    <div className="fc-game mx-auto flex w-full max-w-lg flex-col items-center px-0 lg:max-w-xl">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 w-full mb-6">
        <div className="fc-surface p-3 text-center">
          <div className="text-2xl font-bold text-[var(--brand)]">{timeLeft}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '초', en: 'sec', ja: '秒' })}
          </div>
        </div>
        <div className="fc-surface p-3 text-center">
          <div className="text-2xl font-bold text-green-500">{score}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '점수', en: 'Score', ja: 'スコア' })}
          </div>
        </div>
        <div className="fc-surface p-3 text-center">
          <div className="text-2xl font-bold text-[var(--accent)]">{streak}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '연속', en: 'Streak', ja: '連続' })}
          </div>
        </div>
        <div className="fc-surface p-3 text-center">
          <div className="text-2xl font-bold text-[var(--accent)]">{highScore}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '최고', en: 'Best', ja: '最高' })}
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      {!isPlaying && (
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode('text-color')}
            aria-pressed={mode === 'text-color'}
            className={`fc-button text-sm ${
              mode === 'text-color'
                ? 'fc-button-primary'
                : 'fc-button-secondary'
            }`}
          >
            {t({ ko: '글자 색상 맞추기', en: 'Match Text Color', ja: 'テキスト色を当てる' })}
          </button>
          <button
            type="button"
            onClick={() => setMode('color-text')}
            aria-pressed={mode === 'color-text'}
            className={`fc-button text-sm ${
              mode === 'color-text'
                ? 'fc-button-primary'
                : 'fc-button-secondary'
            }`}
          >
            {t({ ko: '글자 내용 맞추기', en: 'Match Text Meaning', ja: 'テキスト意味を当てる' })}
          </button>
        </div>
      )}

      {/* Question */}
      <div
        className={`w-full p-8 bg-[var(--color-card)] rounded-xl border-2 mb-6 text-center transition-colors ${
          feedback === 'correct'
            ? 'border-green-500 bg-green-500/10'
            : feedback === 'wrong'
            ? 'border-red-500 bg-red-500/10'
            : 'border-[var(--color-border)]'
        }`}
      >
        {isPlaying && currentQuestion ? (
          <>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              {mode === 'text-color'
                ? t({ ko: '글자의 색상을 선택하세요', en: 'Select the TEXT COLOR', ja: 'テキストの色を選んでください' })
                : t({ ko: '글자의 의미를 선택하세요', en: 'Select the TEXT MEANING', ja: 'テキストの意味を選んでください' })}
            </p>
            <div
              className="text-5xl md:text-6xl font-bold"
              style={{ color: currentQuestion.textColor }}
            >
              {currentQuestion.text}
            </div>
          </>
        ) : (
          <div className="text-[var(--color-text-muted)]">
            <div className="text-6xl mb-4">🎨</div>
            <p>{t({ ko: '시작 버튼을 눌러주세요', en: 'Press Start to begin', ja: 'スタートを押してください' })}</p>
          </div>
        )}
      </div>

      {feedback && (
        <div className="sr-only" role="status" aria-live="assertive">
          {feedback === 'correct'
            ? t({ ko: '정답!', en: 'Correct!', ja: '正解！' })
            : t({ ko: '오답!', en: 'Incorrect!', ja: '不正解！' })}
        </div>
      )}

      {/* Options */}
      {isPlaying && (
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {options.map((color) => (
            <button
              type="button"
              key={color.value}
              onClick={() => handleAnswer(color.value)}
              className="fc-game-cell min-h-11 rounded-xl p-4 font-bold text-white"
              style={{ backgroundColor: color.value }}
            >
              {color.name[lang as keyof typeof color.name] || color.name.en}
            </button>
          ))}
        </div>
      )}

      {/* Start/Result */}
      {!isPlaying && (
        <>
          {timeLeft === 0 && (
            <div className="fc-surface fc-surface-soft mb-6 p-6 text-center" role="status">
              <div className="text-2xl font-bold mb-2">
                {t({ ko: '게임 종료!', en: 'Game Over!', ja: 'ゲーム終了!' })}
              </div>
              <div className="text-4xl font-bold text-[var(--brand)]">{score}</div>
              <div className="text-sm text-[var(--color-text-muted)]">
                {t({ ko: '점수', en: 'points', ja: '点' })}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={startGame}
            className="fc-button fc-button-primary px-8 text-xl"
          >
            {t({ ko: '시작', en: 'Start', ja: 'スタート' })}
          </button>
        </>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        <p>
          {mode === 'text-color'
            ? t({
                ko: '글자가 표시된 색상을 빠르게 선택하세요',
                en: 'Quickly select the color the text is displayed in',
                ja: 'テキストが表示されている色を素早く選んでください',
              })
            : t({
                ko: '글자가 의미하는 색상을 빠르게 선택하세요',
                en: 'Quickly select the color the text describes',
                ja: 'テキストが意味する色を素早く選んでください',
              })}
        </p>
      </div>
    </div>
  );
}
