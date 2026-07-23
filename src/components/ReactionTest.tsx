import { useState, useCallback, useRef } from 'react';

type GameState = 'ready' | 'waiting' | 'click' | 'result' | 'too-early';

export default function ReactionTest() {
  const [state, setState] = useState<GameState>('ready');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setState('waiting');

    // 랜덤 대기 시간 (2-5초)
    const waitTime = 2000 + Math.random() * 3000;

    // 카운트다운 (대략적)
    let remaining = 3;
    setCountdown(remaining);
    const countdownInterval = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);
      }
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(countdownInterval);
      setCountdown(null);
      setState('click');
      startTimeRef.current = Date.now();
    }, waitTime);
  }, []);

  const handleClick = useCallback(() => {
    if (state === 'ready' || state === 'result' || state === 'too-early') {
      startGame();
    } else if (state === 'waiting') {
      // 너무 빨리 클릭
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setState('too-early');
      setReactionTime(null);
    } else if (state === 'click') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setResults((prev) => [...prev.slice(-9), time]);
      setState('result');
    }
  }, [state, startGame]);

  const getAverageTime = () => {
    if (results.length === 0) return null;
    return Math.round(results.reduce((a, b) => a + b, 0) / results.length);
  };

  const getBestTime = () => {
    if (results.length === 0) return null;
    return Math.min(...results);
  };

  const getRank = (time: number) => {
    if (time < 150) return { rank: 'S', label: '신급!', color: 'text-yellow-400', emoji: '⚡' };
    if (time < 200) return { rank: 'A', label: '매우 빠름', color: 'text-green-400', emoji: '🚀' };
    if (time < 250) return { rank: 'B', label: '빠름', color: 'text-blue-400', emoji: '💨' };
    if (time < 300) return { rank: 'C', label: '보통', color: 'text-[var(--accent)]', emoji: '👍' };
    if (time < 400) return { rank: 'D', label: '느림', color: 'text-orange-400', emoji: '🐢' };
    return { rank: 'F', label: '매우 느림', color: 'text-red-400', emoji: '😴' };
  };

  const getBackgroundColor = () => {
    switch (state) {
      case 'waiting':
        return 'bg-red-500';
      case 'click':
        return 'bg-green-500';
      case 'too-early':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStateText = () => {
    switch (state) {
      case 'ready':
        return { main: '클릭하여 시작', sub: '반응속도를 측정해보세요' };
      case 'waiting':
        return { main: '기다리세요...', sub: countdown ? `준비 ${countdown}` : '초록색이 되면 클릭!' };
      case 'click':
        return { main: '지금!', sub: '클릭하세요!' };
      case 'too-early':
        return { main: '너무 빨라요!', sub: '초록색이 될 때까지 기다리세요' };
      case 'result':
        return { main: `${reactionTime}ms`, sub: getRank(reactionTime!).label };
    }
  };

  const resetResults = () => {
    setResults([]);
    setReactionTime(null);
    setState('ready');
  };

  const stateText = getStateText();
  const rank = reactionTime ? getRank(reactionTime) : null;

  return (
    <div className="fc-game mx-auto max-w-lg">
      {/* 메인 클릭 영역 */}
      <button
        type="button"
        onClick={handleClick}
        className={`fc-button h-64 w-full flex-col rounded-2xl text-white md:h-80 ${getBackgroundColor()}`}
      >
        {state === 'result' && rank && (
          <div className="text-6xl mb-4 animate-bounce">{rank.emoji}</div>
        )}
        <div className="text-4xl md:text-5xl font-bold mb-2">{stateText.main}</div>
        <div className="text-lg opacity-90">{stateText.sub}</div>
        {state === 'result' && rank && (
          <div className={`mt-4 text-2xl font-bold ${rank.color}`}>
            랭크: {rank.rank}
          </div>
        )}
      </button>

      {/* 통계 */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="fc-surface p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {getBestTime() ? `${getBestTime()}ms` : '-'}
          </div>
          <div className="text-sm text-[var(--color-text-muted)]">최고 기록</div>
        </div>
        <div className="fc-surface p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">
            {getAverageTime() ? `${getAverageTime()}ms` : '-'}
          </div>
          <div className="text-sm text-[var(--color-text-muted)]">평균</div>
        </div>
        <div className="fc-surface p-4 text-center">
          <div className="text-2xl font-bold text-[var(--accent)]">{results.length}</div>
          <div className="text-sm text-[var(--color-text-muted)]">시도</div>
        </div>
      </div>

      {/* 최근 기록 */}
      {results.length > 0 && (
        <div className="fc-surface mt-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">최근 기록</h3>
            <button
              type="button"
              onClick={resetResults}
              className="fc-button fc-button-quiet text-sm text-[var(--accent)]"
            >
              초기화
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((time, index) => {
              const timeRank = getRank(time);
              return (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    time === getBestTime()
                      ? 'bg-yellow-500/20 border border-yellow-500'
                      : 'bg-[var(--color-border)]'
                  }`}
                >
                  <span className={timeRank.color}>{time}ms</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 랭크 설명 */}
      <div className="fc-surface mt-6 p-4">
        <h3 className="font-bold mb-4 text-center">랭크 기준</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {[
            { range: '< 150ms', rank: 'S', color: 'text-yellow-400' },
            { range: '< 200ms', rank: 'A', color: 'text-green-400' },
            { range: '< 250ms', rank: 'B', color: 'text-blue-400' },
            { range: '< 300ms', rank: 'C', color: 'text-[var(--accent)]' },
            { range: '< 400ms', rank: 'D', color: 'text-orange-400' },
            { range: '400ms+', rank: 'F', color: 'text-red-400' },
          ].map(({ range, rank, color }) => (
            <div
              key={rank}
              className="flex items-center justify-between p-2 bg-[var(--color-border)] rounded"
            >
              <span className="text-[var(--color-text-muted)]">{range}</span>
              <span className={`font-bold ${color}`}>{rank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 팁 */}
      <div className="fc-surface fc-surface-soft mt-6 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-[var(--color-text-muted)]">
            <p className="font-bold mb-1">팁</p>
            <p>인간의 평균 반응속도는 약 200-250ms입니다. 꾸준히 연습하면 반응속도가 향상될 수 있어요!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
