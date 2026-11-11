import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Compass, 
  Layers, 
  Calendar, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  Percent, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { MARKET_METRICS } from '../data/mockData';
import { formatINR } from '../utils/mortgage';

export const AnalyticsDashboard: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState(MARKET_METRICS[0].microMarket);

  const activeMetric = MARKET_METRICS.find(m => m.microMarket === selectedMarket) || MARKET_METRICS[0];

  return (
    <section 
      id="analytics-section" 
      className="py-12 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ 
              backgroundColor: 'var(--accent-subtle)', 
              borderColor: 'var(--border-accent)',
              color: 'var(--accent)'
            }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Viwin Nilgiris Intelligence Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Nilgiris Real Estate Performance Analytics
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            Independent capital appreciation indices, capital growth velocity, and gross rental yield benchmarks across Coonoor micro-markets.
          </p>
        </div>

        {/* Micro-Market Selector Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {MARKET_METRICS.map((metric) => (
            <button
              key={metric.microMarket}
              onClick={() => setSelectedMarket(metric.microMarket)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedMarket === metric.microMarket
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              {metric.microMarket}
            </button>
          ))}
        </div>

        {/* Active Metric Spotlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Avg Capital Value</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-white">
              ₹{activeMetric.avgPriceSqFt.toLocaleString()}
              <span className="text-xs font-sans text-stone-400 font-normal"> / sq ft</span>
            </p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+{activeMetric.yearlyAppreciationPct}% Year-over-Year</span>
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Gross Rental Yield</span>
              <Percent className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-emerald-400">
              {activeMetric.rentalYieldPct}%
              <span className="text-xs font-sans text-stone-400 font-normal"> p.a.</span>
            </p>
            <p className="text-[11px] text-stone-400 mt-2">
              Boutique hill homestay & long-lease average
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Velocity (Days on Market)</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-white">
              {activeMetric.avgDaysOnMarket} Days
            </p>
            <p className="text-[11px] text-amber-400 mt-2">
              High buyer liquidity in Bedford corridor
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Active Verified Inventory</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-white">
              {activeMetric.activeListings} Estates
            </p>
            <p className="text-[11px] text-stone-400 mt-2">
              Strictly RERA & Patta verified listings
            </p>
          </div>
        </div>

        {/* Visual Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Price per sq ft comparative chart */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
              <span>Nilgiris Capital Rate Benchmarking (₹/sq ft)</span>
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Comparative average land & villa values across key Nilgiris residential micro-markets.
            </p>

            <div className="space-y-4">
              {MARKET_METRICS.map((item) => {
                const maxVal = 18000;
                const barWidth = Math.round((item.avgPriceSqFt / maxVal) * 100);
                const isCurrent = item.microMarket === selectedMarket;

                return (
                  <div key={item.microMarket} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium ${isCurrent ? 'text-amber-400 font-bold' : 'text-stone-300'}`}>
                        {item.microMarket}
                      </span>
                      <span className="font-mono text-stone-300">₹{item.avgPriceSqFt.toLocaleString()}/sq ft</span>
                    </div>
                    <div className="h-3 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCurrent ? 'bg-amber-400' : 'bg-stone-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Annual Appreciation Rate Comparative Chart */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
              <span>Annual Appreciation Velocity (%)</span>
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              12-Month capital growth rates recorded for high-altitude tea plantations and luxury villas.
            </p>

            <div className="space-y-4">
              {MARKET_METRICS.map((item) => {
                const maxPct = 25;
                const barWidth = Math.round((item.yearlyAppreciationPct / maxPct) * 100);
                const isCurrent = item.microMarket === selectedMarket;

                return (
                  <div key={item.microMarket} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium ${isCurrent ? 'text-amber-400 font-bold' : 'text-stone-300'}`}>
                        {item.microMarket}
                      </span>
                      <span className="font-mono text-emerald-400 font-semibold">+{item.yearlyAppreciationPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCurrent ? 'bg-emerald-400' : 'bg-emerald-700/60'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Viwin Nilgiris Market Commentary Callout */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/30 border border-amber-500/20 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Quarterly Market Outlook • Tamil Nadu Luxury Corridors
              </span>
              <h4 className="text-xl font-serif font-bold text-white">
                "Rising Capital Flow into Nilgiris Estates, Chennai Coastal Mansions & Coimbatore Penthouses"
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                HNW and NRI investors are actively diversifying into high-yield Tamil Nadu properties—from Coonoor tea plantations and Kodaikanal pine retreats to beachfront estates on Chennai's ECR and executive penthouses in Coimbatore. Stringent environmental title clearances and strong domestic tourism sustain high capital appreciation of 14% to 19.5% annually.
              </p>
            </div>

            <div className="shrink-0 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-center">
              <p className="text-[11px] text-stone-400 uppercase">Quarterly Investor Confidence</p>
              <p className="text-2xl font-serif font-bold text-amber-400 mt-1">94.8 / 100</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Bullish Sentiment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
