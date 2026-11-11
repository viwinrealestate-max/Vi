import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Heart, 
  TrendingUp, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Bed, 
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Property, PropertyAlert, InvestmentPortfolioItem, PropertyType } from '../types';
import { formatINR, formatUSD } from '../utils/mortgage';
import { saveEncryptedStorage, loadEncryptedStorage } from '../utils/crypto';
import { INITIAL_ALERTS, INITIAL_PORTFOLIO } from '../data/mockData';

interface UserDashboardProps {
  properties: Property[];
  savedPropertyIds: string[];
  currency: 'INR' | 'USD';
  onSelectProperty: (property: Property) => void;
  onToggleSave: (id: string) => void;
  onOpenSecurity: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  properties,
  savedPropertyIds,
  currency,
  onSelectProperty,
  onToggleSave,
  onOpenSecurity,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'saved' | 'portfolio'>('alerts');
  const [alerts, setAlerts] = useState<PropertyAlert[]>(INITIAL_ALERTS);
  const [portfolio, setPortfolio] = useState<InvestmentPortfolioItem[]>(INITIAL_PORTFOLIO);
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [vaultPin, setVaultPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // New alert form state
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [alertName, setAlertName] = useState('');
  const [alertLocation, setAlertLocation] = useState('Bedford, Coonoor');
  const [alertType, setAlertType] = useState<PropertyType>('Tea Plantation Estate');
  const [alertMinBudget, setAlertMinBudget] = useState(50000000);
  const [alertMaxBudget, setAlertMaxBudget] = useState(150000000);
  const [alertFrequency, setAlertFrequency] = useState<'Instant' | 'Daily' | 'Weekly'>('Instant');
  const [alertEmail, setAlertEmail] = useState(true);
  const [alertWhatsapp, setAlertWhatsapp] = useState(true);
  const [alertSms, setAlertSms] = useState(false);

  // New portfolio item modal state
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [portTitle, setPortTitle] = useState('');
  const [portLocation, setPortLocation] = useState('Upper Coonoor');
  const [portPurchasePrice, setPortPurchasePrice] = useState(45000000);
  const [portCurrentValue, setPortCurrentValue] = useState(56000000);
  const [portMonthlyRent, setPortMonthlyRent] = useState(210000);
  const [portMortgage, setPortMortgage] = useState(15000000);

  // Notification simulation toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load encrypted data on mount
  useEffect(() => {
    async function loadData() {
      const storedAlerts = await loadEncryptedStorage<PropertyAlert[]>('user_alerts', INITIAL_ALERTS);
      setAlerts(storedAlerts);

      const storedPortfolio = await loadEncryptedStorage<InvestmentPortfolioItem[]>('user_portfolio', INITIAL_PORTFOLIO);
      setPortfolio(storedPortfolio);
    }
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertName.trim()) return;

    const newAlert: PropertyAlert = {
      id: `alert-${Date.now()}`,
      name: alertName,
      location: alertLocation,
      propertyType: alertType,
      minBudget: alertMinBudget,
      maxBudget: alertMaxBudget,
      minBedrooms: 3,
      frequency: alertFrequency,
      notifyEmail: alertEmail,
      notifySms: alertSms,
      notifyWhatsapp: alertWhatsapp,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      matchedCount: Math.floor(Math.random() * 3) + 1,
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    await saveEncryptedStorage('user_alerts', updated);
    setShowAddAlert(false);
    setAlertName('');
    triggerToast(`Encrypted alert "${newAlert.name}" created! You will receive updates via WhatsApp & Email.`);
  };

  const handleDeleteAlert = async (id: string) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    await saveEncryptedStorage('user_alerts', updated);
    triggerToast('Alert removed from encrypted storage.');
  };

  const handleToggleAlertActive = async (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, active: !a.active } : a);
    setAlerts(updated);
    await saveEncryptedStorage('user_alerts', updated);
  };

  const handleAddPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim()) return;

    const gain = portCurrentValue - portPurchasePrice;
    const appreciation = Math.round((gain / portPurchasePrice) * 1000) / 10;

    const newItem: InvestmentPortfolioItem = {
      id: `port-${Date.now()}`,
      propertyTitle: portTitle,
      location: portLocation,
      propertyType: 'Luxury Villa',
      purchasePrice: portPurchasePrice,
      purchaseDate: new Date().toISOString().split('T')[0],
      currentValue: portCurrentValue,
      monthlyRentalIncome: portMonthlyRent,
      remainingMortgage: portMortgage,
      appreciationPct: appreciation,
    };

    const updated = [newItem, ...portfolio];
    setPortfolio(updated);
    await saveEncryptedStorage('user_portfolio', updated);
    setShowAddPortfolio(false);
    setPortTitle('');
    triggerToast('Portfolio asset encrypted and saved.');
  };

  const savedPropertiesList = properties.filter(p => savedPropertyIds.includes(p.id));

  // Portfolio total statistics
  const totalPortfolioValue = portfolio.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalMonthlyRentalIncome = portfolio.reduce((acc, curr) => acc + curr.monthlyRentalIncome, 0);
  const totalRemainingMortgage = portfolio.reduce((acc, curr) => acc + curr.remainingMortgage, 0);
  const totalNetEquity = totalPortfolioValue - totalRemainingMortgage;

  return (
    <section 
      id="dashboard-section" 
      className="py-12 min-h-[700px] transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-stone-950 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Top Banner */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AES-256-GCM Encrypted Vault
                </span>
                <button
                  onClick={onOpenSecurity}
                  className="text-xs text-stone-400 hover:text-amber-400 underline underline-offset-4"
                >
                  Verify Audit
                </button>
              </div>

              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                Investor Dashboard & Personalized Alerts
              </h2>
              <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                Manage your Nilgiris property alert criteria, monitor saved luxury estates, and track your hill station real estate portfolio with zero-knowledge data security.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-center min-w-[90px]">
                <p className="text-xs text-stone-400">Active Alerts</p>
                <p className="text-xl font-serif font-bold text-amber-400">{alerts.filter(a => a.active).length}</p>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-center min-w-[90px]">
                <p className="text-xs text-stone-400">Watchlist</p>
                <p className="text-xl font-serif font-bold text-white">{savedPropertyIds.length}</p>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-center min-w-[110px]">
                <p className="text-xs text-stone-400">Net Equity</p>
                <p className="text-sm font-serif font-bold text-emerald-400">{formatINR(totalNetEquity, true)}</p>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-stone-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Personalized Alerts ({alerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Saved Watchlist ({savedPropertiesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Investment Portfolio ({portfolio.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PERSONALIZED PROPERTY ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Active Alert Criteria</h3>
                <p className="text-xs text-stone-400">Receive immediate notifications when new Nilgiris tea estates or villas match your parameters.</p>
              </div>
              <button
                onClick={() => setShowAddAlert(!showAddAlert)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Alert</span>
              </button>
            </div>

            {/* Create Alert Modal / Form */}
            {showAddAlert && (
              <form onSubmit={handleCreateAlert} className="bg-stone-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                  <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Configure New Encrypted Alert
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddAlert(false)}
                    className="text-stone-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Alert Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wellington Golf Retreats"
                      value={alertName}
                      onChange={(e) => setAlertName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Target Location</label>
                    <select
                      value={alertLocation}
                      onChange={(e) => setAlertLocation(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="Bedford, Coonoor">Bedford, Coonoor</option>
                      <option value="Upper Coonoor">Upper Coonoor</option>
                      <option value="Wellington">Wellington Cantonment</option>
                      <option value="Ketti Valley">Ketti Valley</option>
                      <option value="Kotagiri">Kotagiri Ridge</option>
                      <option value="Chennai">Chennai (ECR & Poes Garden)</option>
                      <option value="Coimbatore">Coimbatore (Race Course)</option>
                      <option value="Kodaikanal">Kodaikanal</option>
                      <option value="Pollachi">Pollachi (Anamalai)</option>
                      <option value="Chettinad">Chettinad</option>
                      <option value="Yercaud">Yercaud Hills</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Property Type</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value as PropertyType)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="Tea Plantation Estate">Tea Plantation Estate</option>
                      <option value="Heritage Bungalow">Heritage Bungalow</option>
                      <option value="Luxury Villa">Luxury Villa</option>
                      <option value="Hill Cottage">Hill Cottage</option>
                      <option value="Commercial Estate">Commercial Estate</option>
                      <option value="Scenic Land / Plot">Scenic Land / Plot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                      Min Budget: {formatINR(alertMinBudget, true)}
                    </label>
                    <input
                      type="range"
                      min={20000000}
                      max={150000000}
                      step={5000000}
                      value={alertMinBudget}
                      onChange={(e) => setAlertMinBudget(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">
                      Max Budget: {formatINR(alertMaxBudget, true)}
                    </label>
                    <input
                      type="range"
                      min={alertMinBudget}
                      max={250000000}
                      step={5000000}
                      value={alertMaxBudget}
                      onChange={(e) => setAlertMaxBudget(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Frequency</label>
                    <select
                      value={alertFrequency}
                      onChange={(e) => setAlertFrequency(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="Instant">Instant (Real-Time Push)</option>
                      <option value="Daily">Daily Digest</option>
                      <option value="Weekly">Weekly Confidential Dossier</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Channels */}
                <div className="pt-2">
                  <span className="block text-[11px] font-semibold uppercase text-stone-400 mb-2">Notification Channels</span>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={alertWhatsapp}
                        onChange={(e) => setAlertWhatsapp(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>WhatsApp Notification</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={alertEmail}
                        onChange={(e) => setAlertEmail(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>Confidential Email</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={alertSms}
                        onChange={(e) => setAlertSms(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>SMS Alert</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                  >
                    Save & Encrypt Alert
                  </button>
                </div>
              </form>
            )}

            {/* Alerts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {alert.frequency} Alert
                        </span>
                        <h4 className="text-base font-serif font-bold text-white mt-1">{alert.name}</h4>
                      </div>

                      <button
                        onClick={() => handleToggleAlertActive(alert.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                          alert.active
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {alert.active ? 'Active' : 'Paused'}
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-stone-300 mt-3">
                      <p className="flex items-center gap-1.5 text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Location: <strong className="text-stone-200">{alert.location}</strong></span>
                      </p>
                      <p className="text-stone-400">
                        Type: <strong className="text-stone-200">{alert.propertyType}</strong>
                      </p>
                      <p className="text-stone-400">
                        Budget: <strong className="text-amber-400">{formatINR(alert.minBudget, true)} - {formatINR(alert.maxBudget, true)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 mt-4 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {alert.matchedCount} Live Matches in Coonoor
                    </span>

                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAVED PROPERTIES WATCHLIST */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Your Encrypted Estate Watchlist</h3>
                <p className="text-xs text-stone-400">Track price movements and schedule visits for your bookmarked Nilgiris estates.</p>
              </div>
            </div>

            {savedPropertiesList.length === 0 ? (
              <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-12 text-center max-w-md mx-auto">
                <Heart className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h4 className="text-base font-serif font-bold text-white">Your Watchlist is Empty</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Click the heart icon on any Nilgiris estate listing to save it to your encrypted investor vault.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPropertiesList.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] bg-stone-950">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => onToggleSave(prop.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-serif text-xl font-bold text-white mb-1">
                          {currency === 'INR' ? formatINR(prop.price, true) : formatUSD(prop.price)}
                        </p>
                        <h4 className="text-sm font-semibold text-stone-200 line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-stone-400 mt-1">{prop.location}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-800 flex gap-2">
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVESTMENT PORTFOLIO & ASSET TRACKER */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Nilgiris Investment Portfolio</h3>
                <p className="text-xs text-stone-400">Real-time valuation, rental cash flow, and equity growth tracker.</p>
              </div>

              <button
                onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Acquired Estate</span>
              </button>
            </div>

            {/* Add Portfolio Form Modal */}
            {showAddPortfolio && (
              <form onSubmit={handleAddPortfolioItem} className="bg-stone-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                  <h4 className="text-base font-serif font-bold text-white">Record Acquired Real Estate Asset</h4>
                  <button type="button" onClick={() => setShowAddPortfolio(false)} className="text-stone-400 text-xs">Close</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Estate Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coonoor Tea Cottage No. 4"
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Micro-Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bedford / Upper Coonoor"
                      value={portLocation}
                      onChange={(e) => setPortLocation(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Acquisition Price (₹)</label>
                    <input
                      type="number"
                      required
                      step="500000"
                      value={portPurchasePrice}
                      onChange={(e) => setPortPurchasePrice(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Current Estimated Value (₹)</label>
                    <input
                      type="number"
                      required
                      step="500000"
                      value={portCurrentValue}
                      onChange={(e) => setPortCurrentValue(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Monthly Rental Income (₹)</label>
                    <input
                      type="number"
                      required
                      step="5000"
                      value={portMonthlyRent}
                      onChange={(e) => setPortMonthlyRent(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-stone-400 mb-1">Remaining Mortgage Balance (₹)</label>
                    <input
                      type="number"
                      required
                      step="500000"
                      value={portMortgage}
                      onChange={(e) => setPortMortgage(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs">
                    Save to Encrypted Vault
                  </button>
                </div>
              </form>
            )}

            {/* Portfolio Summary Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <p className="text-xs text-stone-400 uppercase">Gross Portfolio Value</p>
                <p className="text-xl font-serif font-bold text-white mt-1">{formatINR(totalPortfolioValue, true)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <p className="text-xs text-stone-400 uppercase">Monthly Rental Yield</p>
                <p className="text-xl font-serif font-bold text-emerald-400 mt-1">{formatINR(totalMonthlyRentalIncome)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <p className="text-xs text-stone-400 uppercase">Active Debt / Mortgages</p>
                <p className="text-xl font-serif font-bold text-stone-300 mt-1">{formatINR(totalRemainingMortgage, true)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/30">
                <p className="text-xs text-amber-400 uppercase font-semibold">Net Equity</p>
                <p className="text-xl font-serif font-bold text-amber-400 mt-1">{formatINR(totalNetEquity, true)}</p>
              </div>
            </div>

            {/* Portfolio Assets Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase font-sans text-[11px]">
                    <th className="py-3 px-3">Estate Asset</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Acquisition Cost</th>
                    <th className="py-3 px-3">Est. Current Value</th>
                    <th className="py-3 px-3">Appreciation</th>
                    <th className="py-3 px-3">Monthly Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {portfolio.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-950/40">
                      <td className="py-3 px-3 font-semibold text-white">{item.propertyTitle}</td>
                      <td className="py-3 px-3 text-stone-400">{item.location}</td>
                      <td className="py-3 px-3 font-mono text-stone-300">{formatINR(item.purchasePrice, true)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-white">{formatINR(item.currentValue, true)}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-400">+{item.appreciationPct}%</td>
                      <td className="py-3 px-3 font-mono text-amber-400">{formatINR(item.monthlyRentalIncome)}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
