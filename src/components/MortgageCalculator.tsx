import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { MortgageParams } from '../types';
import { calculateMortgage, formatINR, formatUSD, calculateInvestmentReturn } from '../utils/mortgage';
import { saveEncryptedStorage } from '../utils/crypto';
import { COMPANY_INFO } from '../data/mockData';

interface MortgageCalculatorProps {
  initialPrice?: number;
  currency: 'INR' | 'USD';
  onContactAgent: (message: string) => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  initialPrice = 68000000, // Default 6.80 Cr
  currency,
  onContactAgent,
}) => {
  const [homePrice, setHomePrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [propertyTaxRatePct, setPropertyTaxRatePct] = useState<number>(0.5);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(36000);
  const [maintenanceMonthly, setMaintenanceMonthly] = useState<number>(8000);

  // Investment projection settings
  const [projectedAppreciationPct, setProjectedAppreciationPct] = useState<number>(12.5);
  const [projectedRentalYieldPct, setProjectedRentalYieldPct] = useState<number>(5.5);

  const [showAmortization, setShowAmortization] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync if initialPrice changes externally
  React.useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setHomePrice(initialPrice);
    }
  }, [initialPrice]);

  const mortgageParams: MortgageParams = useMemo(() => ({
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    propertyTaxRatePct,
    homeInsuranceAnnual,
    maintenanceMonthly,
  }), [
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTermYears,
    propertyTaxRatePct,
    homeInsuranceAnnual,
    maintenanceMonthly,
  ]);

  const result = useMemo(() => calculateMortgage(mortgageParams), [mortgageParams]);
  
  const investmentProjection = useMemo(() => {
    return calculateInvestmentReturn(
      homePrice,
      projectedAppreciationPct,
      projectedRentalYieldPct,
      5
    );
  }, [homePrice, projectedAppreciationPct, projectedRentalYieldPct]);

  const principalPct = Math.round((result.loanAmount / (result.totalLoanPayment || 1)) * 100);
  const interestPct = Math.max(0, 100 - principalPct);

  const handleSaveToEncryptedVault = async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      homePrice,
      downPaymentPercent,
      interestRate,
      loanTermYears,
      monthlyPayment: result.totalMonthlyPayment,
      totalInterest: result.totalInterestPaid,
    };
    await saveEncryptedStorage('last_mortgage_plan', payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <section id="mortgage-section" className="py-12 bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Investment & Financing Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Nilgiris Luxury Mortgage & ROI Calculator
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Calculate accurate monthly repayments, amortization timelines, and 5-year capital appreciation projections for prime Nilgiris estates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (7 Cols on LG) */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <span>Financing Parameters</span>
              </h3>
              <span className="text-xs text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-medium">
                Standard Indian Home Loan Base
              </span>
            </div>

            {/* Home Price Input & Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="mortgage-price-input" className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Estate Purchase Price
                </label>
                <span className="font-mono text-base font-bold text-amber-400">
                  {currency === 'INR' ? formatINR(homePrice) : formatUSD(homePrice)}
                </span>
              </div>
              <input
                id="mortgage-price-input"
                aria-label="Estate Purchase Price"
                type="range"
                min={1500000}
                max={400000000}
                step={500000}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-500 mt-1 font-mono">
                <span>₹15 Lakhs</span>
                <span>₹10.0 Cr</span>
                <span>₹40.0 Cr+</span>
              </div>
            </div>

            {/* Down Payment (% and calculated amount) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="down-payment-input" className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Down Payment ({downPaymentPercent}%)
                </label>
                <span className="font-mono text-sm font-semibold text-stone-200">
                  {currency === 'INR' ? formatINR(result.downPaymentAmount) : formatUSD(result.downPaymentAmount)}
                </span>
              </div>
              <input
                id="down-payment-input"
                aria-label="Down Payment Percentage"
                type="range"
                min={10}
                max={60}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-500 mt-1 font-mono">
                <span>10% (Min)</span>
                <span>20% (Recommended)</span>
                <span>60%</span>
              </div>
            </div>

            {/* Interest Rate & Loan Tenure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="interest-rate-input" className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    Annual Interest Rate
                  </label>
                  <span className="font-mono text-sm font-bold text-amber-400">{interestRate}%</span>
                </div>
                <input
                  id="interest-rate-input"
                  aria-label="Annual Interest Rate"
                  type="number"
                  step="0.1"
                  min="6.0"
                  max="15.0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="loan-tenure-select" className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    Loan Tenure (Years)
                  </label>
                  <span className="font-mono text-sm font-bold text-stone-200">{loanTermYears} Yrs</span>
                </div>
                <select
                  id="loan-tenure-select"
                  aria-label="Loan Tenure in Years"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  <option value={10}>10 Years (120 Months)</option>
                  <option value={15}>15 Years (180 Months)</option>
                  <option value={20}>20 Years (240 Months)</option>
                  <option value={25}>25 Years (300 Months)</option>
                  <option value={30}>30 Years (360 Months)</option>
                </select>
              </div>
            </div>

            {/* Additional Costs: Maintenance & Property Tax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="tax-rate-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                  Property Tax Rate (%/yr)
                </label>
                <input
                  id="tax-rate-input"
                  type="number"
                  step="0.1"
                  value={propertyTaxRatePct}
                  onChange={(e) => setPropertyTaxRatePct(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label htmlFor="estate-maintenance-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                  Estate Maintenance (₹/mo)
                </label>
                <input
                  id="estate-maintenance-input"
                  type="number"
                  step="1000"
                  value={maintenanceMonthly}
                  onChange={(e) => setMaintenanceMonthly(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleSaveToEncryptedVault}
                className="px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 text-xs font-medium text-stone-200 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{savedSuccess ? 'Plan Encrypted & Saved!' : 'Encrypt & Save to Vault'}</span>
              </button>

              <button
                onClick={() => onContactAgent(`I would like advice on financing for a property valued at ${formatINR(homePrice)}.`)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Consult Viwin's Financing Desk
              </button>
            </div>
          </div>

          {/* Results Summary & Breakdown Card (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Total Monthly Payment Card */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />

              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Total Monthly Commitment
              </p>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {currency === 'INR' ? formatINR(result.totalMonthlyPayment) : formatUSD(result.totalMonthlyPayment)}
                <span className="text-sm font-sans font-normal text-stone-400"> / month</span>
              </p>

              {/* Breakdown Bars */}
              <div className="mt-6 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-stone-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    Principal & Interest (EMI)
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {formatINR(result.monthlyPrincipalAndInterest)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-stone-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    Property Tax (Est.)
                  </span>
                  <span className="font-mono text-stone-300">
                    {formatINR(result.monthlyTax)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-stone-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    Home Insurance & Upkeep
                  </span>
                  <span className="font-mono text-stone-300">
                    {formatINR(result.monthlyInsurance + result.monthlyMaintenance)}
                  </span>
                </div>
              </div>

              {/* Loan vs Interest Split Visual */}
              <div className="mt-6 pt-5 border-t border-stone-800">
                <div className="flex justify-between text-xs text-stone-400 mb-2">
                  <span>Loan: {formatINR(result.loanAmount, true)}</span>
                  <span>Total Interest: {formatINR(result.totalInterestPaid, true)}</span>
                </div>
                <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${principalPct}%` }} 
                    className="bg-amber-400 h-full transition-all duration-500" 
                    title={`Principal: ${principalPct}%`}
                  />
                  <div 
                    style={{ width: `${interestPct}%` }} 
                    className="bg-stone-600 h-full transition-all duration-500" 
                    title={`Interest: ${interestPct}%`}
                  />
                </div>
              </div>
            </div>

            {/* 5-Year Nilgiris ROI Projection Box */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-serif font-bold text-white">5-Year Investment Projection</h4>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  +{investmentProjection.totalReturn}% Total Return
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                  <p className="text-stone-400 text-[11px]">Est. Property Value (2031)</p>
                  <p className="font-serif text-base font-bold text-white mt-0.5">
                    {formatINR(investmentProjection.projectedValue, true)}
                  </p>
                </div>
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                  <p className="text-stone-400 text-[11px]">5-Yr Cumulative Rent</p>
                  <p className="font-serif text-base font-bold text-emerald-400 mt-0.5">
                    +{formatINR(investmentProjection.totalRentalIncome, true)}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                Based on historical Nilgiris capital growth ({projectedAppreciationPct}%/yr) & curated estate holiday leasing yields.
              </p>
            </div>

            {/* Toggle Amortization Schedule */}
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-stone-200 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>{showAmortization ? 'Hide Amortization Schedule' : 'View Full Amortization Schedule'}</span>
              {showAmortization ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Collapsible Amortization Table */}
        {showAmortization && (
          <div className="mt-8 bg-stone-900 border border-stone-800 rounded-3xl p-6 overflow-hidden animate-in fade-in duration-200">
            <h4 className="text-base font-serif font-bold text-white mb-4">
              Annual Loan Amortization Schedule ({loanTermYears} Years)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase font-sans text-[11px]">
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Principal Repaid</th>
                    <th className="py-2.5 px-3">Interest Paid</th>
                    <th className="py-2.5 px-3">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {result.amortizationSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-stone-950/40">
                      <td className="py-2 px-3 font-sans text-stone-400">Year {row.year}</td>
                      <td className="py-2 px-3 text-emerald-400">{formatINR(row.principalPaid)}</td>
                      <td className="py-2 px-3 text-stone-300">{formatINR(row.interestPaid)}</td>
                      <td className="py-2 px-3 font-semibold text-white">{formatINR(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
