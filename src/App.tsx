import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyList } from './components/PropertyList';
import { PropertyModal } from './components/PropertyModal';
import { MortgageCalculator } from './components/MortgageCalculator';
import { UserDashboard } from './components/UserDashboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LiveChat } from './components/LiveChat';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SecurityBadgeModal } from './components/SecurityBadgeModal';
import { INITIAL_PROPERTIES, COMPANY_INFO } from './data/mockData';
import { Property, PropertyingsFilters, PropertyType } from './types';
import { loadEncryptedStorage, saveEncryptedStorage } from './utils/crypto';
import { Phone, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('properties');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  
  // Selected property for modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Mortgage pre-fill price
  const [mortgageInitialPrice, setMortgageInitialPrice] = useState<number>(68000000);

  // Saved properties (watchlist) stored with encryption
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-1', 'prop-3']);

  // Security audit modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Active filters passed from hero search
  const [activeFilters, setActiveFilters] = useState<Partial<PropertyingsFilters>>({});

  // Load saved properties from encrypted storage on mount
  useEffect(() => {
    async function initSaved() {
      const saved = await loadEncryptedStorage<string[]>('saved_watchlist', ['prop-1', 'prop-3']);
      setSavedPropertyIds(saved);
    }
    initSaved();
  }, []);

  const handleToggleSave = async (id: string) => {
    const isCurrentlySaved = savedPropertyIds.includes(id);
    const updated = isCurrentlySaved 
      ? savedPropertyIds.filter(itemId => itemId !== id)
      : [...savedPropertyIds, id];
    
    setSavedPropertyIds(updated);
    await saveEncryptedStorage('saved_watchlist', updated);
  };

  const handleHeroSearch = (filters: {
    location: string;
    propertyType: PropertyType;
    budgetRange: string;
  }) => {
    let minPrice = 0;
    let maxPrice = 400000000;

    if (filters.budgetRange === '15l-50l') {
      minPrice = 1500000;
      maxPrice = 5000000;
    } else if (filters.budgetRange === '50l-2cr') {
      minPrice = 5000000;
      maxPrice = 20000000;
    } else if (filters.budgetRange === '2cr-5cr') {
      minPrice = 20000000;
      maxPrice = 50000000;
    } else if (filters.budgetRange === 'under-5cr') {
      minPrice = 1500000;
      maxPrice = 50000000;
    } else if (filters.budgetRange === '5cr-10cr') {
      minPrice = 50000000;
      maxPrice = 100000000;
    } else if (filters.budgetRange === 'above-10cr') {
      minPrice = 100000000;
      maxPrice = 400000000;
    }

    setActiveFilters({
      location: filters.location === 'All' ? 'All' : filters.location,
      propertyType: filters.propertyType,
      minPrice,
      maxPrice,
    });

    setActiveTab('properties');
    
    // Smooth scroll to properties section
    const elem = document.getElementById('properties-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenMortgageForProperty = (property: Property) => {
    setMortgageInitialPrice(property.price);
    setActiveTab('mortgage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquireForProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        savedCount={savedPropertyIds.length}
        alertsCount={2}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* If on Properties tab, render Hero, Filterable PropertyList, and featured highlights */}
        {activeTab === 'properties' && (
          <>
            <Hero
              onSearch={handleHeroSearch}
              onOpenMortgage={() => {
                setActiveTab('mortgage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <PropertyList
              properties={properties}
              currency={currency}
              savedPropertyIds={savedPropertyIds}
              onToggleSave={handleToggleSave}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onOpenMortgageForProperty={handleOpenMortgageForProperty}
              onContactAgentForProperty={handleInquireForProperty}
              externalFilters={activeFilters}
            />

            {/* Quick Teaser for Mortgage Calculator & Market Analytics */}
            <div className="bg-stone-900 border-y border-stone-800 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800">
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Financial Planning</span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">Need Precision Mortgage Calculations?</h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    Test repayment scenarios, down payment configurations, and 5-year capital appreciation charts for any Nilgiris estate.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('mortgage');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                  >
                    Open Mortgage Suite
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Market Intelligence</span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">Nilgiris Micro-Market Benchmarks</h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    Compare average capital rates per square foot and rental yields in Bedford, Wellington, Upper Coonoor, and Kotagiri.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('analytics');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs"
                  >
                    View Analytics Report
                  </button>
                </div>
              </div>
            </div>

            <ContactSection />
          </>
        )}

        {/* Mortgage Calculator Tab */}
        {activeTab === 'mortgage' && (
          <>
            <MortgageCalculator
              initialPrice={mortgageInitialPrice}
              currency={currency}
              onContactAgent={(msg) => {
                const elem = document.getElementById('contact-section');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <ContactSection />
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <AnalyticsDashboard />
            <ContactSection />
          </>
        )}

        {/* User Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <UserDashboard
            properties={properties}
            savedPropertyIds={savedPropertyIds}
            currency={currency}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onToggleSave={handleToggleSave}
            onOpenSecurity={() => setIsSecurityModalOpen(true)}
          />
        )}
      </main>

      {/* Property Details Modal */}
      <PropertyModal
        property={selectedProperty}
        currency={currency}
        onClose={() => setSelectedProperty(null)}
        onOpenMortgage={(price) => {
          setMortgageInitialPrice(price);
          setActiveTab('mortgage');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Security Audit Modal */}
      <SecurityBadgeModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Integrated Live Chat Support */}
      <LiveChat
        onOpenMortgage={() => {
          setActiveTab('mortgage');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProperties={() => {
          setActiveTab('properties');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl">
        <a
          href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>{COMPANY_INFO.phoneLandline}</span>
        </a>

        <a
          href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`}
          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{COMPANY_INFO.phoneMobile}</span>
        </a>
      </div>

      {/* Footer */}
      <Footer
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
      />
    </div>
  );
}
