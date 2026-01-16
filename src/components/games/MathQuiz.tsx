import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type Operation = '+' | '-' | '×' | '÷';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export default function MathQuiz() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(`mathquiz-highscore-${difficulty}`);
    if (saved) setHighScore(parseInt(saved));
  }, [difficulty]);

  // Generate question
  const generateQuestion = useCallback((): Question => {
    let num1: number, num2: number, answer: number;
    let operations: Operation[];

    switch (difficulty) {
      case 'easy':
        operations = ['+', '-'];
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        break;
      case 'medium':
        operations = ['+', '-', '×'];
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        break;
      case 'hard':
        operations = ['+', '-', '×', '÷'];
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
    }

    const operation = operations[Math.floor(Math.random() * operations.length)];

    // Ensure subtraction doesn't go negative for easy/medium
    if (operation === '-' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    // For division, ensure clean division
    if (operation === '÷') {
      num2 = Math.floor(Math.random() * 12) + 1;
      num1 = num2 * (Math.floor(Math.random() * 12) + 1);
    }

    switch (operation) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '×': answer = num1 * num2; break;
      case '÷': answer = num1 / num2; break;
    }

    return { num1, num2, operation, answer };
  }, [difficulty]);

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setStreak(0);
    setQuestionsAnswered(0);
    setUserAnswer('');
    setFeedback(null);
    setCurrentQuestion(generateQuestion());
    setTimeout(() => inputRef.current?.focus(), 100);
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
            localStorage.setItem(`mathquiz-highscore-${difficulty}`, score.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore, difficulty]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !isPlaying || !userAnswer) return;

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      const streakBonus = Math.floor(newStreak / 5) * 5;
      setScore(prev => prev + basePoints + streakBonus);
      setStreak(newStreak);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('wrong');
    }

    setQuestionsAnswered(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      setCurrentQuestion(generateQuestion());
      inputRef.current?.focus();
    }, 300);
  };

  // Skip question
  const skipQuestion = () => {
    if (!isPlaying) return;
    setStreak(0);
    setUserAnswer('');
    setCurrentQuestion(generateQuestion());
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg lg:max-w-xl mx-auto px-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 w-full mb-6">
        <div className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-2xl font-bold text-primary-500">{timeLeft}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '초', en: 'sec', ja: '秒' })}
          </div>
        </div>
        <div className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-2xl font-bold text-green-500">{score}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '점수', en: 'Score', ja: 'スコア' })}
          </div>
        </div>
        <div className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-2xl font-bold text-orange-500">{streak}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '연속', en: 'Streak', ja: '連続' })}
          </div>
        </div>
        <div className="p-3 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-2xl font-bold text-yellow-500">{highScore}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {t({ ko: '최고', en: 'Best', ja: '最高' })}
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      {!isPlaying && (
        <div className="flex gap-2 mb-6">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                difficulty === diff
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] border border-[var(--color-border)]'
              }`}
            >
              {diff === 'easy' && t({ ko: '쉬움', en: 'Easy', ja: '簡単' })}
              {diff === 'medium' && t({ ko: '보통', en: 'Medium', ja: '普通' })}
              {diff === 'hard' && t({ ko: '어려움', en: 'Hard', ja: '難しい' })}
            </button>
          ))}
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
          <div className="text-5xl md:text-6xl font-bold font-mono">
            {currentQuestion.num1} {currentQuestion.operation} {currentQuestion.num2} = ?
          </div>
        ) : (
          <div className="text-[var(--color-text-muted)]">
            <div className="text-6xl mb-4">🧮</div>
            <p>{t({ ko: '시작 버튼을 눌러주세요', en: 'Press Start to begin', ja: 'スタートを押してください' })}</p>
          </div>
        )}
      </div>

      {/* Input */}
      {isPlaying && (
        <form onSubmit={handleSubmit} className="w-full mb-6">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 px-4 py-4 text-2xl font-bold text-center bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-xl focus:border-primary-500 focus:outline-none"
              placeholder="?"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!userAnswer}
              className="px-6 py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 disabled:opacity-50"
            >
              {t({ ko: '확인', en: 'Check', ja: '確認' })}
            </button>
          </div>
          <button
            type="button"
            onClick={skipQuestion}
            className="mt-3 w-full py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            {t({ ko: '건너뛰기', en: 'Skip', ja: 'スキップ' })}
          </button>
        </form>
      )}

      {/* Start/Result */}
      {!isPlaying && (
        <>
          {timeLeft === 0 && (
            <div className="mb-6 p-6 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl border border-primary-500 text-center w-full">
              <div className="text-2xl font-bold mb-4">
                {t({ ko: '게임 종료!', en: 'Game Over!', ja: 'ゲーム終了!' })}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary-500">{score}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {t({ ko: '점수', en: 'Score', ja: 'スコア' })}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500">{questionsAnswered}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {t({ ko: '문제 수', en: 'Questions', ja: '問題数' })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={startGame}
            className="px-8 py-4 bg-primary-500 text-white text-xl font-bold rounded-full hover:bg-primary-600 transition-colors"
          >
            {t({ ko: '시작', en: 'Start', ja: 'スタート' })}
          </button>
        </>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        <p>
          {t({
            ko: '연속 정답 5개마다 보너스 점수!',
            en: 'Bonus points every 5 correct answers in a row!',
            ja: '連続正解5問ごとにボーナス点！',
          })}
        </p>
      </div>
    </div>
  );
}
