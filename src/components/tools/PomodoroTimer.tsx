import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function PomodoroTimer() {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getDuration = useCallback((timerMode: TimerMode) => {
    switch (timerMode) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  }, [settings]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
    setIsRunning(false);
  }, [getDuration]);

  const playNotification = () => {
    // Play a simple beep sound
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);

      // Vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.log('Audio notification not supported');
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playNotification();

      if (mode === 'work') {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);

        if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('work');
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, completedSessions, settings.sessionsBeforeLongBreak, switchMode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const resetAll = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(settings.workDuration * 60);
    setCompletedSessions(0);
  };

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  const modeColors: Record<TimerMode, string> = {
    work: 'bg-red-500',
    shortBreak: 'bg-green-500',
    longBreak: 'bg-blue-500',
  };

  const modeLabels: Record<TimerMode, { ko: string; en: string; ja: string }> = {
    work: { ko: '집중', en: 'Focus', ja: '集中' },
    shortBreak: { ko: '짧은 휴식', en: 'Short Break', ja: '短い休憩' },
    longBreak: { ko: '긴 휴식', en: 'Long Break', ja: '長い休憩' },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-[var(--color-border)]">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((timerMode) => (
          <button
            key={timerMode}
            onClick={() => switchMode(timerMode)}
            className={`flex-1 py-3 font-medium transition-colors
              ${mode === timerMode
                ? `${modeColors[timerMode]} text-white`
                : 'bg-[var(--color-card)] text-[var(--color-text)] hover:bg-[var(--color-card-hover)]'
              }`}
          >
            {t(modeLabels[timerMode])}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center py-8">
        {/* Progress Ring */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-[var(--color-border)]"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className={`transition-all duration-1000 ${
                mode === 'work' ? 'text-red-500' :
                mode === 'shortBreak' ? 'text-green-500' : 'text-blue-500'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold text-[var(--color-text)]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-lg text-[var(--color-text-muted)] mt-2">
              {t(modeLabels[mode])}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-full font-medium text-white transition-colors text-lg
            ${isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-500 hover:bg-green-600'
            }`}
        >
          {isRunning
            ? t({ ko: '일시정지', en: 'Pause', ja: '一時停止' })
            : t({ ko: '시작', en: 'Start', ja: 'スタート' })}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 rounded-full font-medium bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
            border border-[var(--color-border)] transition-colors"
        >
          {t({ ko: '리셋', en: 'Reset', ja: 'リセット' })}
        </button>
      </div>

      {/* Session Counter */}
      <div className="flex justify-center items-center gap-2">
        <span className="text-[var(--color-text-muted)]">
          {t({ ko: '완료한 세션', en: 'Completed Sessions', ja: '完了したセッション' })}:
        </span>
        <div className="flex gap-1">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < (completedSessions % settings.sessionsBeforeLongBreak) || (completedSessions > 0 && completedSessions % settings.sessionsBeforeLongBreak === 0 && i < settings.sessionsBeforeLongBreak)
                  ? 'bg-red-500'
                  : 'bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>
        <span className="font-bold text-[var(--color-text)]">{completedSessions}</span>
        <button
          onClick={resetAll}
          className="ml-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          ({t({ ko: '초기화', en: 'Reset All', ja: 'すべてリセット' })})
        </button>
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {t({ ko: '설정', en: 'Settings', ja: '設定' })}
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'workDuration', label: { ko: '집중 시간', en: 'Focus Time', ja: '集中時間' }, suffix: t({ ko: '분', en: 'min', ja: '分' }) },
              { key: 'shortBreakDuration', label: { ko: '짧은 휴식', en: 'Short Break', ja: '短い休憩' }, suffix: t({ ko: '분', en: 'min', ja: '分' }) },
              { key: 'longBreakDuration', label: { ko: '긴 휴식', en: 'Long Break', ja: '長い休憩' }, suffix: t({ ko: '분', en: 'min', ja: '分' }) },
              { key: 'sessionsBeforeLongBreak', label: { ko: '긴 휴식까지', en: 'Sessions', ja: 'セッション数' }, suffix: t({ ko: '회', en: '', ja: '回' }) },
            ].map(({ key, label, suffix }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs text-[var(--color-text-muted)]">{t(label)}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings[key as keyof Settings]}
                    onChange={(e) => {
                      const newSettings = { ...settings, [key]: Number(e.target.value) };
                      setSettings(newSettings);
                      if (!isRunning) {
                        setTimeLeft(getDuration(mode));
                      }
                    }}
                    className="w-16 px-2 py-1 text-center rounded border border-[var(--color-border)]
                      bg-[var(--color-bg)] text-[var(--color-text)]"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">{suffix}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="text-xs text-primary-500 hover:underline"
          >
            {t({ ko: '기본값으로 복원', en: 'Reset to defaults', ja: 'デフォルトに戻す' })}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          {t({
            ko: '🍅 포모도로 기법: 25분 집중 후 5분 휴식. 4세션 후 긴 휴식을 취합니다. 생산성을 높이는 시간 관리 기법입니다.',
            en: '🍅 Pomodoro Technique: 25 minutes of focus followed by a 5-minute break. After 4 sessions, take a longer break. A time management method to boost productivity.',
            ja: '🍅 ポモドーロ・テクニック：25分の集中の後、5分の休憩。4セッション後に長い休憩を取ります。生産性を高める時間管理法です。',
          })}
        </p>
      </div>
    </div>
  );
}
