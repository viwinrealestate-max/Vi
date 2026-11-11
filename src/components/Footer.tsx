import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Heart, 
  ArrowUp 
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenSecurity: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenSecurity }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-serif font-black text-xl shadow-lg">
                V
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white">Viwin's</span>
                <span className="text-amber-400 font-serif text-lg font-light mx-1.5">|</span>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-medium">Real Estate</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Nilgiris premier real estate brokerage specializing in high-value tea plantations, British colonial heritage bungalows, and luxury hill residences in Coonoor and Wellington.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenSecurity}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium hover:bg-emerald-900/40 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AES-256 Client-Side Encrypted</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Explore Portfolio
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => onNavClick('properties')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Featured Estate Listings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Bedford Headquarters Desk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavClick('mortgage')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Mortgage & EMI Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavClick('analytics')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Market Analytics & Capital Trends
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavClick('dashboard')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Encrypted Alerts & Watchlist
                </button>
              </li>
            </ul>
          </div>

          {/* Micro-Markets */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Prime Tamil Nadu Markets
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Bedford Ridge & Coonoor Central</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Upper Coonoor & Wellington</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Chennai (ECR Coast & Poes Garden)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Coimbatore (Race Course & Pollachi)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Kodaikanal (Pine Hills & Fairy Falls)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Chettinad & Kanadukathan Palaces</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Yercaud (Shevaroys Coffee Estates)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Bedford Headquarters
            </h4>
            <div className="space-y-3 text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`} className="hover:text-white">
                  {COMPANY_INFO.phoneLandline}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`} className="hover:text-white">
                  {COMPANY_INFO.phoneMobile}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{COMPANY_INFO.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Bar */}
      <div className="border-t border-stone-800/80 bg-stone-950 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © 2026 Viwin's | Real Estate. All Rights Reserved. RERA Reg: {COMPANY_INFO.reraRegistration}.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Encrypted & RERA Verified Platform
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors flex items-center gap-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
