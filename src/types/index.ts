export type PropertyType = 
  | 'All'
  | 'Luxury Villa'
  | 'Tea Plantation Estate'
  | 'Heritage Bungalow'
  | 'Hill Cottage'
  | 'Commercial Estate'
  | 'Scenic Land / Plot';

export interface PropertyingsFilters {
  searchQuery: string;
  location: string;
  propertyType: PropertyType;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'roi-desc' | 'newest';
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  price: number; // in INR
  location: string;
  microMarket: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  landArea?: string; // e.g. "2.4 Acres" or "45 Cents"
  elevationFt: number;
  featured: boolean;
  reraApproved: boolean;
  roiEstimatePct: number; // estimated annual ROI %
  rentalYieldPct: number;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agentId: string;
  status: 'Available' | 'Exclusive' | 'Under Offer';
  yearBuilt: number;
  virtualTourAvailable: boolean;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  phone: string;
  email: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  dealsClosed: number;
  specializations: string[];
  bio: string;
  languages: string[];
}

export interface MortgageParams {
  homePrice: number;
  downPaymentPercent: number; // e.g., 20%
  interestRate: number; // e.g., 8.5%
  loanTermYears: number; // e.g., 20
  propertyTaxRatePct: number; // e.g., 0.6%
  homeInsuranceAnnual: number;
  maintenanceMonthly: number;
}

export interface AmortizationPoint {
  year: number;
  remainingBalance: number;
  principalPaid: number;
  interestPaid: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalLoanPayment: number;
  amortizationSchedule: AmortizationPoint[];
}

export interface PropertyAlert {
  id: string;
  name: string;
  location: string;
  propertyType: string;
  minBudget: number;
  maxBudget: number;
  minBedrooms: number;
  frequency: 'Instant' | 'Daily' | 'Weekly';
  notifyEmail: boolean;
  notifySms: boolean;
  notifyWhatsapp: boolean;
  active: boolean;
  createdAt: string;
  matchedCount: number;
}

export interface InvestmentPortfolioItem {
  id: string;
  propertyTitle: string;
  location: string;
  propertyType: string;
  purchasePrice: number;
  purchaseDate: string;
  currentValue: number;
  monthlyRentalIncome: number;
  remainingMortgage: number;
  appreciationPct: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  agentName?: string;
  quickReplies?: string[];
}

export interface MarketMetric {
  microMarket: string;
  avgPriceSqFt: number;
  yearlyAppreciationPct: number;
  activeListings: number;
  avgDaysOnMarket: number;
  rentalYieldPct: number;
  trend: 'up' | 'stable';
}
