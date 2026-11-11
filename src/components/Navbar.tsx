import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  ShieldCheck, 
  Menu, 
  X, 
  Calculator, 
  BarChart3, 
  Bell, 
  Coins
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  savedCount: number;
  alertsCount: number;
  onOpenSecurity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  savedCount,
  alertsCount,
  onOpenSecurity,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'mortgage', label: 'Mortgage Calculator', icon: Calculator },
    { id: 'analytics', label: 'Market Analytics', icon: BarChart3 },
    { 
      id: 'dashboard', 
      label: 'Investor Vault & Alerts', 
      icon: Bell,
      badge: (savedCount + alertsCount) > 0 ? (savedCount + alertsCount) : undefined
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
      {/* Top micro-bar with contact & security badge */}
      <div className="bg-stone-900/80 px-4 py-1.5 text-xs border-b border-stone-800/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-stone-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Headquarters: {COMPANY_INFO.address}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={onOpenSecurity}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Click to view AES-256 platform encryption audit"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AES-256 Data Encryption Active</span>
            </button>

            <a 
              href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{COMPANY_INFO.phoneLandline}</span>
            </a>

            <a 
              href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`}
              className="text-stone-300 hover:text-white transition-colors"
            >
              {COMPANY_INFO.phoneMobile}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('properties')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-serif font-black text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Viwin's
                </span>
                <span className="text-amber-400 font-serif text-xl font-light">|</span>
                <span className="text-xs uppercase tracking-widest text-amber-400/90 font-medium">
                  Real Estate
                </span>
              </div>
              <p className="text-[11px] text-stone-400 tracking-wider">
                Bedford • Coonoor • Nilgiris
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Currency switch & Call CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-xs text-stone-300 hover:text-white transition-colors"
              title="Toggle Currency"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{currency}</span>
            </button>

            <a
              href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wide shadow-md shadow-amber-500/20 transition-all hover:scale-102"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Desk</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="px-2 py-1 rounded bg-stone-900 border border-stone-800 text-xs text-amber-400 font-semibold"
            >
              {currency}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-stone-300 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-stone-900 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpenSecurity();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              AES-256 Platform Encryption Status
            </button>

            <a
              href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm"
            >
              <Phone className="w-4 h-4" />
              Call Now: {COMPANY_INFO.phoneMobile}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
