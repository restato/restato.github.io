import { useState, useEffect } from 'react';

interface AgeResult {
  koreanAge: number;
  internationalAge: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: number;
  zodiac: string;
  zodiacEmoji: string;
  chineseZodiac: string;
  chineseZodiacEmoji: string;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);

  const getZodiac = (month: number, day: number): { sign: string; emoji: string } => {
    const zodiacSigns = [
      { sign: '염소자리', emoji: '♑', start: [12, 22], end: [1, 19] },
      { sign: '물병자리', emoji: '♒', start: [1, 20], end: [2, 18] },
      { sign: '물고기자리', emoji: '♓', start: [2, 19], end: [3, 20] },
      { sign: '양자리', emoji: '♈', start: [3, 21], end: [4, 19] },
      { sign: '황소자리', emoji: '♉', start: [4, 20], end: [5, 20] },
      { sign: '쌍둥이자리', emoji: '♊', start: [5, 21], end: [6, 21] },
      { sign: '게자리', emoji: '♋', start: [6, 22], end: [7, 22] },
      { sign: '사자자리', emoji: '♌', start: [7, 23], end: [8, 22] },
      { sign: '처녀자리', emoji: '♍', start: [8, 23], end: [9, 22] },
      { sign: '천칭자리', emoji: '♎', start: [9, 23], end: [10, 22] },
      { sign: '전갈자리', emoji: '♏', start: [10, 23], end: [11, 21] },
      { sign: '사수자리', emoji: '♐', start: [11, 22], end: [12, 21] },
    ];

    for (const z of zodiacSigns) {
      const [sm, sd] = z.start;
      const [em, ed] = z.end;

      if (sm > em) {
        if ((month === sm && day >= sd) || (month === em && day <= ed)) {
          return { sign: z.sign, emoji: z.emoji };
        }
      } else {
        if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) {
          return { sign: z.sign, emoji: z.emoji };
        }
      }
    }
    return { sign: '염소자리', emoji: '♑' };
  };

  const getChineseZodiac = (year: number): { animal: string; emoji: string } => {
    const animals = [
      { animal: '원숭이', emoji: '🐵' },
      { animal: '닭', emoji: '🐔' },
      { animal: '개', emoji: '🐕' },
      { animal: '돼지', emoji: '🐷' },
      { animal: '쥐', emoji: '🐭' },
      { animal: '소', emoji: '🐮' },
      { animal: '호랑이', emoji: '🐯' },
      { animal: '토끼', emoji: '🐰' },
      { animal: '용', emoji: '🐲' },
      { animal: '뱀', emoji: '🐍' },
      { animal: '말', emoji: '🐴' },
      { animal: '양', emoji: '🐑' },
    ];
    return animals[year % 12];
  };

  useEffect(() => {
    if (!birthDate) {
      setResult(null);
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    // Korean age (만 나이 + 1, but since 2023 Korea uses international age)
    const koreanAge = today.getFullYear() - birth.getFullYear() + 1;

    // International age
    let internationalAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      internationalAge--;
    }

    // Months and days
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      months += 12;
    }
    months = months % 12;

    // Total days lived
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // Days until next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    setResult({
      koreanAge,
      internationalAge,
      months,
      days,
      totalDays,
      nextBirthday: daysUntilBirthday,
      zodiac: zodiac.sign,
      zodiacEmoji: zodiac.emoji,
      chineseZodiac: chineseZodiac.animal,
      chineseZodiacEmoji: chineseZodiac.emoji,
    });
  }, [birthDate]);

  return (
    <div className="flex flex-col gap-6">
      {/* Birth Date Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          생년월일
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
            bg-[var(--color-card)] text-[var(--color-text)] text-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Age Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20 text-center">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">만 나이</p>
              <p className="text-4xl font-bold text-primary-500">{result.internationalAge}세</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">세는 나이</p>
              <p className="text-4xl font-bold text-[var(--color-text)]">{result.koreanAge}세</p>
            </div>
          </div>

          {/* Detailed Age */}
          <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
            <p className="text-[var(--color-text)]">
              정확한 나이: <span className="font-bold">{result.internationalAge}년 {result.months}개월 {result.days}일</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">살아온 날</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {result.totalDays.toLocaleString()}일
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">다음 생일까지</p>
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {result.nextBirthday === 0 ? '🎂 오늘!' : `${result.nextBirthday}일`}
              </p>
            </div>
          </div>

          {/* Zodiac Signs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
              <p className="text-3xl mb-2">{result.zodiacEmoji}</p>
              <p className="text-sm text-[var(--color-text-muted)]">별자리</p>
              <p className="font-medium text-[var(--color-text)]">{result.zodiac}</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
              <p className="text-3xl mb-2">{result.chineseZodiacEmoji}</p>
              <p className="text-sm text-[var(--color-text-muted)]">띠</p>
              <p className="font-medium text-[var(--color-text)]">{result.chineseZodiac}띠</p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
            <h3 className="font-medium text-[var(--color-text)] mb-3">📊 재미있는 통계</h3>
            <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <p>• 약 {Math.floor(result.totalDays * 24).toLocaleString()}시간을 살았어요</p>
              <p>• 약 {Math.floor(result.totalDays * 24 * 60).toLocaleString()}분이 지났어요</p>
              <p>• 약 {(result.totalDays / 7).toFixed(0)}주를 보냈어요</p>
              <p>• 심장이 약 {(result.totalDays * 24 * 60 * 72).toLocaleString()}번 뛰었어요</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
