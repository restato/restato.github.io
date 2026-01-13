import { useState, useEffect } from 'react';

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [savedAmount, setSavedAmount] = useState('');

  useEffect(() => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (!isNaN(price) && !isNaN(discount)) {
      const saved = price * (discount / 100);
      const final = price - saved;
      setSavedAmount(saved.toLocaleString('ko-KR', { maximumFractionDigits: 0 }));
      setFinalPrice(final.toLocaleString('ko-KR', { maximumFractionDigits: 0 }));
    } else {
      setSavedAmount('');
      setFinalPrice('');
    }
  }, [originalPrice, discountPercent]);

  const quickDiscounts = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90];

  return (
    <div className="flex flex-col gap-6">
      {/* Original Price */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          원래 가격
        </label>
        <div className="relative">
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="10000"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            원
          </span>
        </div>
      </div>

      {/* Discount Percent */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          할인율
        </label>
        <div className="relative">
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="20"
            min="0"
            max="100"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            %
          </span>
        </div>

        {/* Quick Discount Buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {quickDiscounts.map((d) => (
            <button
              key={d}
              onClick={() => setDiscountPercent(String(d))}
              className={`px-3 py-1 rounded-lg text-sm transition-colors
                ${discountPercent === String(d)
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-bg)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {d}%
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {finalPrice && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Saved Amount */}
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">할인 금액</p>
              <p className="text-2xl font-bold text-red-500">
                -{savedAmount}원
              </p>
            </div>

            {/* Final Price */}
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">최종 가격</p>
              <p className="text-2xl font-bold text-green-500">
                {finalPrice}원
              </p>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">원래 가격</span>
              <span className="text-[var(--color-text)] line-through">
                {parseFloat(originalPrice).toLocaleString('ko-KR')}원
              </span>
            </div>
            <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-primary-500 transition-all duration-300"
                style={{ width: `${100 - parseFloat(discountPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-[var(--color-text-muted)]">
                {discountPercent}% 할인 적용
              </span>
              <span className="text-green-500 font-bold">{finalPrice}원</span>
            </div>
          </div>
        </div>
      )}

      {/* Common Discount Scenarios */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-3">💡 자주 쓰는 할인</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: '1+1 행사', discount: 50 },
            { label: '반값 할인', discount: 50 },
            { label: '블프 세일', discount: 70 },
            { label: '신규가입 혜택', discount: 10 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setDiscountPercent(String(item.discount))}
              className="px-3 py-2 rounded-lg text-left hover:bg-[var(--color-card-hover)]
                text-[var(--color-text-muted)] transition-colors"
            >
              {item.label} ({item.discount}%)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
