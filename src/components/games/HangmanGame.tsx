import { useMemo, useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface WordItem {
  word: string;
  hint: {
    ko: string;
    en: string;
    ja: string;
  };
}

const MAX_WRONG_GUESSES = 6;

const HANGMAN_STAGES = [
  `\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========`,
  `\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========`,
];

const WORDS: WordItem[] = [
  { word: 'PIZZA', hint: { ko: '음식', en: 'Food', ja: '食べ物' } },
  { word: 'TIGER', hint: { ko: '동물', en: 'Animal', ja: '動物' } },
  { word: 'SUMMER', hint: { ko: '계절', en: 'Season', ja: '季節' } },
  { word: 'GUITAR', hint: { ko: '악기', en: 'Instrument', ja: '楽器' } },
  { word: 'SOCCER', hint: { ko: '스포츠', en: 'Sport', ja: 'スポーツ' } },
  { word: 'PYTHON', hint: { ko: '프로그래밍', en: 'Programming', ja: 'プログラミング' } },
  { word: 'COFFEE', hint: { ko: '음료', en: 'Drink', ja: '飲み物' } },
  { word: 'PLANET', hint: { ko: '우주', en: 'Space', ja: '宇宙' } },
];

export function pickRandomWord(words: WordItem[]): WordItem {
  return words[Math.floor(Math.random() * words.length)];
}

export function maskWord(word: string, guessedLetters: Set<string>): string {
  return word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');
}

export default function HangmanGame() {
  const { t, lang } = useTranslation();
  const [currentWordItem, setCurrentWordItem] = useState<WordItem>(() => pickRandomWord(WORDS));
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);

  const word = currentWordItem.word;

  const maskedWord = useMemo(() => maskWord(word, guessedLetters), [word, guessedLetters]);
  const isWin = useMemo(() => word.split('').every(letter => guessedLetters.has(letter)), [word, guessedLetters]);
  const isLose = wrongGuesses >= MAX_WRONG_GUESSES;
  const isGameOver = isWin || isLose;

  const guessedLettersText = useMemo(
    () => Array.from(guessedLetters).filter(letter => !word.includes(letter)).join(', ') || '-',
    [guessedLetters, word],
  );

  const resetGame = () => {
    setCurrentWordItem(pickRandomWord(WORDS));
    setGuessedLetters(new Set());
    setWrongGuesses(0);
  };

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || isGameOver) {
      return;
    }

    const nextGuessedLetters = new Set(guessedLetters);
    nextGuessedLetters.add(letter);
    setGuessedLetters(nextGuessedLetters);

    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="text-center">
        <div className="inline-block text-left bg-slate-900 text-slate-100 rounded-xl px-6 py-4 font-mono text-sm whitespace-pre leading-tight">
          {HANGMAN_STAGES[wrongGuesses]}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">
          {t({ ko: '힌트', en: 'Hint', ja: 'ヒント' })}: {currentWordItem.hint[lang]}
        </p>
        <p className="text-3xl md:text-4xl tracking-[0.45em] font-bold text-primary-500">{maskedWord}</p>
      </div>

      <div className="text-center text-sm text-[var(--color-text-muted)]">
        {t({ ko: '틀린 알파벳', en: 'Wrong Letters', ja: '間違った文字' })}: {guessedLettersText}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map(letter => {
          const isUsed = guessedLetters.has(letter);
          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isUsed || isGameOver}
              className={`w-10 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                isUsed
                  ? 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-[var(--color-card)] border-[var(--color-border)] hover:border-primary-500 hover:text-primary-500'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        {!isGameOver && (
          <p>
            {t({ ko: '남은 기회', en: 'Attempts Left', ja: '残りチャンス' })}: {MAX_WRONG_GUESSES - wrongGuesses}
          </p>
        )}
        {isWin && (
          <p className="text-green-500 font-bold">
            {t({ ko: '정답! 축하합니다 🎉', en: 'Correct! You win 🎉', ja: '正解！あなたの勝ちです 🎉' })}
          </p>
        )}
        {isLose && (
          <p className="text-red-500 font-bold">
            {t({ ko: '게임 오버! 정답은', en: 'Game Over! The word was', ja: 'ゲームオーバー！正解は' })} {word}
          </p>
        )}
      </div>

      <button
        onClick={resetGame}
        className="mx-auto px-5 py-2 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
      >
        {t({ ko: '새 게임', en: 'New Game', ja: '新しいゲーム' })}
      </button>
    </div>
  );
}
