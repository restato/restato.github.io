import { useState, useCallback } from 'react';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
const WINNING_COMBOS: Record<string, { multiplier: number; name: string }> = {
  '7️⃣7️⃣7️⃣': { multiplier: 100, name: '잭팟!' },
  '💎💎💎': { multiplier: 50, name: '다이아몬드!' },
  '⭐⭐⭐': { multiplier: 25, name: '스타!' },
  '🍇🍇🍇': { multiplier: 15, name: '포도!' },
  '🍊🍊🍊': { multiplier: 10, name: '오렌지!' },
  '🍋🍋🍋': { multiplier: 8, name: '레몬!' },
  '🍒🍒🍒': { multiplier: 5, name: '체리!' },
};

export default function SlotMachine() {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [coins, setCoins] = useState(100);
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState<{ message: string; win: number } | null>(null);
  const [spinningReels, setSpinningReels] = useState([false, false, false]);

  const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  const spin = useCallback(() => {
    if (isSpinning || coins < bet) return;

    setCoins((prev) => prev - bet);
    setIsSpinning(true);
    setResult(null);
    setSpinningReels([true, true, true]);

    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // 릴 순차적으로 멈추기
    setTimeout(() => {
      setReels((prev) => [newReels[0], prev[1], prev[2]]);
      setSpinningReels([false, true, true]);
    }, 1000);

    setTimeout(() => {
      setReels((prev) => [prev[0], newReels[1], prev[2]]);
      setSpinningReels([false, false, true]);
    }, 1500);

    setTimeout(() => {
      setReels(newReels);
      setSpinningReels([false, false, false]);
      setIsSpinning(false);

      // 결과 확인
      const combo = newReels.join('');
      const winCombo = WINNING_COMBOS[combo];

      if (winCombo) {
        const winAmount = bet * winCombo.multiplier;
        setCoins((prev) => prev + winAmount);
        setResult({ message: winCombo.name, win: winAmount });
      } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2]) {
        const smallWin = Math.floor(bet * 1.5);
        setCoins((prev) => prev + smallWin);
        setResult({ message: '2개 일치!', win: smallWin });
      } else {
        setResult({ message: '다시 도전!', win: 0 });
      }
    }, 2000);
  }, [isSpinning, coins, bet]);

  const addCoins = () => {
    setCoins((prev) => prev + 50);
  };

  return (
    <div className="fc-game flex flex-col items-center">
      {/* 슬롯머신 본체 */}
      <div className="w-full max-w-lg rounded-3xl border-4 border-amber-400 bg-red-800 p-4 sm:p-8">
        {/* 상단 장식 */}
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-yellow-300 drop-shadow-lg">🎰 SLOTS 🎰</span>
        </div>

        {/* 릴 디스플레이 */}
        <div className="bg-black rounded-xl p-4 mb-6">
          <div className="flex gap-2 justify-center">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className="w-20 h-24 md:w-28 md:h-32 bg-white rounded-lg flex items-center justify-center text-5xl md:text-6xl shadow-inner border-2 border-gray-300"
              >
                <span
                  className={`transform transition-transform ${
                    spinningReels[index] ? 'animate-spin-slow blur-sm' : ''
                  }`}
                >
                  {symbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 결과 표시 */}
        {result && (
          <div
            className={`text-center p-3 rounded-lg mb-4 ${
              result.win > 0
                ? 'bg-yellow-400 text-black animate-pulse'
                : 'bg-gray-700 text-white'
            }`}
          >
            <div className="text-xl font-bold">{result.message}</div>
            {result.win > 0 && <div className="text-lg">+{result.win} 코인!</div>}
          </div>
        )}

        {/* 코인 및 베팅 정보 */}
        <div className="flex justify-between items-center mb-4 text-white">
          <div className="text-center">
            <div className="text-sm opacity-75">보유 코인</div>
            <div className="text-2xl font-bold text-yellow-300">💰 {coins}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-75">베팅</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBet(Math.max(5, bet - 5))}
                disabled={isSpinning || bet <= 5}
                aria-label="베팅 금액 줄이기"
                className="fc-button h-11 min-h-11 w-11 rounded-full bg-amber-400 p-0 text-black hover:bg-amber-300"
              >
                -
              </button>
              <span className="text-2xl font-bold w-12 text-center">{bet}</span>
              <button
                type="button"
                onClick={() => setBet(Math.min(coins, bet + 5))}
                disabled={isSpinning || bet >= coins}
                aria-label="베팅 금액 늘리기"
                className="fc-button h-11 min-h-11 w-11 rounded-full bg-amber-400 p-0 text-black hover:bg-amber-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 스핀 버튼 */}
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning || coins < bet}
          className="fc-button fc-button-primary w-full py-4 text-2xl"
        >
          {isSpinning ? '돌아가는 중...' : '🎲 SPIN!'}
        </button>

        {/* 코인 추가 버튼 */}
        {coins < 10 && (
          <button
            type="button"
            onClick={addCoins}
            className="fc-button fc-button-secondary mt-4 w-full"
          >
            +50 무료 코인 받기
          </button>
        )}
      </div>

      {/* 배당표 */}
      <div className="fc-surface mt-8 w-full max-w-md p-6">
        <h3 className="font-bold text-lg mb-4 text-center">💎 배당표</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(WINNING_COMBOS)
            .sort((a, b) => b[1].multiplier - a[1].multiplier)
            .map(([combo, { multiplier }]) => (
              <div
                key={combo}
                className="flex items-center justify-between p-2 bg-[var(--color-border)] rounded"
              >
                <span>{combo}</span>
                <span className="font-bold text-yellow-500">x{multiplier}</span>
              </div>
            ))}
          <div className="flex items-center justify-between p-2 bg-[var(--color-border)] rounded col-span-2">
            <span>2개 일치</span>
            <span className="font-bold text-yellow-500">x1.5</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotateX(0deg); }
          to { transform: rotateX(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 0.1s linear infinite;
        }
      `}</style>
    </div>
  );
}
