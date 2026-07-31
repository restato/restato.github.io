import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import RouletteWheel, { type RouletteItem } from './RouletteWheel';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
  '#FF9F43', '#EE5A24', '#0984E3', '#6C5CE7',
];

interface Winner {
  text: string;
  timestamp: Date;
}

export default function EventRoulette() {
  const { t } = useTranslation();
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [excludeWinners, setExcludeWinners] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spinRequest, setSpinRequest] = useState(0);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  // Parse bulk input
  const handleBulkInput = () => {
    const names = bulkInput
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    // Remove duplicates
    const uniqueNames = [...new Set(names)];

    const newItems: RouletteItem[] = uniqueNames.map((name, idx) => ({
      id: `${Date.now()}-${idx}`,
      text: name,
      color: COLORS[idx % COLORS.length],
    }));

    setItems(newItems);
    setWinner(null);
    setWinners([]);
  };

  // Clear all
  const clearAll = () => {
    setBulkInput('');
    setItems([]);
    setWinner(null);
    setWinners([]);
  };

  // Handle spin end
  const handleSpinEnd = useCallback((winnerItem: RouletteItem) => {
    setWinner(winnerItem.text);
    setWinners(prev => [...prev, { text: winnerItem.text, timestamp: new Date() }]);

    // Remove winner if excludeWinners is enabled
    if (excludeWinners) {
      setItems(prev => prev.filter(item => item.id !== winnerItem.id));
    }
  }, [excludeWinners]);

  // Reset winners
  const resetWinners = () => {
    // Restore all items from bulk input
    handleBulkInput();
    setWinners([]);
    setWinner(null);
  };

  // Available items count
  const availableCount = items.length;

  return (
    <div
      className={`fc-game ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto bg-[var(--surface-page)] p-4' : ''}`}
      role={isFullscreen ? 'region' : undefined}
      aria-label={isFullscreen
        ? t({ ko: '이벤트 룰렛 전체화면', en: 'Event roulette fullscreen', ja: 'イベントルーレット全画面' })
        : undefined}
    >
      <div className={`flex flex-col lg:flex-row gap-6 w-full ${isFullscreen ? '' : 'max-w-6xl mx-auto px-4'}`}>
        {/* Wheel Section */}
        <div className="flex-1 flex flex-col items-center">
          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="fc-button fc-button-secondary mb-2 self-end text-sm"
          >
            {isFullscreen
              ? t({ ko: '전체화면 종료', en: 'Exit Fullscreen', ja: '全画面終了' })
              : t({ ko: '전체화면', en: 'Fullscreen', ja: '全画面' })}
          </button>

          {items.length >= 2 ? (
            <>
              <RouletteWheel
                items={items}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                onSpinEnd={handleSpinEnd}
                size={isFullscreen ? 500 : 320}
                spinRequest={spinRequest}
                spinLabel={t({ ko: '룰렛 돌리기', en: 'Spin roulette wheel', ja: 'ルーレットを回す' })}
              />

              {/* Spin Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isSpinning && items.length >= 2) {
                    setWinner(null);
                    setSpinRequest(request => request + 1);
                  }
                }}
                disabled={isSpinning || items.length < 2}
                className="fc-button fc-button-primary mt-6 px-8 text-xl"
              >
                {isSpinning
                  ? t({ ko: '추첨 중...', en: 'Drawing...', ja: '抽選中...' })
                  : t({ ko: '🎲 추첨하기!', en: '🎲 Draw!', ja: '🎲 抽選！' })}
              </button>

              {/* Participant count */}
              <p className="mt-4 text-[var(--color-text-muted)]">
                {t({ ko: '남은 참가자', en: 'Remaining', ja: '残り参加者' })}: <span className="font-bold text-primary-500">{availableCount}</span>{t({ ko: '명', en: '', ja: '人' })}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-[var(--color-text-muted)]">
              <div className="text-6xl mb-4">🎡</div>
              <p>{t({ ko: '참가자를 추가해주세요', en: 'Add participants', ja: '参加者を追加してください' })}</p>
              <p className="text-sm">{t({ ko: '(최소 2명 이상)', en: '(minimum 2)', ja: '(最低2人以上)' })}</p>
            </div>
          )}

          {/* Winner Display */}
          {winner && (
            <div className="fc-surface fc-surface-soft mt-6 p-6 text-center" role="status">
              <div className="text-2xl mb-2">🎉 {t({ ko: '당첨!', en: 'Winner!', ja: '当選!' })}</div>
              <div className="text-4xl font-bold text-[var(--accent)]">{winner}</div>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className={`w-full ${isFullscreen ? 'lg:w-96' : 'lg:w-80'} space-y-4`}>
          {/* Bulk Input */}
          <div className="fc-surface p-4">
            <h3 className="font-bold mb-3">
              {t({ ko: '참가자 입력', en: 'Add Participants', ja: '参加者入力' })}
            </h3>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              aria-label={t({ ko: '참가자 입력', en: 'Participant input', ja: '参加者入力' })}
              placeholder={t({
                ko: '이름을 입력하세요\n(줄바꿈 또는 쉼표로 구분)\n\n예시:\n홍길동\n김철수, 이영희\n박민수',
                en: 'Enter names\n(separated by newlines or commas)\n\nExample:\nJohn\nJane, Bob\nAlice',
                ja: '名前を入力\n(改行またはカンマで区切り)\n\n例:\n太郎\n花子, 次郎\n三郎',
              })}
              className="fc-textarea h-40 text-sm"
            />

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleBulkInput}
                disabled={!bulkInput.trim()}
                className="fc-button fc-button-primary flex-1"
              >
                {t({ ko: '적용', en: 'Apply', ja: '適用' })}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="fc-button fc-button-secondary"
              >
                {t({ ko: '초기화', en: 'Clear', ja: 'クリア' })}
              </button>
            </div>

            {/* Stats */}
            {bulkInput && (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {t({ ko: '입력된 이름', en: 'Names entered', ja: '入力された名前' })}: {
                  [...new Set(bulkInput.split(/[\n,]/).map(n => n.trim()).filter(n => n))].length
                }{t({ ko: '명', en: '', ja: '人' })}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="fc-surface p-4">
            <h3 className="font-bold mb-3">
              {t({ ko: '옵션', en: 'Options', ja: 'オプション' })}
            </h3>
            <label className="fc-tool-field cursor-pointer">
              <input
                type="checkbox"
                checked={excludeWinners}
                onChange={(e) => setExcludeWinners(e.target.checked)}
                className="fc-check"
              />
              <span className="text-sm">
                {t({
                  ko: '당첨자 자동 제외',
                  en: 'Auto-exclude winners',
                  ja: '当選者を自動除外',
                })}
              </span>
            </label>
          </div>

          {/* Winner History */}
          {winners.length > 0 && (
            <div className="fc-surface p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">
                  {t({ ko: '당첨 기록', en: 'Winner History', ja: '当選履歴' })} ({winners.length})
                </h3>
                <button
                  type="button"
                  onClick={resetWinners}
                  className="fc-button fc-button-quiet text-sm"
                >
                  {t({ ko: '초기화', en: 'Reset', ja: 'リセット' })}
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {winners.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-[var(--color-bg)] rounded-lg"
                  >
                    <span className="flex items-center gap-2">
                      <span data-contrast-target="roulette-history-rank" className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--surface-soft)] text-xs font-bold text-[var(--accent)]">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{w.text}</span>
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {w.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Participants */}
          {items.length > 0 && (
            <div className="fc-surface p-4">
              <h3 className="font-bold mb-3">
                {t({ ko: '참가자 목록', en: 'Participants', ja: '参加者リスト' })} ({items.length})
              </h3>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {items.map(item => (
                  <span
                    key={item.id}
                    data-contrast-target="roulette-participant"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--surface-soft)] px-2 py-1 text-xs font-medium text-[var(--color-text)]"
                  >
                    <span
                      aria-hidden="true"
                      data-roulette-palette-dot
                      className="h-2.5 w-2.5 rounded-full border border-[var(--color-border)]"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
