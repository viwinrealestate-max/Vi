import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle,
  Building2
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { encryptData } from '../utils/crypto';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Tea Plantation Estate');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [encryptedDigest, setEncryptedDigest] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Encrypt the submission payload client-side before storing or transmitting
    const payload = JSON.stringify({ name, phone, email, interest, message, timestamp: new Date().toISOString() });
    const encrypted = await encryptData(payload);
    setEncryptedDigest(encrypted.slice(0, 32) + '...');
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="py-16 bg-stone-900 border-t border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Office Details & Bedford Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>Bedford Headquarters</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Connect with Viwin's Real Estate
              </h2>
              <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                Visit our central offices in Bedford, Coonoor, or schedule a discreet briefing with our senior Nilgiris estate partners.
              </p>
            </div>

            {/* Address & Contacts Card */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">Head Office Address</h4>
                  <p className="text-sm text-white font-medium mt-1 leading-snug">
                    {COMPANY_INFO.address}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">Nilgiris District, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-800/80">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">Direct Telephone & Mobile</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <a
                      href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`}
                      className="text-sm font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {COMPANY_INFO.phoneLandline} (Landline)
                    </a>
                    <span className="text-stone-600">•</span>
                    <a
                      href={`tel:${COMPANY_INFO.phoneMobile.replace(/\s+/g, '')}`}
                      className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {COMPANY_INFO.phoneMobile} (Mobile)
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-800/80">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">Hours of Advisory</h4>
                  <p className="text-xs text-stone-300 mt-1">{COMPANY_INFO.businessHours}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Prior appointments recommended for weekend plantation tours</p>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-3 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${COMPANY_INFO.phoneLandline.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Office
                </a>

                <a
                  href={`https://wa.me/917010647424?text=Hello%20Viwin%20Real%20Estate,%20I%20would%20like%20to%20inquire%20about%20estates%20in%20Coonoor.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Bedford Coonoor Location Map Graphic */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-5 overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Bedford Circle & Jograj Buildings Enclave
                </span>
                <span className="text-[10px] text-stone-500 font-mono">11.3530° N, 76.7959° E</span>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center text-center p-4">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80')`,
                  }}
                />
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/40 animate-pulse">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Viwin's Real Estate • Bedford, Coonoor</p>
                    <p className="text-[11px] text-stone-400">1st Floor, Jograj Buildings, Bedford - 643 101</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Bedford,+Coonoor,+Nilgiris"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Encrypted Confidential Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Confidential Estate Inquiry</h3>
                <p className="text-xs text-stone-400">Directly routed to senior estate partners in Coonoor.</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client-Side Encrypted</span>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-xl font-serif font-bold text-white">Inquiry Received & Encrypted</h4>
                <p className="text-xs text-stone-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{name}</strong>. Your confidential inquiry regarding {interest} has been recorded. Our Coonoor desk will contact you at <strong className="text-amber-400">{phone}</strong>.
                </p>

                {encryptedDigest && (
                  <div className="mt-4 p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-400 break-all max-w-sm mx-auto">
                    Cipher verification: <span className="text-emerald-400">{encryptedDigest}</span>
                  </div>
                )}

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-form-name" className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-form-name"
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-form-phone" className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      required
                      placeholder="+91 98400 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-form-email" className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                      Email Address
                    </label>
                    <input
                      id="contact-form-email"
                      type="email"
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-form-interest" className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                      Primary Property Interest
                    </label>
                    <select
                      id="contact-form-interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      <option value="Tea Plantation Estate">Tea Plantation Estate (1 - 25+ Acres)</option>
                      <option value="Colonial Heritage Manor">Colonial Heritage Manor (Bedford / Upper Coonoor)</option>
                      <option value="Luxury Hill Villa">Luxury Hill Villa (Ketti / Sim's Park)</option>
                      <option value="Commercial Landmark">Commercial Property / Retail Asset</option>
                      <option value="Title Clearance & Valuation">Legal Title Clearance & Valuation Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-form-message" className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                    Specific Requirements or Preferred Tour Dates
                  </label>
                  <textarea
                    id="contact-form-message"
                    rows={4}
                    placeholder="Tell us about your target budget range, timeline, or specific Nilgiris locations of interest..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Your inquiry is protected by AES-256 client-side cryptography. We never share client records with third-party brokers.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Encrypted Inquiry to Coonoor Desk
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
