import React, { useState, useMemo } from 'react';
import { ProduceItem, ProductCategory, ScreenId } from '../types';
import { MANDI_PRICES } from '../data/agriData';
import { Camera, Star, ShieldCheck, Download } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { motion } from 'framer-motion';

interface HomeScreenProps {
  products: ProduceItem[];
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
  onSelectProduct: (product: ProduceItem) => void;
  onAddToCart: (product: ProduceItem) => void;
  onOpenOriginModal?: (produceId?: string) => void;
  onOpenQRScanner?: () => void;
  onOpenVendorReviews?: (product: ProduceItem) => void;
  onOpenInstallModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  cartCount,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onOpenOriginModal,
  onOpenQRScanner,
  onOpenVendorReviews,
  onOpenInstallModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '🌾 All Produce' },
    { id: 'top-rated', label: '⭐ Top Rated (4.8+)' },
    { id: 'dairy', label: '🥛 Daily Dairy' },
    { id: 'staples', label: '🍞 Daily Staples' },
    { id: 'materials', label: '🪵 Farm Materials' },
    { id: 'vegetables', label: '🥦 Vegetables' },
    { id: 'fruits', label: '🍎 Fruits' },
    { id: 'grains', label: '🌾 Grains' },
    { id: 'herbs', label: '🌿 Herbs' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === 'all' ||
        (activeCategory === 'top-rated' ? p.rating >= 4.8 : p.category === activeCategory);
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Top Header */}
      <div
        className="px-4 pt-3.5 pb-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-soil text-xl font-extrabold text-[#EDD9B8]">
              🌱 Soil Mates
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 flex items-center gap-1 mt-0.5 font-medium">
              <span>📍</span> Bhopal, MP · 48 verified local farms
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Camera QR Tag Scanner */}
            {onOpenQRScanner && (
              <button
                onClick={onOpenQRScanner}
                className="p-1.5 px-2.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5 transition-colors shadow-xs active:scale-95"
                title="Scan Physical Produce Crate Tag with Camera"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Scan Tag</span>
              </button>
            )}

            {/* Trace Origin QR Button */}
            <button
              onClick={() => onOpenOriginModal?.()}
              className="p-1.5 px-2 rounded-xl bg-[rgba(107,191,107,0.25)] hover:bg-[#6BBF6B]/35 border border-[#6BBF6B]/40 text-[#6BBF6B] text-[10px] font-bold flex items-center gap-1 transition-colors"
              title="Trace Produce Origin via Blockchain"
            >
              <span>🔗</span>
              <span className="hidden sm:inline">Trace</span>
            </button>



            {/* Cart Button */}
            <button
              onClick={() => onNavigate('s-cart')}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="View Cart"
            >
              <span className="text-lg">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C0392B] text-[9px] font-extrabold text-white flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onNavigate('s-profile')}
              className="w-8 h-8 rounded-full bg-[#EDD9B8]/20 border border-[#EDD9B8]/30 flex items-center justify-center text-sm cursor-pointer hover:bg-[#EDD9B8]/30 transition-colors"
              title="My Farm Profile"
            >
              👤
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-2.5 bg-white/15 rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10">
          <span className="text-white/60 text-xs">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, verified farmers, mandi produce..."
            className="w-full bg-transparent border-none outline-none text-xs text-[#EDD9B8] placeholder:text-[#EDD9B8]/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-white/60 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
        {/* Real-time Agricultural Weather & Irrigation Advisory Widget */}
        <WeatherWidget />

        {/* Farm Direct Banner with High-Fidelity Harvest Visual */}
        <div className="rounded-2xl relative overflow-hidden shadow-xs border border-[var(--border)] group">
          <img
            src="/src/assets/images/hero_organic_harvest_1791568854320.jpg"
            alt="Lush organic farm harvest at golden morning light"
            referrerPolicy="no-referrer"
            className="w-full h-44 object-cover brightness-[0.88] transition-transform duration-500 group-hover:scale-105"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 flex flex-col justify-end p-4 text-white">
            <div className="text-[11px] font-semibold tracking-wider text-[#6BBF6B] uppercase">
              Farmgate Fresh Guarantee
            </div>
            <h3 className="font-serif-soil text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
              Direct From Soil to Kitchen Table
            </h3>
            <p className="text-xs text-stone-200 mt-1 max-w-[90%] font-medium">
              Zero middlemen · 100% fair farmer payout · Harvested at dawn
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onNavigate('s-ai')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔬</span>
                <span>AI Crop Doctor</span>
              </button>

              {onOpenQRScanner && (
                <button
                  onClick={onOpenQRScanner}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-semibold flex items-center gap-1.5 border border-white/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span>Scan Crate</span>
                </button>
              )}

              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/80 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 border border-amber-300/40 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>APK</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'bg-[var(--white)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
              }`}
            >
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Section Heading with Count */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="font-serif-soil text-sm font-bold text-[var(--text)]">
            {activeCategory === 'top-rated'
              ? '⭐ Highest-Rated Farmers (≥ 4.8★)'
              : 'Direct Farmgate Produce'}
          </h3>
          <span className="text-[10px] text-[var(--text3)]">
            {filteredProducts.length} items available
          </span>
        </div>

        {/* Product Grid with Framer Motion cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                onSelectProduct(p);
                onNavigate('s-buy');
              }}
              className="bg-[var(--white)] rounded-2xl overflow-hidden border border-[var(--border)] cursor-pointer hover:shadow-md transition-all flex flex-col group"
            >
              {/* Product Visual */}
              <div className="h-28 bg-[var(--leaf-pale)] flex items-center justify-center text-5xl relative overflow-hidden">
                <span className="transform transition-transform duration-300 group-hover:scale-110">{p.emoji}</span>
                {p.discountPercent ? (
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    Save {p.discountPercent}%
                  </span>
                ) : null}
              </div>

              {/* Product Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Quiet unboxed kicker */}
                  <div className="text-[10px] text-[var(--soil3)] font-medium flex items-center gap-1.5">
                    <span>{p.isOrganic ? 'Certified Organic' : 'Direct Farmgate'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.grade}</span>
                  </div>

                  <div className="text-sm font-bold text-[var(--text)] mt-0.5 line-clamp-1 group-hover:text-[var(--soil2)] transition-colors">
                    {p.name}
                  </div>

                  <div className="text-[11px] text-[var(--text2)] flex items-center justify-between mt-1">
                    <span className="truncate">{p.farmName}</span>
                    <span className="text-[10px] font-medium text-[var(--soil3)] shrink-0 tabular-nums">
                      {p.availableKg} {p.unit}
                    </span>
                  </div>

                  {/* Rating & Trust */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVendorReviews?.(p);
                    }}
                    className="flex items-center gap-1 mt-1.5 cursor-pointer py-0.5"
                    title="View Farmer Reviews & Trust Credentials"
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span className="text-xs font-bold text-[var(--text)] tabular-nums">
                      {p.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-[var(--text3)]">
                      ({p.reviewsCount})
                    </span>
                    {p.vendorTrustScore && (
                      <span className="ml-auto text-[10px] font-medium text-emerald-800">
                        {p.vendorTrustScore}% trust
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenOriginModal?.(p.id);
                    }}
                    className="text-[10px] text-[var(--soil)] font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>Origin details →</span>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--border)]">
                  <div>
                    <span className="font-serif-soil text-base font-bold text-[var(--soil)] tabular-nums">
                      ₹{p.pricePerKg}
                    </span>
                    <span className="text-xs text-[var(--text3)] font-medium">/{p.unit}</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(p);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-[#2D5A27] hover:bg-[#3E7338] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer min-h-[32px] min-w-[32px]"
                    title="Add to cart"
                  >
                    + Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Market Prices Card */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-serif-soil text-sm font-bold text-[var(--text)]">
              📊 Live Market Prices
            </h3>
            <span
              onClick={() => onNavigate('s-market')}
              className="text-[11px] text-[var(--leaf2)] font-bold cursor-pointer hover:underline"
            >
              Full board →
            </span>
          </div>

          <div className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)] divide-y divide-[var(--leaf-pale)]">
            {MANDI_PRICES.slice(0, 3).map((m) => (
              <div key={m.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">{m.crop}</div>
                    <div className="text-[10px] text-[var(--text3)]">{m.unit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif-soil text-xs font-extrabold text-[var(--text)]">
                    ₹{m.price}
                  </div>
                  <div
                    className={`text-[10px] font-bold ${
                      m.changeType === 'up' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {m.changeType === 'up' ? '▲' : '▼'} {m.changeType === 'up' ? '+' : '-'}
                    {m.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
