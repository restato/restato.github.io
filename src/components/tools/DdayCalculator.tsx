import { useState, useEffect } from 'react';

interface DdayResult {
  days: number;
  isUpcoming: boolean;
  weeks: number;
  months: number;
  hours: number;
  progress?: number;
}

export default function DdayCalculator() {
  const [targetDate, setTargetDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [result, setResult] = useState<DdayResult | null>(null);
  const [savedDdays, setSavedDdays] = useState<Array<{ name: string; date: string }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedDdays');
    if (saved) {
      setSavedDdays(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!targetDate) {
      setResult(null);
      return;
    }

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    setResult({
      days: Math.abs(diffDays),
      isUpcoming: diffDays > 0,
      weeks: Math.floor(Math.abs(diffDays) / 7),
      months: Math.floor(Math.abs(diffDays) / 30),
      hours: Math.abs(diffHours),
    });
  }, [targetDate]);

  const saveDday = () => {
    if (!targetDate || !eventName.trim()) return;

    const newDdays = [...savedDdays, { name: eventName.trim(), date: targetDate }];
    setSavedDdays(newDdays);
    localStorage.setItem('savedDdays', JSON.stringify(newDdays));
    setEventName('');
  };

  const deleteDday = (index: number) => {
    const newDdays = savedDdays.filter((_, i) => i !== index);
    setSavedDdays(newDdays);
    localStorage.setItem('savedDdays', JSON.stringify(newDdays));
  };

  const loadDday = (date: string, name: string) => {
    setTargetDate(date);
    setEventName(name);
  };

  const quickDates = [
    { label: '설날', getDate: () => `${new Date().getFullYear() + 1}-01-29` },
    { label: '크리스마스', getDate: () => `${new Date().getFullYear()}-12-25` },
    { label: '새해', getDate: () => `${new Date().getFullYear() + 1}-01-01` },
    { label: '어린이날', getDate: () => `${new Date().getFullYear()}-05-05` },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Event Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          이벤트 이름 (선택)
        </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="예: 휴가, 시험, 생일..."
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
            bg-[var(--color-card)] text-[var(--color-text)]
            focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Target Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          목표 날짜
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
            bg-[var(--color-card)] text-[var(--color-text)] text-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Quick Date Buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {quickDates.map((q) => (
            <button
              key={q.label}
              onClick={() => {
                setTargetDate(q.getDate());
                setEventName(q.label);
              }}
              className="px-3 py-1 rounded-lg text-sm bg-[var(--color-bg)]
                hover:bg-[var(--color-card-hover)] text-[var(--color-text-muted)]
                border border-[var(--color-border)] transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Main D-Day Display */}
          <div className={`p-8 rounded-xl text-center ${
            result.isUpcoming
              ? 'bg-primary-500/10 border border-primary-500/20'
              : 'bg-gray-500/10 border border-gray-500/20'
          }`}>
            {eventName && (
              <p className="text-lg text-[var(--color-text-muted)] mb-2">{eventName}</p>
            )}
            <p className={`text-6xl font-bold ${result.isUpcoming ? 'text-primary-500' : 'text-[var(--color-text)]'}`}>
              {result.days === 0 ? 'D-Day' : `D${result.isUpcoming ? '-' : '+'}${result.days}`}
            </p>
            <p className="text-[var(--color-text-muted)] mt-2">
              {result.days === 0 ? '오늘입니다' : result.isUpcoming ? `${result.days}일 남았습니다` : `${result.days}일 지났습니다`}
            </p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
              <p className="text-2xl font-bold text-[var(--color-text)]">{result.months}</p>
              <p className="text-xs text-[var(--color-text-muted)]">개월</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
              <p className="text-2xl font-bold text-[var(--color-text)]">{result.weeks}</p>
              <p className="text-xs text-[var(--color-text-muted)]">주</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
              <p className="text-2xl font-bold text-[var(--color-text)]">{result.hours.toLocaleString()}</p>
              <p className="text-xs text-[var(--color-text-muted)]">시간</p>
            </div>
          </div>

          {/* Save Button */}
          {eventName && (
            <button
              onClick={saveDday}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                font-medium transition-colors"
            >
              D-Day 저장하기
            </button>
          )}
        </div>
      )}

      {/* Saved D-Days */}
      {savedDdays.length > 0 && (
        <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <h3 className="font-medium text-[var(--color-text)] mb-3">📌 저장된 D-Day</h3>
          <div className="space-y-2">
            {savedDdays.map((dday, index) => {
              const target = new Date(dday.date);
              const today = new Date();
              const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-bg)]
                    cursor-pointer transition-colors"
                  onClick={() => loadDday(dday.date, dday.name)}
                >
                  <div>
                    <p className="text-[var(--color-text)] font-medium">{dday.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{dday.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${diff >= 0 ? 'text-primary-500' : 'text-[var(--color-text-muted)]'}`}>
                      D{diff >= 0 ? '-' : '+'}{Math.abs(diff)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDday(index);
                      }}
                      className="p-1 hover:bg-red-500/10 rounded text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
