import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEMI,
  calculateMortgage,
  formatINR,
  calculateInvestmentReturn,
} from './mortgage';

test('calculateEMI returns correct monthly payment for standard home loan', () => {
  // Principal: 5,000,000 (50 Lakhs), 8.5% annual rate, 20 years
  const emi = calculateEMI(5000000, 8.5, 20);
  // Expected EMI is approx 43,391 INR
  assert.ok(emi > 43000 && emi < 44000, `EMI ${emi} is within expected range`);
});

test('calculateEMI handles 0 principal or 0 interest gracefully', () => {
  assert.equal(calculateEMI(0, 8.5, 20), 0);
  assert.equal(calculateEMI(120000, 0, 1), 10000);
});

test('calculateMortgage computes down payment, loan amount and total interest accurately', () => {
  const result = calculateMortgage({
    homePrice: 10000000, // 1 Crore
    downPaymentPercent: 20, // 20 Lakhs down, 80 Lakhs loan
    interestRate: 8.5,
    loanTermYears: 15,
    propertyTaxRatePct: 0.5,
    homeInsuranceAnnual: 24000,
    maintenanceMonthly: 5000,
  });

  assert.equal(result.downPaymentAmount, 2000000);
  assert.equal(result.loanAmount, 8000000);
  assert.ok(result.monthlyPrincipalAndInterest > 75000, 'Monthly EMI should be above 75k');
  assert.ok(result.monthlyTax > 0, 'Property tax should be calculated');
  assert.equal(result.monthlyInsurance, 2000); // 24000 / 12
  assert.equal(result.monthlyMaintenance, 5000);
  assert.ok(result.amortizationSchedule.length === 15, '15 years amortization points');
  assert.equal(result.amortizationSchedule[result.amortizationSchedule.length - 1].remainingBalance, 0);
});

test('formatINR formats currency in compact Crore and Lakh formats correctly', () => {
  assert.equal(formatINR(15000000, true), '₹1.5 Cr');
  assert.equal(formatINR(7500000, true), '₹75 L');
  assert.equal(formatINR(0, true), '₹0');
});

test('calculateInvestmentReturn projects appreciation and rental yield over 5 years', () => {
  const returnMetrics = calculateInvestmentReturn(
    10000000, // 1 Crore
    8.5, // 8.5% annual appreciation
    4.0, // 4.0% initial rental yield
    5
  );

  assert.ok(returnMetrics.projectedValue > 15000000, 'Property value should exceed 1.5 Cr');
  assert.ok(returnMetrics.totalRentalIncome > 2000000, 'Rental income over 5 years should exceed 20 Lakhs');
  assert.ok(returnMetrics.totalReturn > 60, 'Combined 5-year return should be above 60%');
});
