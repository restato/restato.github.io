import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface Person {
  id: string;
  name: string;
  paid: number;
  shouldPay: number;
}

export default function DutchPayCalculator() {
  const { t } = useTranslation();
  const personName = (index: number) => t({ ko: `참가자 ${index}`, en: `Person ${index}`, ja: `参加者 ${index}` });
  const currency = t({ ko: '원', en: 'currency units', ja: '通貨単位' });
  const [totalAmount, setTotalAmount] = useState('');
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: personName(1), paid: 0, shouldPay: 0 },
    { id: '2', name: personName(2), paid: 0, shouldPay: 0 },
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addPerson = () => {
    const newId = String(Date.now());
    setPeople([
      ...people,
      { id: newId, name: personName(people.length + 1), paid: 0, shouldPay: 0 },
    ]);
  };

  const removePerson = (id: string) => {
    if (people.length <= 2) return;
    setPeople(people.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: 'name' | 'paid', value: string | number) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const total = parseFloat(totalAmount) || 0;
  const perPerson = people.length > 0 ? total / people.length : 0;
  const totalPaid = people.reduce((sum, p) => sum + (p.paid || 0), 0);

  // Calculate who owes whom
  const calculateSettlements = () => {
    const balances = people.map((p) => ({
      name: p.name,
      balance: (p.paid || 0) - perPerson,
    }));

    const settlements: Array<{ from: string; to: string; amount: number }> = [];
    const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(-debtor.balance, creditor.balance);

      if (amount > 0) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount),
        });
      }

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 1) i++;
      if (Math.abs(creditor.balance) < 1) j++;
    }

    return settlements;
  };

  const settlements = total > 0 ? calculateSettlements() : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Total Amount */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '총 금액', en: 'Total amount', ja: '合計金額' })}
        </label>
        <div className="relative">
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="50000"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            {currency}
          </span>
        </div>
      </div>

      {/* Quick Split Display */}
      {total > 0 && (
        <div className="p-4 rounded-lg bg-primary-500/10 border border-primary-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">{t({ ko: '1인당 금액', en: 'Per person', ja: '1人あたり' })}</p>
              <p className="text-3xl font-bold text-primary-500">
                {Math.ceil(perPerson).toLocaleString()} {currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--color-text-muted)]">{t({ ko: '참가자', en: 'People', ja: '参加者' })}</p>
              <p className="text-3xl font-bold text-[var(--color-text)]">{people.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick People Count */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '인원수', en: 'Number of people', ja: '人数' })}
        </label>
        <div className="flex flex-wrap gap-2">
          {[2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
            <button
              key={num}
              onClick={() => {
                const newPeople = Array.from({ length: num }, (_, i) => ({
                  id: String(i + 1),
                  name: personName(i + 1),
                  paid: 0,
                  shouldPay: 0,
                }));
                setPeople(newPeople);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${people.length === num
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {t({ ko: `${num}명`, en: `${num} people`, ja: `${num}人` })}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Mode Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-primary-500 hover:underline text-left"
      >
        {showAdvanced ? t({ ko: '▼ 간단하게 보기', en: '▼ Show simple split', ja: '▼ 簡易表示' }) : t({ ko: '▶ 각자 낸 금액 입력하기 (정산)', en: '▶ Enter individual payments', ja: '▶ 個別の支払額を入力' })}
      </button>

      {/* Advanced Mode - Individual Payments */}
      {showAdvanced && (
        <div className="space-y-4">
          <div className="space-y-3">
            {people.map((person, index) => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]"
              >
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)]
                    bg-[var(--color-bg)] text-[var(--color-text)] text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="relative w-32">
                  <input
                    type="number"
                    value={person.paid || ''}
                    onChange={(e) => updatePerson(person.id, 'paid', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 pr-8 rounded-lg border border-[var(--color-border)]
                      bg-[var(--color-bg)] text-[var(--color-text)] text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                    {currency}
                  </span>
                </div>
                <button
                  onClick={() => removePerson(person.id)}
                  disabled={people.length <= 2}
                  className="p-2 hover:bg-red-500/10 rounded text-red-500 disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addPerson}
            className="w-full py-2 border-2 border-dashed border-[var(--color-border)]
              rounded-lg text-[var(--color-text-muted)] hover:border-primary-500
              hover:text-primary-500 transition-colors"
          >
            + {t({ ko: '참가자 추가', en: 'Add person', ja: '参加者を追加' })}
          </button>

          {/* Settlement Results */}
          {settlements.length > 0 && (
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
              <h3 className="font-medium text-[var(--color-text)] mb-3">💸 {t({ ko: '정산 방법', en: 'Settlement plan', ja: '精算方法' })}</h3>
              <div className="space-y-2">
                {settlements.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-bg)]"
                  >
                    <span className="text-[var(--color-text)]">{s.from}</span>
                    <span className="text-[var(--color-text-muted)]">→</span>
                    <span className="text-[var(--color-text)]">{s.to}</span>
                    <span className="ml-auto font-bold text-primary-500">
                      {s.amount.toLocaleString()} {currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {totalPaid > 0 && (
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">{t({ ko: '총 결제 금액', en: 'Total paid', ja: '支払総額' })}</span>
                <span className="text-[var(--color-text)]">{totalPaid.toLocaleString()} {currency}</span>
              </div>
              {totalPaid !== total && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-[var(--color-text-muted)]">{t({ ko: '차액', en: 'Difference', ja: '差額' })}</span>
                  <span className={totalPaid > total ? 'text-green-500' : 'text-red-500'}>
                    {totalPaid > total ? '+' : ''}{(totalPaid - total).toLocaleString()} {currency}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Common Scenarios */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-3">💡 {t({ ko: '빠른 계산', en: 'Quick examples', ja: 'クイック計算' })}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: t({ ko: '치킨 2마리', en: 'Dinner for 4', ja: '4人の夕食' }), amount: 40000, people: 4 },
            { label: t({ ko: '삼겹살 4인분', en: 'Meal for 4', ja: '4人分の食事' }), amount: 60000, people: 4 },
            { label: t({ ko: '회식 (6인)', en: 'Team meal (6)', ja: '会食（6人）' }), amount: 300000, people: 6 },
            { label: t({ ko: '카페 (3인)', en: 'Cafe (3)', ja: 'カフェ（3人）' }), amount: 30000, people: 3 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setTotalAmount(String(item.amount));
                setPeople(
                  Array.from({ length: item.people }, (_, i) => ({
                    id: String(i + 1),
                    name: personName(i + 1),
                    paid: 0,
                    shouldPay: 0,
                  }))
                );
              }}
              className="px-3 py-2 rounded-lg text-left hover:bg-[var(--color-card-hover)]
                text-[var(--color-text-muted)] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
