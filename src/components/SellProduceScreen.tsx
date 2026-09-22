import React, { useState } from 'react';
import { ProduceItem, ScreenId } from '../types';
import { Sparkles, CheckCircle2, Truck } from 'lucide-react';

interface SellProduceScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onAddProduct: (item: ProduceItem) => void;
  onShowToast: (msg: string) => void;
}

interface CropMeta {
  name: string;
  emoji: string;
  category: 'vegetables' | 'grains' | 'fruits';
  min: number;
  optimal: number;
  max: number;
  demand: string;
  demandPercent: number;
}

const CROPS_META: Record<string, CropMeta> = {
  Tomato: { name: 'Tomato', emoji: '🍅', category: 'vegetables', min: 28, optimal: 34, max: 40, demand: 'HIGH ↑', demandPercent: 82 },
  Onion: { name: 'Onion', emoji: '🧅', category: 'vegetables', min: 38, optimal: 45, max: 50, demand: 'STABLE', demandPercent: 60 },
  Potato: { name: 'Potato', emoji: '🥔', category: 'vegetables', min: 18, optimal: 22, max: 26, demand: 'STABLE', demandPercent: 55 },
  Palak: { name: 'Palak', emoji: '🥬', category: 'vegetables', min: 14, optimal: 18, max: 22, demand: 'HIGH ↑', demandPercent: 78 },
  Makka: { name: 'Makka (Corn)', emoji: '🌽', category: 'grains', min: 22, optimal: 28, max: 32, demand: 'HIGH ↑', demandPercent: 70 },
  Wheat: { name: 'Wheat (Sharbati)', emoji: '🌾', category: 'grains', min: 38, optimal: 44, max: 48, demand: 'HIGH ↑', demandPercent: 88 }
};

export const SellProduceScreen: React.FC<SellProduceScreenProps> = ({
  onNavigate,
  onAddProduct,
  onShowToast
}) => {
  const [selectedCropName, setSelectedCropName] = useState<string>('Tomato');
  const [quantity, setQuantity] = useState<number>(200);
  const [price, setPrice] = useState<number>(34);
  const [harvestDate, setHarvestDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Mixed'>('Grade A');
  const [deliveryMethod, setDeliveryMethod] = useState<'platform' | 'self'>('platform');

  const currentCrop = CROPS_META[selectedCropName] || CROPS_META['Tomato'];

  const handleSelectCrop = (cropName: string) => {
    setSelectedCropName(cropName);
    const meta = CROPS_META[cropName];
    if (meta) {
      setPrice(meta.optimal);
    }
  };

  const grossEarnings = quantity * price;
  const platformFee = Math.round(grossEarnings * 0.05);
  const netEarnings = grossEarnings - platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0 || price <= 0) {
      onShowToast('Please enter valid quantity and price.');
      return;
    }

    const newProduce: ProduceItem = {
      id: `prod-user-${Date.now()}`,
      name: `${selectedCropName} (${grade})`,
      category: currentCrop.category,
      emoji: currentCrop.emoji,
      farmName: 'Ramesh Patel Farm (You)',
      location: 'Village Sonpur, Vidisha District, MP',
      pricePerKg: price,
      unit: 'kg',
      availableKg: quantity,
      rating: 5.0,
      reviewsCount: 1,
      isFreshToday: true,
      deliveryHours: deliveryMethod === 'platform' ? 2 : 4,
      farmerAadhaarVerified: true,
      harvestTime: `Harvested ${harvestDate}`,
      grade: grade,
      description: `Freshly listed ${selectedCropName} lot from local farm. ${grade} standard certified with direct farm pickup.`
    };

    onAddProduct(newProduce);
    onShowToast(`✅ Successfully listed ${quantity}kg ${selectedCropName}!`);
    onNavigate('s-home');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Header */}
      <div
        className="px-4 pt-3.5 pb-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-soil text-xl font-extrabold text-[#EDD9B8]">
              🌱 Sell Produce
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 mt-0.5 font-medium">
              List your harvest · Direct buyer lock
            </p>
          </div>
          <span className="bg-[rgba(107,191,107,0.25)] border border-[#6BBF6B]/40 rounded-lg px-2 py-0.5 text-[10px] text-[#6BBF6B] font-bold">
            Verified ✓
          </span>
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Crop Selector Grid */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text2)] tracking-wider uppercase mb-1.5">
              Select Crop to Sell
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(CROPS_META).map((name) => {
                const c = CROPS_META[name];
                const isSelected = selectedCropName === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelectCrop(name)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)] text-[var(--leaf2)] font-bold shadow-xs'
                        : 'border-[var(--border)] bg-[var(--cream2)] text-[var(--text2)] hover:bg-[var(--leaf-pale)]'
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{c.emoji}</span>
                    <span className="text-[11px] block truncate">{c.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Price Suggestion Box */}
          <div className="bg-[var(--leaf-pale)] rounded-2xl p-3.5 border border-[rgba(45,106,45,0.25)] shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--leaf2)] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>AI Price Suggestion · {selectedCropName} Today</span>
            </div>

            <div className="flex justify-between items-center text-center bg-white/60 rounded-xl p-2 mb-2 border border-[var(--leaf2)]/20">
              <div>
                <div className="text-[9px] text-[var(--text3)] uppercase font-semibold">Min</div>
                <div className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
                  ₹{currentCrop.min}
                </div>
              </div>
              <div className="border-x border-[var(--leaf2)]/30 px-3">
                <div className="text-[9px] text-[var(--leaf2)] uppercase font-bold">Optimal</div>
                <div className="font-serif-soil text-lg font-extrabold text-[var(--leaf2)]">
                  ₹{currentCrop.optimal}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-[var(--text3)] uppercase font-semibold">Max</div>
                <div className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
                  ₹{currentCrop.max}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[var(--text3)] mb-1">
              <span>Market Demand Index</span>
              <span className="font-bold text-[var(--leaf2)]">{currentCrop.demand}</span>
            </div>
            <div className="h-1.5 bg-[rgba(45,106,45,0.15)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--leaf2)] rounded-full transition-all duration-500"
                style={{ width: `${currentCrop.demandPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Quantity & Price Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1">
                Quantity (kg)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1">
                Price (₹ / kg)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
                required
              />
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1">
              Harvest Date
            </label>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
            />
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1">
              Quality Grade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Grade A', 'Grade B', 'Mixed'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    grade === g
                      ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] text-[var(--leaf2)] shadow-xs'
                      : 'bg-[var(--cream2)] border-[var(--border)] text-[var(--text2)]'
                  }`}
                >
                  {g === 'Grade A' ? '🏆 ' : g === 'Grade B' ? '✅ ' : '📦 '}
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1">
              Delivery Logistics
            </label>
            <div className="space-y-1.5">
              <div
                onClick={() => setDeliveryMethod('platform')}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  deliveryMethod === 'platform'
                    ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)]'
                    : 'border-[var(--border)] bg-[var(--cream2)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🚛</span>
                  <span className="text-xs font-bold text-[var(--text)]">
                    Platform Cold-Chain Pickup
                  </span>
                </div>
                <span className="text-[10px] text-[var(--leaf2)] font-bold">Free</span>
              </div>

              <div
                onClick={() => setDeliveryMethod('self')}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  deliveryMethod === 'self'
                    ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)]'
                    : 'border-[var(--border)] bg-[var(--cream2)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🏍️</span>
                  <span className="text-xs font-semibold text-[var(--text2)]">
                    Self Transport to Mandi
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text3)]">You arrange</span>
              </div>
            </div>
          </div>

          {/* Earnings Preview */}
          <div className="bg-[var(--amber-pale)] border border-[var(--amber)]/25 rounded-2xl p-3 shadow-xs space-y-1">
            <div className="text-xs font-bold text-[var(--amber)]">
              💰 Direct Bank Earnings Preview
            </div>
            <div className="text-xs text-[var(--text2)]">
              {quantity}kg × ₹{price} ={' '}
              <strong className="text-[var(--text)]">₹{grossEarnings.toLocaleString('en-IN')}</strong>
            </div>
            <div className="text-[10px] text-[var(--text3)]">
              Platform fee 5%: -₹{platformFee} · Direct deposit to SBI ****4821:{' '}
              <strong className="text-[var(--leaf2)] font-bold text-xs">
                ₹{netEarnings.toLocaleString('en-IN')}
              </strong>{' '}
              within 24 hours of dispatch.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: 'var(--soil)', color: '#EDD9B8' }}
          >
            📤 List Produce on Live Marketplace →
          </button>
        </form>

        <div className="h-4"></div>
      </div>
    </div>
  );
};
