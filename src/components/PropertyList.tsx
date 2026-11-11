import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Heart, 
  Bed, 
  Bath, 
  Maximize, 
  TrendingUp, 
  ShieldCheck, 
  Calculator, 
  Eye, 
  Compass, 
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
import { Property, PropertyType, PropertyingsFilters } from '../types';
import { formatINR, formatUSD } from '../utils/mortgage';

interface PropertyListProps {
  properties: Property[];
  currency: 'INR' | 'USD';
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenMortgageForProperty: (property: Property) => void;
  onContactAgentForProperty: (property: Property) => void;
  externalFilters?: Partial<PropertyingsFilters>;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  currency,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onOpenMortgageForProperty,
  onContactAgentForProperty,
  externalFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState(externalFilters?.searchQuery || '');
  const [selectedLocation, setSelectedLocation] = useState(externalFilters?.location || 'All');
  const [selectedType, setSelectedType] = useState<PropertyType>(externalFilters?.propertyType || 'All');
  const [minPrice, setMinPrice] = useState<number>(externalFilters?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState<number>(externalFilters?.maxPrice || 400000000);
  const [bedrooms, setBedrooms] = useState<number | 'all'>(externalFilters?.bedrooms || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'roi-desc' | 'newest'>('featured');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync external filters when changed from hero
  React.useEffect(() => {
    if (externalFilters?.location) setSelectedLocation(externalFilters.location);
    if (externalFilters?.propertyType) setSelectedType(externalFilters.propertyType);
    if (externalFilters?.maxPrice) setMaxPrice(externalFilters.maxPrice);
    if (externalFilters?.minPrice !== undefined) setMinPrice(externalFilters.minPrice);
  }, [externalFilters]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedType('All');
    setMinPrice(0);
    setMaxPrice(400000000);
    setBedrooms('all');
    setSortBy('featured');
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          prop.title.toLowerCase().includes(query) ||
          prop.location.toLowerCase().includes(query) ||
          prop.description.toLowerCase().includes(query) ||
          prop.amenities.some(a => a.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        const locLower = selectedLocation.toLowerCase();
        if (!prop.location.toLowerCase().includes(locLower) && !prop.microMarket.toLowerCase().includes(locLower)) {
          return false;
        }
      }

      // Property type filter
      if (selectedType !== 'All' && prop.type !== selectedType) {
        return false;
      }

      // Price range filter
      if (prop.price < minPrice || prop.price > maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (bedrooms !== 'all') {
        if (prop.bedrooms < bedrooms) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'roi-desc') return b.roiEstimatePct - a.roiEstimatePct;
      if (sortBy === 'newest') return b.yearBuilt - a.yearBuilt;
      // Default: featured first, then price desc
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.price - a.price;
    });
  }, [properties, searchQuery, selectedLocation, selectedType, minPrice, maxPrice, bedrooms, sortBy]);

  return (
    <section id="properties-section" className="py-12 bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Exclusive Nilgiris Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Featured Property Listings
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-xl">
              Showing verified estates across Nilgiris, Chennai, Coimbatore, Kodaikanal, and Chettinad with active RERA documentation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
              <strong className="text-amber-400">{filteredProperties.length}</strong> of {properties.length} Estates Available
            </span>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-xs text-stone-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>{showAdvancedFilters ? 'Hide Filters' : 'Refine Filters'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by Keyword */}
            <div className="relative">
              <label htmlFor="search-input" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Keyword or Estate Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="e.g. Glenburn, ECR, Tea, Beachfront..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Location selector */}
            <div>
              <label htmlFor="location-select" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Location in Tamil Nadu
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                <select
                  id="location-select"
                  aria-label="Filter by Location in Tamil Nadu"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  <option value="All">All over Tamil Nadu</option>
                  <option value="Bedford">Bedford, Coonoor</option>
                  <option value="Upper Coonoor">Upper Coonoor</option>
                  <option value="Wellington">Wellington Cantonment</option>
                  <option value="Ketti Valley">Ketti Valley</option>
                  <option value="Kotagiri">Kotagiri Ridge</option>
                  <option value="Chennai">Chennai (ECR & Poes Garden)</option>
                  <option value="Coimbatore">Coimbatore (Race Course)</option>
                  <option value="Kodaikanal">Kodaikanal (Pine Forests)</option>
                  <option value="Pollachi">Pollachi (Anamalai Estates)</option>
                  <option value="Chettinad">Chettinad (Heritage Palaces)</option>
                  <option value="Yercaud">Yercaud (Shevaroys Hills)</option>
                </select>
              </div>
            </div>

            {/* Property Type selector */}
            <div>
              <label htmlFor="property-type-select" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Estate / Property Type
              </label>
              <select
                id="property-type-select"
                aria-label="Filter by Property Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PropertyType)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                <option value="All">All Property Types</option>
                <option value="Tea Plantation Estate">Tea Plantation Estates</option>
                <option value="Heritage Bungalow">Heritage Colonial Bungalows</option>
                <option value="Luxury Villa">Luxury Hill Villas</option>
                <option value="Hill Cottage">Hill Cottages</option>
                <option value="Commercial Estate">Commercial Estates</option>
                <option value="Scenic Land / Plot">Scenic Land / Plots</option>
              </select>
            </div>

            {/* Sorting options */}
            <div>
              <label htmlFor="sort-by-select" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Sort Listings By
              </label>
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <select
                  id="sort-by-select"
                  aria-label="Sort Listings By"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                >
                  <option value="featured">Viwin's Featured & Exclusive</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="roi-desc">Highest Projected ROI %</option>
                  <option value="newest">Newest Architecture</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced collapsible drawer: Budget Range and Bedrooms */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-150">
              {/* Budget Range Slider Starting 15 Lakhs */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Maximum Budget: {formatINR(maxPrice, true)} (From ₹15 Lakhs)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMaxPrice(1500000)}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      ₹15 L
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(5000000)}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      ₹50 L
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(20000000)}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      ₹2 Cr
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(100000000)}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      ₹10 Cr
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(400000000)}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                    >
                      ₹40 Cr+
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={1500000}
                  max={400000000}
                  step={500000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1 font-mono">
                  <span>₹15 Lakhs</span>
                  <span>₹50 Lakhs</span>
                  <span>₹10.0 Cr</span>
                  <span>₹40.0 Cr+</span>
                </div>
              </div>

              {/* Bedrooms selection */}
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Minimum Bedrooms
                </span>
                <div className="flex items-center gap-2">
                  {(['all', 3, 4, 5] as const).map((b) => (
                    <button
                      key={String(b)}
                      type="button"
                      onClick={() => setBedrooms(b)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        bedrooms === b
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-950 text-stone-300 border border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      {b === 'all' ? 'Any BHK' : `${b}+ BHK`}
                    </button>
                  ))}

                  <button
                    onClick={handleResetFilters}
                    className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-400 transition-colors ml-auto"
                    title="Reset all search filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Compass className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              No matching Nilgiris estates found
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Try adjusting your micro-location filter, raising your maximum budget, or resetting all filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((prop) => {
            const isSaved = savedPropertyIds.includes(prop.id);
            const formattedPrice = currency === 'INR' 
              ? formatINR(prop.price, true) 
              : formatUSD(prop.price);

            return (
              <article
                key={prop.id}
                className="group bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
                        {prop.type}
                      </span>
                      {prop.status === 'Exclusive' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
                          Exclusive
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(prop.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isSaved
                          ? 'bg-rose-500 text-white'
                          : 'bg-stone-950/70 text-stone-300 hover:text-white'
                      }`}
                      aria-label={isSaved ? "Remove from saved vault" : "Save to encrypted vault"}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-200">
                    <span className="flex items-center gap-1 text-[11px] bg-stone-950/80 px-2 py-0.5 rounded backdrop-blur-sm">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {prop.microMarket}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px] bg-stone-950/80 px-2 py-0.5 rounded backdrop-blur-sm font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      {prop.roiEstimatePct}% Exp. ROI
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price and RERA badge */}
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="font-serif text-2xl font-bold text-white tracking-tight">
                        {formattedPrice}
                      </p>
                      {prop.reraApproved && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> RERA
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onSelectProperty(prop)}
                      className="font-serif text-lg font-bold text-stone-100 hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer mb-2"
                    >
                      {prop.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                      {prop.description}
                    </p>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-xs text-stone-300 mb-4">
                      {prop.bedrooms > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{prop.bedrooms} BHK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Clear Plot</span>
                        </div>
                      )}

                      {prop.areaSqFt > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Maximize className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{prop.areaSqFt.toLocaleString()} sqft</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Site Ready</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-stone-400">
                        <span className="text-[11px] font-mono text-stone-300 truncate">
                          {prop.landArea || `${prop.elevationFt} ft`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-stone-800/80 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>

                    <button
                      onClick={() => onOpenMortgageForProperty(prop)}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                      title="Calculate EMI & Mortgage for this estate"
                      aria-label="Calculate mortgage for this estate"
                    >
                      <Calculator className="w-4 h-4 text-amber-400" />
                    </button>

                    <button
                      onClick={() => onContactAgentForProperty(prop)}
                      className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition-colors"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
