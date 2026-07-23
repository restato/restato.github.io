import { useState, useRef, useCallback } from 'react';

interface RouletteItem {
  id: string;
  text: string;
  color: string;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
];

export default function Roulette() {
  const [items, setItems] = useState<RouletteItem[]>([
    { id: '1', text: '항목 1', color: COLORS[0] },
    { id: '2', text: '항목 2', color: COLORS[1] },
    { id: '3', text: '항목 3', color: COLORS[2] },
    { id: '4', text: '항목 4', color: COLORS[3] },
  ]);
  const [newItem, setNewItem] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    if (newItem.trim() && items.length < 12) {
      const newId = Date.now().toString();
      setItems([
        ...items,
        {
          id: newId,
          text: newItem.trim(),
          color: COLORS[items.length % COLORS.length],
        },
      ]);
      setNewItem('');
    }
  };

  const removeItem = (id: string) => {
    if (items.length > 2) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const spin = useCallback(() => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const spins = 5 + Math.random() * 5;
    const extraDegrees = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + extraDegrees;

    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentAngle = 360 / items.length;
      const pointerOffset = 90;
      const adjustedRotation = (360 - normalizedRotation + pointerOffset) % 360;
      const winningIndex = Math.floor(adjustedRotation / segmentAngle) % items.length;

      setWinner(items[winningIndex].text);
      setIsSpinning(false);
    }, 4000);
  }, [isSpinning, items, rotation]);

  const reset = () => {
    setWinner(null);
    setRotation(0);
  };

  return (
    <div className="fc-game flex w-full min-w-0 flex-col items-start gap-8 lg:flex-row">
      {/* Wheel */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative aspect-square w-full max-w-96">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <div
            ref={wheelRef}
            className="relative aspect-square w-full overflow-hidden rounded-full border border-[var(--border-subtle)]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {items.map((item, index) => {
              const segmentAngle = 360 / items.length;
              const startAngle = index * segmentAngle;

              return (
                <div
                  key={item.id}
                  className="absolute w-full h-full"
                  style={{
                    background: `conic-gradient(from ${startAngle}deg, ${item.color} 0deg, ${item.color} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 origin-left text-white font-bold text-sm md:text-base whitespace-nowrap"
                    style={{
                      transform: `rotate(${startAngle + segmentAngle / 2}deg) translateX(30%)`,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              );
            })}
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning || items.length < 2}
          className="fc-button fc-button-primary mt-8 px-8 text-xl"
        >
          {isSpinning ? '돌아가는 중...' : '🎲 돌리기!'}
        </button>

        {/* Winner */}
        {winner && (
          <div className="fc-surface fc-surface-soft mt-6 p-6 text-center" role="status">
            <div className="text-2xl mb-2">🎉 당첨!</div>
            <div className="text-3xl font-bold text-[var(--accent)]">{winner}</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="fc-surface p-4">
          <h3 className="font-bold mb-4">항목 관리</h3>

          {/* Add Item */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') addItem();
              }}
              placeholder="새 항목 입력"
              aria-label="새 항목"
              className="fc-input flex-1"
              disabled={items.length >= 12}
            />
            <button
              type="button"
              onClick={addItem}
              disabled={!newItem.trim() || items.length >= 12}
              className="fc-button fc-button-primary"
            >
              추가
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="fc-surface-soft flex items-center gap-2 rounded-lg p-2"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 truncate">{item.text}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 2}
                  aria-label={`${item.text} 삭제`}
                  className="fc-button fc-button-quiet min-h-11 px-3 text-[var(--accent)]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {items.length}/12 항목 (최소 2개 필요)
          </p>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={reset}
          className="fc-button fc-button-secondary w-full"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
