import { useState } from 'react';
import { calculateCompoundInterest, calculateLoan } from '../../../lib/media-calc/finance';
import { ToolShell, buttonClass, fieldClass } from './ToolShell';

const money = (value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
export default function LoanCalculatorTool() {
  const [mode, setMode] = useState<'loan' | 'compound'>('loan');
  const [amount, setAmount] = useState(12000); const [rate, setRate] = useState(0); const [years, setYears] = useState(1); const [monthly, setMonthly] = useState(100);
  const loan = calculateLoan(amount, rate, years); const compound = calculateCompoundInterest(amount, rate, years, monthly);
  return <ToolShell privacy="Your numbers stay in your browser; no financial data is sent anywhere.">
    <div role="tablist" aria-label="Calculator type" className="flex gap-2">
      <button role="tab" aria-selected={mode === 'loan'} className={buttonClass} onClick={() => setMode('loan')}>Loan</button>
      <button role="tab" aria-selected={mode === 'compound'} className={buttonClass} onClick={() => setMode('compound')}>Compound interest</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <label> {mode === 'loan' ? 'Loan amount' : 'Starting amount'}<input className={fieldClass} type="number" min="0" value={amount} onChange={(e) => setAmount(+e.target.value)} /></label>
      <label>Annual interest rate (%)<input className={fieldClass} type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
      <label>{mode === 'loan' ? 'Loan term (years)' : 'Investment term (years)'}<input className={fieldClass} type="number" min="0.1" value={years} onChange={(e) => setYears(+e.target.value)} /></label>
      {mode === 'compound' && <label>Monthly contribution<input className={fieldClass} type="number" min="0" value={monthly} onChange={(e) => setMonthly(+e.target.value)} /></label>}
    </div>
    <div aria-live="polite" className="rounded-lg bg-primary-500/10 p-4">
      {mode === 'loan' ? <><p>Monthly payment</p><strong className="text-2xl">{money(loan.monthlyPayment)}</strong><p>Total interest: {money(loan.totalInterest)}</p></> : <><p>Future value</p><strong className="text-2xl">{money(compound.futureValue)}</strong><p>Interest earned: {money(compound.interestEarned)}</p></>}
    </div>
  </ToolShell>;
}
