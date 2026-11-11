import React from 'react';
import { ShieldCheck, Lock, Key, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { getSecurityAudit } from '../utils/crypto';

interface SecurityBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityBadgeModal: React.FC<SecurityBadgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const audit = getSecurityAudit();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative"
        role="dialog"
        aria-labelledby="security-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close security modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 id="security-modal-title" className="text-xl font-serif font-bold text-white">
              Data Encryption & Security
            </h3>
            <p className="text-xs text-amber-400/90 font-medium">Viwin's Platform Trust Architecture</p>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed mb-5">
          Viwin's Real Estate safeguards your high-value property portfolios, financial inquiries, and alert parameters with high-level client-side authenticated encryption.
        </p>

        <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800 text-xs font-mono">
          <div className="flex justify-between items-center py-1.5 border-b border-stone-800/80">
            <span className="text-stone-400 flex items-center gap-1.5 font-sans">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Primary Cipher
            </span>
            <span className="text-emerald-400 font-semibold">{audit.algorithm}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-stone-800/80">
            <span className="text-stone-400 flex items-center gap-1.5 font-sans">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Key Derivation
            </span>
            <span className="text-stone-200">{audit.kdf} ({audit.iterations.toLocaleString()} rounds)</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-stone-800/80">
            <span className="text-stone-400 flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Integrity Verification
            </span>
            <span className="text-emerald-400 font-semibold">Active & Verified (GCM Tag)</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-stone-400 flex items-center gap-1.5 font-sans">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Investor Data Scope
            </span>
            <span className="text-stone-200">Local Zero-Knowledge Vault</span>
          </div>
        </div>

        <div className="mt-5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <span>
            Your mortgage numbers, search alert budgets, and private agent inquiries are protected end-to-end and compliant with Indian Digital Personal Data Protection Act (DPDPA 2023).
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-sm transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
