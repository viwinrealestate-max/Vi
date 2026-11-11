import React, { useState } from 'react';
import { Search, MapPin, Home, Shield, Award, Sparkles, ArrowRight } from 'lucide-react';
import { PropertyType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onSearch: (filters: {
    location: string;
    propertyType: PropertyType;
    budgetRange: string;
  }) => void;
  onOpenMortgage: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenMortgage }) => {
  const { themeMeta } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState<PropertyType>('All');
  const [selectedBudget, setSelectedBudget] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: selectedLocation,
      propertyType: selectedType,
      budgetRange: selectedBudget,
    });
  };

  return (
    <div 
      className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      {/* Background with cinematic mountain & tea estate imagery */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 transform motion-safe:transition-transform duration-1000 opacity-60"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85')`,
        }}
      >
        {/* Multi-layered luxurious gradient overlays */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(to top, var(--bg-main) 0%, rgba(6, 21, 16, 0.75) 50%, rgba(6, 21, 16, 0.4) 100%)` 
          }} 
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center z-10 w-full">
        {/* Subtle pill tag */}
        <div 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium mb-6 shadow-sm"
          style={{ 
            backgroundColor: 'var(--accent-subtle)', 
            borderColor: 'var(--border-accent)',
            color: 'var(--accent)'
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>Prime Tamil Nadu Properties • Bedford Headquarters, Coonoor</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto" style={{ color: 'var(--text-primary)' }}>
          Luxury Estates, Heritage Manors & <span className="font-serif italic" style={{ color: 'var(--accent)' }}>Villas Across Tamil Nadu</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Viwin's Real Estate curates verified high-value investments across Coonoor, Nilgiris, Chennai, Coimbatore, Kodaikanal, and Chettinad with end-to-end legal title diligence and encrypted client security.
        </p>

        {/* Seamless Search Bar Widget */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-4xl mx-auto backdrop-blur-md p-3 sm:p-4 rounded-2xl border shadow-2xl text-left transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Location Filter */}
            <div 
              className="p-2 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <label htmlFor="hero-location-select" className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: 'var(--accent)' }}>
                <MapPin className="w-3 h-3" /> Location in Tamil Nadu
              </label>
              <select
                id="hero-location-select"
                aria-label="Filter by Location in Tamil Nadu"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                <option value="All" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>All over Tamil Nadu</option>
                <option value="Bedford" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Bedford, Coonoor</option>
                <option value="Upper Coonoor" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Upper Coonoor</option>
                <option value="Wellington" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Wellington Cantonment</option>
                <option value="Ketti Valley" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Ketti Valley</option>
                <option value="Kotagiri" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Kotagiri Ridge</option>
                <option value="Chennai" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Chennai (ECR & Poes Garden)</option>
                <option value="Coimbatore" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Coimbatore (Race Course)</option>
                <option value="Kodaikanal" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Kodaikanal (Pine Forests)</option>
                <option value="Pollachi" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Pollachi (Anamalai Estates)</option>
                <option value="Chettinad" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Chettinad (Heritage Palaces)</option>
                <option value="Yercaud" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Yercaud (Shevaroys Hills)</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div 
              className="p-2 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <label htmlFor="hero-property-type-select" className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: 'var(--accent)' }}>
                <Home className="w-3 h-3" /> Property Type
              </label>
              <select
                id="hero-property-type-select"
                aria-label="Filter by Property Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PropertyType)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                <option value="All" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>All Property Types</option>
                <option value="Tea Plantation Estate" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Tea Plantation Estates</option>
                <option value="Heritage Bungalow" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Heritage Bungalows</option>
                <option value="Luxury Villa" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Luxury Villas</option>
                <option value="Hill Cottage" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Hill Cottages</option>
                <option value="Commercial Estate" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Commercial Properties</option>
                <option value="Scenic Land / Plot" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Scenic Land / Plots</option>
              </select>
            </div>

            {/* Budget Range Filter */}
            <div 
              className="p-2 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <label htmlFor="hero-budget-select" className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: 'var(--accent)' }}>
                <span className="font-mono">₹</span> Budget (From ₹15 Lakhs)
              </label>
              <select
                id="hero-budget-select"
                aria-label="Filter by Budget Tier"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                <option value="all" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>All Budgets (Starting ₹15 Lakhs)</option>
                <option value="15l-50l" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>₹15 Lakhs - ₹50 Lakhs (Affordable Plots)</option>
                <option value="50l-2cr" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>₹50 Lakhs - ₹2.00 Crores</option>
                <option value="2cr-5cr" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>₹2.00 Cr - ₹5.00 Crores</option>
                <option value="5cr-10cr" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>₹5.00 Cr - ₹10.00 Crores</option>
                <option value="above-10cr" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>Above ₹10.00 Crores (Ultra-HNW)</option>
              </select>
            </div>

            {/* Action Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[50px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer text-stone-950"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 8px 20px -4px var(--accent-glow)'
                }}
              >
                <Search className="w-4 h-4 text-stone-950" />
                <span>Search Estates</span>
              </button>
            </div>
          </div>
        </form>

        {/* Trust Badges Bar */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-stone-800/70 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center" style={{ color: 'var(--accent)' }}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">18+ Years</p>
              <p className="text-xs text-stone-400">Nilgiris Heritage Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Cleared</p>
              <p className="text-xs text-stone-400">RERA & Patta Title Due Diligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center" style={{ color: 'var(--accent)' }}>
              <span className="font-serif font-black text-sm">₹</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">₹450+ Cr</p>
              <p className="text-xs text-stone-400">Nilgiris Assets Transacted</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={onOpenMortgage}
              className="text-xs underline underline-offset-4 flex items-center gap-1 cursor-pointer font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              Estimate EMI & Yield
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
