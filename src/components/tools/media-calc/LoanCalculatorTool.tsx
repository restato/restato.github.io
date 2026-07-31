import { useState } from 'react';
import { calculateCompoundInterest, calculateLoan } from '../../../lib/media-calc/finance';
import { ToolShell, ToolStatus } from './ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

const money = (value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
export default function LoanCalculatorTool() {
  const [mode, setMode] = useState<'loan' | 'compound'>('loan');
  const [amount, setAmount] = useState(12000); const [rate, setRate] = useState(0); const [years, setYears] = useState(1); const [monthly, setMonthly] = useState(100);
  const loan = calculateLoan(amount, rate, years); const compound = calculateCompoundInterest(amount, rate, years, monthly);
  return <ToolShell>
    <ToolActions
      selection
      primary={<button role="tab" aria-selected={mode === 'loan'} aria-pressed={mode === 'loan'} onClick={() => setMode('loan')}>Loan</button>}
      secondary={<button role="tab" aria-selected={mode === 'compound'} aria-pressed={mode === 'compound'} onClick={() => setMode('compound')}>Compound interest</button>}
      className="fc-segmented-control"
    />
    <div className="grid gap-4 sm:grid-cols-3">
      <ToolField id="loan-amount" label={mode === 'loan' ? 'Loan amount' : 'Starting amount'}><input type="number" min="0" value={amount} onChange={(e) => setAmount(+e.target.value)} /></ToolField>
      <ToolField id="loan-rate" label="Annual interest rate (%)"><input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} /></ToolField>
      <ToolField id="loan-years" label={mode === 'loan' ? 'Loan term (years)' : 'Investment term (years)'}><input type="number" min="0.1" value={years} onChange={(e) => setYears(+e.target.value)} /></ToolField>
      {mode === 'compound' && <ToolField id="loan-monthly" label="Monthly contribution"><input type="number" min="0" value={monthly} onChange={(e) => setMonthly(+e.target.value)} /></ToolField>}
    </div>
    <ToolStatus status="success">
      {mode === 'loan' ? <><p>Monthly payment</p><strong className="text-2xl">{money(loan.monthlyPayment)}</strong><p>Total interest: {money(loan.totalInterest)}</p></> : <><p>Future value</p><strong className="text-2xl">{money(compound.futureValue)}</strong><p>Interest earned: {money(compound.interestEarned)}</p></>}
    </ToolStatus>
  </ToolShell>;
}
