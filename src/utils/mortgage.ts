import { MortgageParams, MortgageResult, AmortizationPoint } from '../types';

/**
 * Calculates Monthly EMI using the standard reducing balance formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where:
 * P = Principal loan amount
 * r = Monthly interest rate (annual rate / 12 / 100)
 * n = Number of monthly installments (years * 12)
 */
export function calculateEMI(principal: number, annualRatePct: number, tenureYears: number): number {
  if (principal <= 0) return 0;
  if (annualRatePct <= 0) {
    const months = Math.max(1, tenureYears * 12);
    return principal / months;
  }
  const monthlyRate = annualRatePct / 12 / 100;
  const totalMonths = Math.max(1, tenureYears * 12);
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Calculates full mortgage breakdown including amortization points
 */
export function calculateMortgage(params: MortgageParams): MortgageResult {
  const downPaymentAmount = Math.round((params.homePrice * params.downPaymentPercent) / 100);
  const loanAmount = Math.max(0, params.homePrice - downPaymentAmount);
  
  const monthlyPrincipalAndInterest = calculateEMI(
    loanAmount,
    params.interestRate,
    params.loanTermYears
  );

  const monthlyTax = Math.round((params.homePrice * (params.propertyTaxRatePct / 100)) / 12);
  const monthlyInsurance = Math.round(params.homeInsuranceAnnual / 12);
  const monthlyMaintenance = Math.round(params.maintenanceMonthly);

  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + monthlyMaintenance;
  
  const totalMonths = Math.max(1, params.loanTermYears * 12);
  const totalLoanPayment = monthlyPrincipalAndInterest * totalMonths;
  const totalInterestPaid = Math.max(0, totalLoanPayment - loanAmount);

  // Calculate annual amortization points
  const amortizationSchedule: AmortizationPoint[] = [];
  let balance = loanAmount;
  const monthlyRate = (params.interestRate / 100) / 12;

  for (let year = 1; year <= params.loanTermYears; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, monthlyPrincipalAndInterest - interestForMonth);
      
      yearlyInterest += interestForMonth;
      yearlyPrincipal += principalForMonth;
      balance = Math.max(0, balance - principalForMonth);
    }

    const isLastYear = year === params.loanTermYears;
    const finalBalance = isLastYear ? 0 : Math.round(balance);

    amortizationSchedule.push({
      year,
      remainingBalance: finalBalance,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
    });

    if (balance <= 0) break;
  }

  return {
    loanAmount,
    downPaymentAmount,
    monthlyPrincipalAndInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyMaintenance,
    totalMonthlyPayment,
    totalInterestPaid,
    totalLoanPayment,
    amortizationSchedule,
  };
}

/**
 * Formats Indian Currency (Crores, Lakhs, Thousands) or USD
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (amount == null || isNaN(amount)) return '₹0';

  if (compact) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.?0+$/, '');
      return `₹${cr} Cr`;
    }
    if (amount >= 100000) {
      const lk = (amount / 100000).toFixed(2).replace(/\.?0+$/, '');
      return `₹${lk} L`;
    }
    if (amount >= 1000) {
      const k = (amount / 1000).toFixed(1).replace(/\.?0+$/, '');
      return `₹${k} K`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amountInINR: number, inrToUsdRate: number = 86.5): string {
  const usd = amountInINR / inrToUsdRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd);
}

/**
 * Calculates estimated 5-year investment return
 */
export function calculateInvestmentReturn(
  purchasePrice: number,
  appreciationAnnualRate: number,
  rentalYieldAnnualRate: number,
  years: number = 5
): {
  projectedValue: number;
  totalRentalIncome: number;
  totalReturn: number;
  netGain: number;
} {
  const projectedValue = Math.round(
    purchasePrice * Math.pow(1 + appreciationAnnualRate / 100, years)
  );
  
  // Approximate compounded rental income assuming 4% annual rental escalation
  let totalRentalIncome = 0;
  let currentAnnualRent = purchasePrice * (rentalYieldAnnualRate / 100);
  for (let i = 0; i < years; i++) {
    totalRentalIncome += currentAnnualRent;
    currentAnnualRent *= 1.04;
  }
  totalRentalIncome = Math.round(totalRentalIncome);

  const capitalGain = projectedValue - purchasePrice;
  const netGain = capitalGain + totalRentalIncome;
  const totalReturn = Math.round(((netGain / purchasePrice) * 100) * 10) / 10;

  return {
    projectedValue,
    totalRentalIncome,
    totalReturn,
    netGain,
  };
}
