import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

// Sample words for typing
const WORDS = {
  ko: [
    '프로그래밍', '개발자', '컴퓨터', '인터넷', '소프트웨어', '하드웨어',
    '알고리즘', '데이터', '네트워크', '보안', '클라우드', '서버',
    '모바일', '앱', '웹사이트', '디자인', '코딩', '함수', '변수', '배열',
    '안녕하세요', '감사합니다', '좋아요', '화이팅', '행복', '사랑',
  ],
  en: [
    'programming', 'developer', 'computer', 'internet', 'software', 'hardware',
    'algorithm', 'data', 'network', 'security', 'cloud', 'server',
    'mobile', 'app', 'website', 'design', 'coding', 'function', 'variable', 'array',
    'hello', 'thank', 'good', 'happy', 'love', 'world', 'keyboard', 'typing',
  ],
};

interface GameStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  correctWords: number;
}

export default function TypingGame() {
  const { t, lang } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
    correctWords: 0,
  });
  const [bestWpm, setBestWpm] = useState(0);
  const [language, setLanguage] = useState<'ko' | 'en'>('en');

  // Load best WPM
  useEffect(() => {
    const saved = localStorage.getItem('typing-bestwpm');
    if (saved) setBestWpm(parseInt(saved));
  }, []);

  // Generate words
  const generateWords = useCallback((wordLang: 'ko' | 'en') => {
    const wordList = WORDS[wordLang];
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 50);
  }, []);

  // Start game
  const startGame = () => {
    const newWords = generateWords(language);
    setWords(newWords);
    setCurrentWordIndex(0);
    setInput('');
    setTimeLeft(60);
    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      totalChars: 0,
      correctWords: 0,
    });
    setIsPlaying(true);
    inputRef.current?.focus();
  };

  // Timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          // Save best WPM
          if (stats.wpm > bestWpm) {
            setBestWpm(stats.wpm);
            localStorage.setItem('typing-bestwpm', stats.wpm.toString());
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, stats.wpm, bestWpm]);

  // Calculate WPM
  useEffect(() => {
    if (!isPlaying) return;

    const elapsed = 60 - timeLeft;
    if (elapsed > 0) {
      const wpm = Math.round((stats.correctChars / 5) / (elapsed / 60));
      setStats(prev => ({ ...prev, wpm }));
    }
  }, [timeLeft, stats.correctChars, isPlaying]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying) return;

    const value = e.target.value;
    setInput(value);

    const currentWord = words[currentWordIndex];

    // Check if word is completed (space pressed or exact match for last word)
    if (value.endsWith(' ') || (currentWordIndex === words.length - 1 && value === currentWord)) {
      const typedWord = value.trim();
      const isCorrect = typedWord === currentWord;

      setStats(prev => ({
        ...prev,
        correctChars: prev.correctChars + (isCorrect ? currentWord.length : 0),
        totalChars: prev.totalChars + typedWord.length,
        correctWords: prev.correctWords + (isCorrect ? 1 : 0),
        accuracy: prev.totalChars > 0
          ? Math.round(((prev.correctChars + (isCorrect ? currentWord.length : 0)) / (prev.totalChars + typedWord.length)) * 100)
          : 100,
      }));

      setInput('');
      setCurrentWordIndex(prev => prev + 1);

      // Check if all words completed
      if (currentWordIndex >= words.length - 1) {
        setIsPlaying(false);
        if (stats.wpm > bestWpm) {
          setBestWpm(stats.wpm);
          localStorage.setItem('typing-bestwpm', stats.wpm.toString());
        }
      }
    }
  };

  const currentWord = words[currentWordIndex] || '';

  return (
    <div className="flex flex-col items-center w-full max-w-2xl lg:max-w-4xl mx-auto px-4">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 w-full mb-6">
        <div className="p-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-3xl font-bold text-primary-500">{timeLeft}</div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '초', en: 'sec', ja: '秒' })}
          </div>
        </div>
        <div className="p-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-3xl font-bold text-green-500">{stats.wpm}</div>
          <div className="text-sm text-[var(--color-text-muted)]">WPM</div>
        </div>
        <div className="p-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-3xl font-bold text-blue-500">{stats.accuracy}%</div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '정확도', en: 'Accuracy', ja: '正確度' })}
          </div>
        </div>
        <div className="p-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] text-center">
          <div className="text-3xl font-bold text-yellow-500">{bestWpm}</div>
          <div className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '최고', en: 'Best', ja: '最高' })}
          </div>
        </div>
      </div>

      {/* Language Selection */}
      {!isPlaying && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              language === 'en'
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--color-card)] border border-[var(--color-border)]'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ko')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              language === 'ko'
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--color-card)] border border-[var(--color-border)]'
            }`}
          >
            한국어
          </button>
        </div>
      )}

      {/* Word Display */}
      <div className="w-full p-6 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] mb-4">
        {isPlaying ? (
          <div className="flex flex-wrap gap-2 text-lg">
            {words.slice(currentWordIndex, currentWordIndex + 10).map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                className={`px-2 py-1 rounded ${
                  idx === 0
                    ? 'bg-primary-500/20 text-primary-500 font-bold'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {idx === 0 ? (
                  // Highlight typed characters
                  word.split('').map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className={
                        charIdx < input.length
                          ? input[charIdx] === char
                            ? 'text-green-500'
                            : 'text-red-500 bg-red-500/20'
                          : ''
                      }
                    >
                      {char}
                    </span>
                  ))
                ) : (
                  word
                )}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center text-[var(--color-text-muted)]">
            {t({
              ko: '시작 버튼을 눌러 타이핑을 시작하세요',
              en: 'Click Start to begin typing',
              ja: 'スタートボタンを押してタイピングを開始',
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        disabled={!isPlaying}
        placeholder={
          isPlaying
            ? t({ ko: '여기에 입력하세요...', en: 'Type here...', ja: 'ここに入力...' })
            : ''
        }
        className="w-full p-4 text-lg bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-xl focus:border-primary-500 focus:outline-none disabled:opacity-50"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Start/Restart Button */}
      <button
        onClick={startGame}
        className="mt-6 px-8 py-4 bg-primary-500 text-white text-xl font-bold rounded-full hover:bg-primary-600 transition-colors"
      >
        {isPlaying
          ? t({ ko: '다시 시작', en: 'Restart', ja: 'リスタート' })
          : t({ ko: '시작', en: 'Start', ja: 'スタート' })}
      </button>

      {/* Game Over Stats */}
      {!isPlaying && timeLeft === 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl border border-primary-500 text-center">
          <div className="text-2xl font-bold mb-4">
            {t({ ko: '결과', en: 'Results', ja: '結果' })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-4xl font-bold text-primary-500">{stats.wpm}</div>
              <div className="text-sm text-[var(--color-text-muted)]">WPM</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">{stats.accuracy}%</div>
              <div className="text-sm text-[var(--color-text-muted)]">
                {t({ ko: '정확도', en: 'Accuracy', ja: '正確度' })}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{stats.correctWords}</div>
              <div className="text-sm text-[var(--color-text-muted)]">
                {t({ ko: '맞은 단어', en: 'Correct Words', ja: '正解単語' })}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{stats.correctChars}</div>
              <div className="text-sm text-[var(--color-text-muted)]">
                {t({ ko: '맞은 글자', en: 'Correct Chars', ja: '正解文字' })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
