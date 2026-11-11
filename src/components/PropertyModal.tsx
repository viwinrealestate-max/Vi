import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  Calculator, 
  ShieldCheck, 
  Compass, 
  Mountain, 
  Sparkles,
  TrendingUp,
  Share2
} from 'lucide-react';
import { Property } from '../types';
import { formatINR, formatUSD, calculateEMI } from '../utils/mortgage';
import { COMPANY_INFO } from '../data/mockData';

interface PropertyModalProps {
  property: Property | null;
  currency: 'INR' | 'USD';
  onClose: () => void;
  onOpenMortgage: (price: number) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  currency,
  onClose,
  onOpenMortgage,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tourDate, setTourDate] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const gallery = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];

  const estimatedEMI = calculateEMI(property.price * 0.8, 8.5, 20);

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;
    setTourSubmitted(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full text-stone-100 shadow-2xl relative my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="property-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/80 text-stone-300 hover:text-white border border-stone-700 backdrop-blur-sm transition-colors cursor-pointer"
          aria-label="Close property details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-stone-950 overflow-hidden">
          <img
            src={gallery[activeImageIndex] || property.image}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-950/40" />

          {/* Badges on Gallery */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-stone-950/80 text-amber-400 border border-amber-500/30 text-xs font-semibold backdrop-blur-md">
                {property.type}
              </span>
              <h2 id="property-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 drop-shadow-md">
                {property.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {property.location}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-stone-400 uppercase tracking-wider">Acquisition Price</p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                {currency === 'INR' ? formatINR(property.price, true) : formatUSD(property.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {gallery.length > 1 && (
          <div className="flex gap-2 p-3 bg-stone-950 border-b border-stone-800 overflow-x-auto">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase">Configuration</p>
                <p className="text-sm font-semibold text-white">{property.bedrooms > 0 ? `${property.bedrooms} Bedrooms` : 'Clear Site'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Maximize className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase">Built-Up Area</p>
                <p className="text-sm font-semibold text-white">{property.areaSqFt > 0 ? `${property.areaSqFt.toLocaleString()} Sq Ft` : 'Acreage'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase">Elevation</p>
                <p className="text-sm font-semibold text-white">{property.elevationFt} Ft MSL</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase">Projected ROI</p>
                <p className="text-sm font-semibold text-emerald-400">{property.roiEstimatePct}% Annual</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">Architectural Narrative</h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              {property.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-stone-400">
              <span>Land Extent: <strong className="text-stone-200">{property.landArea || 'Private Compound'}</strong></span>
              <span>•</span>
              <span>Year Constructed: <strong className="text-stone-200">{property.yearBuilt}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> RERA Verified Title
              </span>
            </div>
          </div>

          {/* Features and Amenities */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-3">Distinguished Estate Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/70 text-xs text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mortgage Quick Estimation Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>Mortgage Financing Preview</span>
              </div>
              <p className="text-sm text-stone-300">
                Estimated Monthly EMI: <strong className="text-white font-mono text-base">{formatINR(estimatedEMI)}</strong>/mo
              </p>
              <p className="text-xs text-stone-400">
                Assuming 20% down payment at 8.5% p.a. over 20-year term.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenMortgage(property.price);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shrink-0"
            >
              Open Full EMI Calculator
            </button>
          </div>

          {/* Office Desk & Site Visit Booking Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
            {/* Headquarters Desk Box */}
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex flex-col justify-between">
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2">
                  Viwin's Bedford Headquarters Desk
                </p>
                <h4 className="text-base font-serif font-bold text-white">Direct Advisory & Legal Clearance</h4>
                <p className="text-xs text-stone-400 mt-1">
                  {COMPANY_INFO.address}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  RERA Reg: {COMPANY_INFO.reraRegistration} • Nilgiris Title Search
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap gap-2">
                <a
                  href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{COMPANY_INFO.phoneLandline}</span>
                </a>
                <a
                  href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{COMPANY_INFO.phoneMobile}</span>
                </a>
              </div>
            </div>

            {/* Site Visit Booking Form */}
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2">
                Book Private Site Tour in Coonoor
              </p>

              {tourSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-center animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Private Tour Requested</p>
                  <p className="text-xs text-emerald-300 mt-1">
                    Our Bedford desk will contact you at {visitorPhone} within 2 hours to confirm chauffeur or gate pass.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTourSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Contact / WhatsApp"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                    />
                    <input
                      type="date"
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Request Coonoor Site Tour
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Client records protected by Viwin's Client-Side AES-256 Encryption
          </span>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Link Copied!' : 'Share Estate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
