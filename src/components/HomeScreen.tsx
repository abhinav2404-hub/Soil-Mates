import React, { useState, useMemo } from 'react';
import { ProduceItem, ProductCategory, ScreenId } from '../types';
import { MANDI_PRICES } from '../data/agriData';
import { Camera, Star, ShieldCheck } from 'lucide-react';

interface HomeScreenProps {
  products: ProduceItem[];
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
  onSelectProduct: (product: ProduceItem) => void;
  onAddToCart: (product: ProduceItem) => void;
  onOpenOriginModal?: (produceId?: string) => void;
  onOpenQRScanner?: () => void;
  onOpenVendorReviews?: (product: ProduceItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  cartCount,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onOpenOriginModal,
  onOpenQRScanner,
  onOpenVendorReviews
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '🌾 All Produce' },
    { id: 'top-rated', label: '⭐ Top Rated (4.8+)' },
    { id: 'vegetables', label: '🥦 Vegetables' },
    { id: 'fruits', label: '🍎 Fruits' },
    { id: 'grains', label: '🌾 Grains' },
    { id: 'dairy', label: '🥛 Dairy' },
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
        {/* Farm Direct Banner with QR Scan Prominence */}
        <div
          className="rounded-2xl p-3.5 text-[#EDD9B8] relative overflow-hidden shadow-xs"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="relative z-10 max-w-[85%]">
            <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[9px] px-1.5 py-0.5 rounded font-extrabold tracking-wide uppercase">
              Farmgate Assurance
            </span>
            <h3 className="font-serif-soil text-sm font-extrabold text-[#EDD9B8] mt-1 leading-snug">
              Direct From Soil to Kitchen Table
            </h3>
            <p className="text-[10px] text-[#EDD9B8]/75 mt-0.5">
              100% verified farmer ratings, 0.00 PPM pesticide residue, and real-time blockchain lot verification.
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => onNavigate('s-ai')}
                className="px-3 py-1 rounded-xl text-[10px] font-bold shadow-xs active:scale-95 transition-transform"
                style={{ backgroundColor: 'var(--leaf)', color: '#EDD9B8' }}
              >
                🔬 AI Crop Doctor
              </button>

              {onOpenQRScanner && (
                <button
                  onClick={onOpenQRScanner}
                  className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[#EDD9B8] text-[10px] font-bold flex items-center gap-1 border border-white/20 transition-colors"
                >
                  <Camera className="w-3 h-3" />
                  <span>Scan Crate QR</span>
                </button>
              )}
            </div>
          </div>

          <div className="absolute -right-2 -bottom-2 text-6xl opacity-20 pointer-events-none select-none">
            🌾
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategory === cat.id
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'bg-[var(--white)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
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

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectProduct(p);
                onNavigate('s-buy');
              }}
              className="bg-[var(--white)] rounded-2xl overflow-hidden border border-[var(--border)] cursor-pointer hover:shadow-md transition-all active:scale-[0.98] flex flex-col group"
            >
              {/* Product Visual */}
              <div className="h-28 bg-[var(--leaf-pale)] flex items-center justify-center text-5xl relative">
                <span>{p.emoji}</span>
                {p.isOrganic && (
                  <span className="absolute top-2 left-2 bg-[var(--amber-pale)] text-[var(--amber)] text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border border-[var(--amber)]/30">
                    ORGANIC
                  </span>
                )}
                {p.discountPercent && (
                  <span className="absolute top-2 right-2 bg-rose-100 text-rose-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">
                    ↓ {p.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  {p.isFreshToday && !p.discountPercent && !p.isOrganic && (
                    <span className="bg-[var(--leaf-pale)] text-[var(--leaf2)] text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block mb-1">
                      ✓ Fresh Today
                    </span>
                  )}
                  <div className="text-xs font-bold text-[var(--text)] line-clamp-1 group-hover:text-[var(--leaf2)] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[var(--text3)] line-clamp-1 mt-0.5">
                    🌱 {p.farmName}
                  </div>

                  {/* Star Rating & Reviews Trigger */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVendorReviews?.(p);
                    }}
                    className="flex items-center gap-1 mt-1 cursor-pointer hover:opacity-85 py-0.5 rounded"
                    title="View Farmer Reviews & Trust Credentials"
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span className="text-[10px] font-extrabold text-[var(--text)]">
                      {p.rating.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-[var(--text3)]">
                      ({p.reviewsCount})
                    </span>
                    {p.vendorTrustScore && (
                      <span className="ml-auto text-[8px] font-extrabold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded">
                        {p.vendorTrustScore}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenOriginModal?.(p.id);
                    }}
                    className="text-[9px] text-[var(--leaf2)] font-bold hover:underline flex items-center gap-0.5 mt-1"
                  >
                    <span>🔗 Trace Origin</span>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[var(--border)]/50">
                  <div>
                    <span className="font-serif-soil text-sm font-extrabold text-[var(--leaf)]">
                      ₹{p.pricePerKg}
                    </span>
                    <span className="text-[10px] text-[var(--text3)]">/{p.unit}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(p);
                    }}
                    className="w-7 h-7 rounded-lg bg-[var(--soil)] hover:bg-[var(--soil2)] text-[#EDD9B8] flex items-center justify-center text-base font-bold transition-transform active:scale-90"
                    title="Add 1 unit to cart"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
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
