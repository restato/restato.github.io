export interface LoanResult { monthlyPayment: number; totalPayment: number; totalInterest: number }
export interface CompoundResult { futureValue: number; contributions: number; interestEarned: number }

export function calculateLoan(principal: number, annualRate: number, years: number): LoanResult {
  const months = Math.max(1, Math.round(years * 12));
  const rate = annualRate / 1200;
  const monthlyPayment = rate === 0
    ? principal / months
    : principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
  const totalPayment = monthlyPayment * months;
  return { monthlyPayment, totalPayment, totalInterest: totalPayment - principal };
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  monthlyContribution = 0,
): CompoundResult {
  const months = Math.max(0, Math.round(years * 12));
  const rate = annualRate / 1200;
  const futurePrincipal = principal * (1 + rate) ** months;
  const futureContributions = rate === 0
    ? monthlyContribution * months
    : monthlyContribution * (((1 + rate) ** months - 1) / rate);
  const futureValue = futurePrincipal + futureContributions;
  const contributions = principal + monthlyContribution * months;
  return { futureValue, contributions, interestEarned: futureValue - contributions };
}
