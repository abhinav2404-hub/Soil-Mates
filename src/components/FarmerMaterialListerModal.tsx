import React, { useState } from 'react';
import { ProduceItem, ProductCategory } from '../types';
import {
  X,
  Plus,
  Sparkles,
  CheckCircle2,
  Package,
  Milk,
  Wheat,
  Layers,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Tag,
  Scale,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface FarmerMaterialListerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (item: ProduceItem) => void;
  onShowToast: (msg: string) => void;
  onProceedToLogin?: () => void;
  existingProducts?: ProduceItem[];
}

interface QuickPreset {
  name: string;
  category: ProductCategory;
  emoji: string;
  defaultPrice: number;
  unit: string;
  defaultQuantity: number;
  description: string;
  badge: string;
}

const QUICK_FARM_PRESETS: QuickPreset[] = [
  {
    name: 'Fresh A2 Gir Cow Milk',
    category: 'dairy',
    emoji: '🥛',
    defaultPrice: 68,
    unit: 'Litre',
    defaultQuantity: 35,
    description: 'Fresh morning unpasteurized pure A2 Gir cow milk from Sonpur Vidisha dairy herd.',
    badge: 'Daily Morning'
  },
  {
    name: 'Traditional Bilona Cow Ghee',
    category: 'dairy',
    emoji: '🧈',
    defaultPrice: 1450,
    unit: 'kg',
    defaultQuantity: 15,
    description: 'Hand-churned Vedic Bilona curd method A2 desi cow ghee with rich golden aroma.',
    badge: 'Artisanal'
  },
  {
    name: 'Stone-Ground Sharbati Chakki Atta',
    category: 'grains',
    emoji: '🌾',
    defaultPrice: 48,
    unit: 'kg',
    defaultQuantity: 250,
    description: '100% whole grain slow cold stone-milled flour from pristine Sehore Sharbati wheat.',
    badge: 'Daily Staple'
  },
  {
    name: 'Cold-Pressed Kacchi Ghani Mustard Oil',
    category: 'staples',
    emoji: '🛢️',
    defaultPrice: 185,
    unit: 'Litre',
    defaultQuantity: 40,
    description: 'Pure single-press wooden kohlu mustard oil with sharp pungent flavor and natural antioxidants.',
    badge: 'Pantry'
  },
  {
    name: 'Raw Forest Multi-Flora Honey',
    category: 'staples',
    emoji: '🍯',
    defaultPrice: 420,
    unit: 'kg',
    defaultQuantity: 20,
    description: 'Unprocessed, unfiltered raw wild honey harvested near forest boundaries in Vidisha.',
    badge: '100% Pure'
  },
  {
    name: 'Country Free-Range Desi Eggs',
    category: 'dairy',
    emoji: '🥚',
    defaultPrice: 130,
    unit: 'Dozen',
    defaultQuantity: 18,
    description: 'Nutritious brown desi eggs from naturally pasture-fed native village fowls.',
    badge: 'Daily Fresh'
  },
  {
    name: 'Desi Sugarcane Gur (Jaggery)',
    category: 'staples',
    emoji: '🟤',
    defaultPrice: 62,
    unit: 'kg',
    defaultQuantity: 90,
    description: 'Chemical-free natural jaggery blocks made using traditional sugarcane boiling pans.',
    badge: 'Natural Sweet'
  },
  {
    name: 'Wheat Straw Cattle Fodder (Bhoosa)',
    category: 'materials',
    emoji: '🌾',
    defaultPrice: 650,
    unit: 'Quintal',
    defaultQuantity: 25,
    description: 'Clean, dust-sifted dry Sharbati wheat straw fodder packed for dairy livestock nutrition.',
    badge: 'Farm Material'
  },
  {
    name: 'Organic Enriched Vermicompost (50kg)',
    category: 'materials',
    emoji: '🪴',
    defaultPrice: 350,
    unit: '50kg Bag',
    defaultQuantity: 45,
    description: 'Eisenia fetida earthworm castings rich in beneficial microbes and organic carbon.',
    badge: 'Bio-Material'
  },
  {
    name: 'Sun-Dried Cow Dung Cakes (Uple)',
    category: 'materials',
    emoji: '🪵',
    defaultPrice: 120,
    unit: 'Pack of 20',
    defaultQuantity: 30,
    description: 'Hygienically dried desi cow dung cakes for sacred havan ceremonies and natural bio-ash.',
    badge: 'By-Product'
  }
];

export const FarmerMaterialListerModal: React.FC<FarmerMaterialListerModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onShowToast,
  onProceedToLogin,
  existingProducts = []
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'my_items'>('presets');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<ProductCategory>('dairy');
  const [emoji, setEmoji] = useState<string>('🥛');
  const [price, setPrice] = useState<number>(65);
  const [quantity, setQuantity] = useState<number>(20);
  const [unit, setUnit] = useState<string>('Litre');
  const [deliveryFrequency, setDeliveryFrequency] = useState<string>('Daily Morning 6:00 - 8:00 AM');
  const [description, setDescription] = useState<string>('');
  const [recentlyAdded, setRecentlyAdded] = useState<ProduceItem[]>([]);

  if (!isOpen) return null;

  const handleQuickAdd = (preset: QuickPreset) => {
    const newItem: ProduceItem = {
      id: `p-farm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: preset.name,
      category: preset.category,
      emoji: preset.emoji,
      farmName: 'Ramesh Patel Farm & Dairy',
      location: 'Sonpur, Vidisha, MP',
      pricePerKg: preset.defaultPrice,
      unit: preset.unit,
      availableKg: preset.defaultQuantity,
      rating: 4.9,
      reviewsCount: 14,
      vendorTrustScore: 98,
      repeatBuyerRate: 92,
      totalBatchesSold: 56,
      isFreshToday: true,
      isOrganic: true,
      deliveryHours: preset.category === 'dairy' ? 2 : 6,
      farmerAadhaarVerified: true,
      harvestTime: 'Today 5:30 AM',
      grade: 'Grade A',
      description: preset.description
    };

    onAddProduct(newItem);
    setRecentlyAdded((prev) => [newItem, ...prev]);
    onShowToast(`✅ Added ${preset.name} (${preset.defaultQuantity} ${preset.unit}) to app catalog!`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Please enter item name');
      return;
    }

    const newItem: ProduceItem = {
      id: `p-custom-${Date.now()}`,
      name: name.trim(),
      category: category,
      emoji: emoji || '📦',
      farmName: 'Ramesh Patel Farm & Materials',
      location: 'Sonpur, Vidisha, MP',
      pricePerKg: Number(price) || 50,
      unit: unit || 'kg',
      availableKg: Number(quantity) || 10,
      rating: 5.0,
      reviewsCount: 4,
      vendorTrustScore: 97,
      repeatBuyerRate: 89,
      totalBatchesSold: 28,
      isFreshToday: true,
      isOrganic: true,
      deliveryHours: category === 'dairy' ? 2 : 8,
      farmerAadhaarVerified: true,
      harvestTime: 'Today',
      grade: 'Grade A',
      description: description.trim() || `${name} produced at Sonpur farm. Schedule: ${deliveryFrequency}`
    };

    onAddProduct(newItem);
    setRecentlyAdded((prev) => [newItem, ...prev]);
    onShowToast(`🎉 Successfully listed ${name} for buyers in the app!`);

    // Reset fields
    setName('');
    setDescription('');
    setActiveTab('my_items');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--cream)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div
          className="p-4 text-[#EDD9B8] flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-xs">
              🧺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8]">
                  Farmer Daily Items & Material Lister
                </h3>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30 font-bold">
                  DIRECT FARMGATE
                </span>
              </div>
              <p className="text-[10px] text-[#EDD9B8]/75">
                List fresh dairy, daily food staples, or farm materials & by-products
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[var(--leaf-pale)] border-b border-[var(--border)] p-1 gap-1 flex-shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'presets'
                ? 'bg-white text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <span>⚡ 1-Tap Quick Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'custom'
                ? 'bg-white text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <span>✍️ Add Custom Item</span>
          </button>

          <button
            onClick={() => setActiveTab('my_items')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 relative ${
              activeTab === 'my_items'
                ? 'bg-white text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <span>📦 Listed ({recentlyAdded.length})</span>
            {recentlyAdded.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs text-[var(--text)] no-scrollbar">
          {/* TAB 1: QUICK PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 flex items-start gap-2.5">
                <span className="text-xl">✨</span>
                <div>
                  <div className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                    Instant 1-Tap Listing for Daily Farmer Items
                  </div>
                  <p className="text-[10px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                    Click <strong>"+ Add to Catalog"</strong> on any item below. It will immediately be published for local consumers & vendors in Bhopal and Vidisha.
                  </p>
                </div>
              </div>

              {/* Categorized Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_FARM_PRESETS.map((item, idx) => {
                  const isAdded = recentlyAdded.some((r) => r.name === item.name);
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-[var(--border)] rounded-2xl p-3 flex flex-col justify-between shadow-xs hover:border-[var(--leaf2)] transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <div className="font-bold text-xs text-[var(--text)] leading-tight">
                                {item.name}
                              </div>
                              <span className="text-[9px] bg-stone-100 text-stone-600 font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5">
                                {item.badge}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-[var(--text3)] mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
                        <div>
                          <div className="text-[9px] text-[var(--text3)] uppercase">Price & Stock</div>
                          <div className="text-xs font-extrabold text-[var(--leaf2)]">
                            ₹{item.defaultPrice} <span className="text-[9px] font-normal text-stone-500">/{item.unit}</span>
                          </div>
                          <div className="text-[9px] text-stone-500 font-medium">
                            Avail: {item.defaultQuantity} {item.unit}
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickAdd(item)}
                          disabled={isAdded}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1 transition-all active:scale-95 ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM ENTRY FORM */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-3 bg-white p-4 rounded-3xl border border-[var(--border)] shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <span className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
                  List Your Unique Food or Farm Material
                </span>
                <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                  Aadhaar Verified Farm
                </span>
              </div>

              {/* Item Name & Emoji */}
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                    Icon / Emoji
                  </label>
                  <select
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-lg text-center outline-none"
                  >
                    <option value="🥛">🥛 Milk</option>
                    <option value="🧈">🧈 Ghee/Butter</option>
                    <option value="🌾">🌾 Atta / Grain</option>
                    <option value="🛢️">🛢️ Oil</option>
                    <option value="🍯">🍯 Honey</option>
                    <option value="🥚">🥚 Eggs</option>
                    <option value="🟤">🟤 Jaggery</option>
                    <option value="🪵">🪵 Cow Dung</option>
                    <option value="🪴">🪴 Compost</option>
                    <option value="🌱">🌱 Seeds</option>
                    <option value="🍋">🍋 Lemons</option>
                    <option value="🌶️">🌶️ Chillies</option>
                    <option value="📦">📦 General</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                    Item / Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Buffalo Paneer, Mustard Greens, Bio-Pesticide"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Item Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('dairy');
                      setUnit('Litre');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      category === 'dairy'
                        ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)] font-bold text-[var(--leaf2)]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>🥛</span>
                    <span className="text-[11px]">Daily Dairy & Milk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('staples');
                      setUnit('kg');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      category === 'staples'
                        ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)] font-bold text-[var(--leaf2)]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>🍞</span>
                    <span className="text-[11px]">Daily Food & Staples</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('materials');
                      setUnit('Quintal');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      category === 'materials'
                        ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)] font-bold text-[var(--leaf2)]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>🌾</span>
                    <span className="text-[11px]">Farm Materials & Feed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('vegetables');
                      setUnit('kg');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-1.5 ${
                      category === 'vegetables'
                        ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)] font-bold text-[var(--leaf2)]'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>🥬</span>
                    <span className="text-[11px]">Kitchen Veggies & Herbs</span>
                  </button>
                </div>
              </div>

              {/* Quantity, Unit & Price */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                    Available Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-center outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold outline-none"
                  >
                    <option value="Litre">Litre (L)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="Dozen">Dozen</option>
                    <option value="50kg Bag">50kg Bag</option>
                    <option value="Quintal">Quintal (100kg)</option>
                    <option value="Pack">Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                    Price (₹ / unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-center text-emerald-700 outline-none"
                  />
                </div>
              </div>

              {/* Delivery Frequency & Availability */}
              <div>
                <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Availability / Dispatch Schedule
                </label>
                <select
                  value={deliveryFrequency}
                  onChange={(e) => setDeliveryFrequency(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold outline-none"
                >
                  <option value="Daily Morning 6:00 - 8:00 AM">🌅 Daily Morning (6:00 AM - 8:00 AM)</option>
                  <option value="Evening 5:00 - 7:00 PM">🌇 Evening Milking (5:00 PM - 7:00 PM)</option>
                  <option value="Instant Farmgate Pickup">🚜 Instant Farmgate Gate 1 Pickup</option>
                  <option value="Weekly Sunday Batch">📅 Weekly Scheduled Batch</option>
                </select>
              </div>

              {/* Short Quality Note */}
              <div>
                <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Quality Description / Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Freshly skimmed, natural organic feed fed cows, no additives or water added."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Item to Live App Catalogue</span>
              </button>
            </form>
          )}

          {/* TAB 3: LISTED ITEMS PREVIEW */}
          {activeTab === 'my_items' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[var(--text)]">
                  Live Farmgate Items in Market ({recentlyAdded.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Visible to All Buyers
                </span>
              </div>

              {recentlyAdded.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-[var(--border)] space-y-2">
                  <div className="text-3xl">🧺</div>
                  <div className="font-bold text-xs text-[var(--text)]">
                    No items listed in this session yet
                  </div>
                  <p className="text-[10px] text-[var(--text3)] max-w-xs mx-auto">
                    Use the <strong>1-Tap Quick Presets</strong> or <strong>Add Custom Item</strong> tab to list daily milk, food items, or farm materials.
                  </p>
                  <button
                    onClick={() => setActiveTab('presets')}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs inline-block"
                  >
                    Browse Quick Presets
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentlyAdded.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-emerald-200 rounded-2xl p-3 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <div className="font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                            <span>{item.name}</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-extrabold uppercase">
                              LIVE
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text3)] mt-0.5">
                            ₹{item.pricePerKg}/{item.unit} · Stock: {item.availableKg} {item.unit}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-bold uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-[var(--border)] flex items-center justify-between flex-shrink-0">
          <div className="text-[10px] text-stone-500">
            {recentlyAdded.length > 0 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{recentlyAdded.length} new items active in catalog</span>
              </span>
            ) : (
              <span>Farm: Ramesh Patel · Sonpur Vidisha</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                if (onProceedToLogin) {
                  onProceedToLogin();
                }
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <span>Done & View Catalog</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
