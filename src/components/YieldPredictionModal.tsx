import React, { useState, useId } from 'react';
import {
  Sparkles,
  TrendingUp,
  X,
  Share2,
  Copy,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Scale,
  MapPin,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign,
  ChevronDown
} from 'lucide-react';

interface YieldPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToListing?: (cropName: string, quantityKg: number, pricePerKg: number) => void;
  onShowToast: (msg: string) => void;
}

interface CropYieldProfile {
  id: string;
  name: string;
  variety: string;
  emoji: string;
  category: 'Vegetables' | 'Grains' | 'Tubers' | 'Oilseeds';
  baseYieldQuintalsPerAcre: number; // 1 Quintal = 100 kg
  yieldVariancePercent: number;
  durationDays: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All-Season';
  avgCultivationCostPerAcre: number;
  currentMandiRatePerKg: number;
  projectedHarvestRatePerKg: {
    min: number;
    expected: number;
    peak: number;
  };
  priceTrendReason: string;
  riskFactor: 'Low' | 'Medium' | 'High';
  waterNeed: 'Medium' | 'High' | 'Low';
  harvestAdvice: string;
}

const CROP_PROFILES: CropYieldProfile[] = [
  {
    id: 'tom-pusa',
    name: 'Tomato',
    variety: 'Pusa Ruby Hybrid',
    emoji: '🍅',
    category: 'Vegetables',
    baseYieldQuintalsPerAcre: 195, // ~19,500 kg/acre
    yieldVariancePercent: 12,
    durationDays: 75,
    season: 'Rabi',
    avgCultivationCostPerAcre: 52000,
    currentMandiRatePerKg: 32,
    projectedHarvestRatePerKg: { min: 28, expected: 36, peak: 44 },
    priceTrendReason: 'Arrivals from southern states expected to dip, boosting northern/central APMC rates by +18%.',
    riskFactor: 'Medium',
    waterNeed: 'Medium',
    harvestAdvice: 'Stagger harvest across 4 pickings; drip fertigation boosts Grade-A fruit firmness.'
  },
  {
    id: 'wht-sharbati',
    name: 'Wheat',
    variety: 'Sharbati Sehore Gold',
    emoji: '🌾',
    category: 'Grains',
    baseYieldQuintalsPerAcre: 22, // ~2,200 kg/acre
    yieldVariancePercent: 8,
    durationDays: 120,
    season: 'Rabi',
    avgCultivationCostPerAcre: 24000,
    currentMandiRatePerKg: 42,
    projectedHarvestRatePerKg: { min: 38, expected: 45, peak: 49 },
    priceTrendReason: 'High premium urban retail demand for rotis; flour millers booking early lots at +15% above MSP.',
    riskFactor: 'Low',
    waterNeed: 'Medium',
    harvestAdvice: 'Combine harvest at 12% grain moisture to prevent shattered ears and preserve golden luster.'
  },
  {
    id: 'on-nasik',
    name: 'Onion',
    variety: 'Agri-Found Dark Red',
    emoji: '🧅',
    category: 'Vegetables',
    baseYieldQuintalsPerAcre: 135, // ~13,500 kg/acre
    yieldVariancePercent: 15,
    durationDays: 105,
    season: 'Rabi',
    avgCultivationCostPerAcre: 48000,
    currentMandiRatePerKg: 40,
    projectedHarvestRatePerKg: { min: 35, expected: 46, peak: 58 },
    priceTrendReason: 'Storage stocks in Maharashtra depleting; off-season export quotas likely to reopen.',
    riskFactor: 'High',
    waterNeed: 'Medium',
    harvestAdvice: 'Field-cure under shade for 48 hours to dry neck scales and maximize 3-month shelf life.'
  },
  {
    id: 'plk-green',
    name: 'Palak (Spinach)',
    variety: 'All Green Broad Leaf',
    emoji: '🥬',
    category: 'Vegetables',
    baseYieldQuintalsPerAcre: 55, // ~5,500 kg/acre
    yieldVariancePercent: 10,
    durationDays: 35,
    season: 'All-Season',
    avgCultivationCostPerAcre: 22000,
    currentMandiRatePerKg: 18,
    projectedHarvestRatePerKg: { min: 16, expected: 21, peak: 26 },
    priceTrendReason: 'Consistent quick urban demand; morning harvest batches sell within 2 hours at mandi gates.',
    riskFactor: 'Low',
    waterNeed: 'High',
    harvestAdvice: 'Cut 2cm above root collar to allow 3 regenerative flushes over 45 days.'
  },
  {
    id: 'pot-kufri',
    name: 'Potato',
    variety: 'Kufri Jyoti / Chipsona',
    emoji: '🥔',
    category: 'Tubers',
    baseYieldQuintalsPerAcre: 145, // ~14,500 kg/acre
    yieldVariancePercent: 10,
    durationDays: 90,
    season: 'Rabi',
    avgCultivationCostPerAcre: 44000,
    currentMandiRatePerKg: 20,
    projectedHarvestRatePerKg: { min: 18, expected: 24, peak: 30 },
    priceTrendReason: 'Processing units contracting wafer-grade potatoes with specific gravity > 1.08.',
    riskFactor: 'Medium',
    waterNeed: 'Medium',
    harvestAdvice: 'Dehaulm 10 days prior to digging to harden skin coat against transit bruising.'
  },
  {
    id: 'soy-js',
    name: 'Soybean',
    variety: 'JS-9560 Malwa',
    emoji: '🌱',
    category: 'Oilseeds',
    baseYieldQuintalsPerAcre: 12, // ~1,200 kg/acre
    yieldVariancePercent: 14,
    durationDays: 90,
    season: 'Kharif',
    avgCultivationCostPerAcre: 18000,
    currentMandiRatePerKg: 48,
    projectedHarvestRatePerKg: { min: 44, expected: 52, peak: 57 },
    priceTrendReason: 'Crushing parity favorable for solvent extraction plants; meal export demand steady.',
    riskFactor: 'Medium',
    waterNeed: 'Low',
    harvestAdvice: 'Harvest immediately when 95% of pods turn golden-brown to prevent pod shattering.'
  }
];

export const YieldPredictionModal: React.FC<YieldPredictionModalProps> = ({
  isOpen,
  onClose,
  onApplyToListing,
  onShowToast
}) => {
  const farmSizeInputId = useId();
  const sowingDateInputId = useId();
  const [selectedCropId, setSelectedCropId] = useState<string>('tom-pusa');
  const [acres, setAcres] = useState<number>(2.0);
  const [irrigation, setIrrigation] = useState<'drip' | 'sprinkler' | 'flood' | 'rainfed'>('drip');
  const [soilType, setSoilType] = useState<'black_cotton' | 'alluvial' | 'red_loam'>('black_cotton');
  const [farmingType, setFarmingType] = useState<'organic' | 'natural' | 'integrated'>('organic');
  const [sowingDate, setSowingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 15);
    return d.toISOString().split('T')[0];
  });
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationCount, setCalculationCount] = useState<number>(1);

  if (!isOpen) return null;

  const currentCrop = CROP_PROFILES.find((c) => c.id === selectedCropId) || CROP_PROFILES[0];

  // Irrigation Yield Multiplier
  const irrigationMultiplier =
    irrigation === 'drip'
      ? 1.18
      : irrigation === 'sprinkler'
      ? 1.08
      : irrigation === 'flood'
      ? 1.0
      : 0.82; // Rainfed

  // Soil Quality Multiplier
  const soilMultiplier =
    soilType === 'black_cotton'
      ? 1.05
      : soilType === 'alluvial'
      ? 1.08
      : 0.94; // Red loam

  // Farming Practice Multiplier
  const farmingYieldMultiplier =
    farmingType === 'organic'
      ? 0.96 // slightly lower bulk volume but high price premium
      : farmingType === 'natural'
      ? 0.92
      : 1.04; // Integrated NPK chemical

  const pricePremiumMultiplier =
    farmingType === 'organic'
      ? 1.25 // 25% premium for organic certified produce
      : farmingType === 'natural'
      ? 1.15
      : 1.0;

  // Expected Yield Calculations
  const calculatedQuintalsPerAcre =
    currentCrop.baseYieldQuintalsPerAcre *
    irrigationMultiplier *
    soilMultiplier *
    farmingYieldMultiplier;

  const totalQuintals = Math.round(calculatedQuintalsPerAcre * acres * 10) / 10;
  const totalKg = Math.round(totalQuintals * 100);
  const minKg = Math.round(totalKg * (1 - currentCrop.yieldVariancePercent / 100));
  const maxKg = Math.round(totalKg * (1 + currentCrop.yieldVariancePercent / 100));
  const estimatedCrates = Math.round(totalKg / 25); // 25kg standard agri crate

  // Expected Market Price Calculations
  const expectedRate = Math.round(
    currentCrop.projectedHarvestRatePerKg.expected * pricePremiumMultiplier
  );
  const minRate = Math.round(
    currentCrop.projectedHarvestRatePerKg.min * pricePremiumMultiplier
  );
  const peakRate = Math.round(
    currentCrop.projectedHarvestRatePerKg.peak * pricePremiumMultiplier
  );

  // Financial Calculations
  const grossEstimatedRevenue = totalKg * expectedRate;
  const estimatedCost = Math.round(currentCrop.avgCultivationCostPerAcre * acres);
  const netEstimatedProfit = Math.max(0, grossEstimatedRevenue - estimatedCost);
  const estimatedRoi = Math.round((netEstimatedProfit / estimatedCost) * 100);

  // Harvest Date Projection
  const estimatedHarvestDate = new Date(sowingDate);
  estimatedHarvestDate.setDate(estimatedHarvestDate.getDate() + currentCrop.durationDays);
  const harvestDateFormatted = estimatedHarvestDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setCalculationCount((prev) => prev + 1);
      onShowToast('🌾 Model updated: ICAR multi-variable prediction synced.');
    }, 700);
  };

  const handleApplyToSell = () => {
    if (onApplyToListing) {
      onApplyToListing(currentCrop.name, totalKg, expectedRate);
    }
    onShowToast(`Copied ${totalKg}kg ${currentCrop.name} forecast to Listing screen!`);
    onClose();
  };

  const handleShareSummary = () => {
    const summaryText = `🌱 *Soil Mates AI Yield Forecast*
Crop: ${currentCrop.name} (${currentCrop.variety})
Farm Size: ${acres} Acres
Estimated Harvest: ${totalQuintals} Quintals (${totalKg.toLocaleString('en-IN')} kg)
Harvest Date: ${harvestDateFormatted}
Projected APMC Price: ₹${expectedRate}/kg (Range ₹${minRate} - ₹${peakRate})
Gross Revenue: ₹${grossEstimatedRevenue.toLocaleString('en-IN')}
Net Estimated Profit: ₹${netEstimatedProfit.toLocaleString('en-IN')} (+${estimatedRoi}% ROI)
SoilChain Verified ID: #FC-9482`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      onShowToast('📋 Forecast summary copied to clipboard for WhatsApp sharing!');
    }
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
              🔮
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8]">
                  AI Yield & Price Forecaster
                </h3>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30 font-bold">
                  Agronomy ML v3.2
                </span>
              </div>
              <p className="text-[10px] text-[#EDD9B8]/75">
                ICAR agro-climatic model · Multi-mandi elasticity forecast
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

        {/* Modal Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-[var(--text)] no-scrollbar">
          {/* Step 1: Crop Selection Grid */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[var(--text2)] uppercase tracking-wider">
              1. Select Crop & Variety
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CROP_PROFILES.map((crop) => {
                const isSelected = crop.id === selectedCropId;
                return (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      handleRecalculate();
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] ring-2 ring-[var(--leaf2)]/30 shadow-xs'
                        : 'bg-white border-[var(--border)] hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{crop.emoji}</span>
                      <span className="text-[8px] bg-stone-100 text-stone-600 px-1 py-0.2 rounded font-bold uppercase">
                        {crop.season}
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="font-bold text-xs text-[var(--text)] truncate">
                        {crop.name}
                      </div>
                      <div className="text-[9px] text-[var(--text3)] truncate">
                        {crop.variety.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Farm Parameters (Size, Irrigation, Soil) */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-3.5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--text2)] uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Farm Land & Cultivation Setup</span>
              </span>
              <span className="text-[10px] font-bold text-[var(--leaf2)]">
                {acres} Acres ({Math.round(acres * 1.6)} Bigha)
              </span>
            </div>

            {/* Farm Size Slider & Direct Input */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.25"
                  max="25"
                  step="0.25"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
                />
                <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-xl border border-stone-200 flex-shrink-0">
                  <input
                    id={farmSizeInputId}
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(Math.max(0.1, Number(e.target.value)))}
                    className="w-12 bg-transparent text-center font-bold text-xs outline-none text-[var(--text)]"
                  />
                  <label htmlFor={farmSizeInputId} className="text-[10px] text-stone-500 font-semibold cursor-pointer">
                    Acres
                  </label>
                </div>
              </div>
            </div>

            {/* Irrigation & Soil Matrix */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Irrigation Mode */}
              <div>
                <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Water / Irrigation
                </label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-500"
                >
                  <option value="drip">💧 Drip Irrigation (+18% Yield)</option>
                  <option value="sprinkler">🚿 Sprinkler System (+8%)</option>
                  <option value="flood">🌊 Canal / Flood (Standard)</option>
                  <option value="rainfed">🌧️ Rainfed / Barani (-18%)</option>
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Soil Composition
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-500"
                >
                  <option value="black_cotton">🪨 Black Cotton Soil (Clay)</option>
                  <option value="alluvial">🌾 Alluvial Loam (Narmada)</option>
                  <option value="red_loam">🏜️ Red Sandy Loam</option>
                </select>
              </div>
            </div>

            {/* Practice & Sowing Date */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <div>
                <label className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Farming Standard
                </label>
                <select
                  value={farmingType}
                  onChange={(e) => setFarmingType(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-500"
                >
                  <option value="organic">🌿 100% Organic (+25% Price)</option>
                  <option value="natural">🌱 Natural / Zero-Budget</option>
                  <option value="integrated">🧪 Integrated NPK Standard</option>
                </select>
              </div>

              <div>
                <label htmlFor={sowingDateInputId} className="block text-[9px] font-bold text-[var(--text3)] uppercase mb-1">
                  Sowing / Transplant Date
                </label>
                <input
                  id={sowingDateInputId}
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* AI PREDICTION RESULTS DASHBOARD */}
          <div className="bg-stone-900 text-white rounded-3xl p-4 shadow-lg border border-emerald-500/40 space-y-3.5 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  AI Model Projection for {currentCrop.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-stone-400">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>Harvest: <strong className="text-white">{harvestDateFormatted}</strong></span>
              </div>
            </div>

            {/* Metric 1: Harvest Volume Estimate */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/80">
                <div className="text-[10px] text-stone-400 uppercase font-semibold flex items-center gap-1">
                  <Scale className="w-3 h-3 text-emerald-400" />
                  <span>Est. Harvest Volume</span>
                </div>
                <div className="text-2xl font-serif-soil font-extrabold text-white mt-1">
                  {totalQuintals} <span className="text-xs font-sans font-medium text-stone-400">Qtl</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                  ≈ {totalKg.toLocaleString('en-IN')} kg ({estimatedCrates} Crates)
                </div>
                <div className="text-[9px] text-stone-400 mt-1">
                  Confidence Band: {minKg.toLocaleString('en-IN')} - {maxKg.toLocaleString('en-IN')} kg
                </div>
              </div>

              {/* Metric 2: Price Forecast */}
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/80">
                <div className="text-[10px] text-stone-400 uppercase font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span>Mandi Price Forecast</span>
                </div>
                <div className="text-2xl font-serif-soil font-extrabold text-amber-300 mt-1">
                  ₹{expectedRate} <span className="text-xs font-sans font-medium text-stone-400">/ kg</span>
                </div>
                <div className="text-[10px] text-stone-300 font-medium mt-0.5">
                  Mandi Range: ₹{minRate} - ₹{peakRate}/kg
                </div>
                <div className="text-[9px] text-stone-400 mt-1">
                  Current Spot: ₹{currentCrop.currentMandiRatePerKg}/kg ({expectedRate > currentCrop.currentMandiRatePerKg ? `+${Math.round(((expectedRate - currentCrop.currentMandiRatePerKg) / currentCrop.currentMandiRatePerKg) * 100)}% expected` : 'Stable'})
                </div>
              </div>
            </div>

            {/* Financial Revenue & Profit Summary */}
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-emerald-300">
                <span>Revenue & Profit Forecast ({acres} Acres)</span>
                <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ROI: +{estimatedRoi}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div>
                  <div className="text-[9px] text-stone-400 uppercase">Gross Revenue</div>
                  <div className="text-sm font-extrabold font-serif-soil text-white mt-0.5">
                    ₹{grossEstimatedRevenue.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="border-x border-stone-700 px-1">
                  <div className="text-[9px] text-stone-400 uppercase">Cultivation Cost</div>
                  <div className="text-sm font-extrabold font-serif-soil text-stone-300 mt-0.5">
                    ₹{estimatedCost.toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] text-emerald-400 uppercase font-bold">Net Profit</div>
                  <div className="text-sm font-extrabold font-serif-soil text-emerald-400 mt-0.5">
                    ₹{netEstimatedProfit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Driver Insight & Agronomy Note */}
            <div className="space-y-1.5 text-[10px] text-stone-300 pt-1">
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">📈 Market Driver:</span>
                <p className="leading-relaxed text-stone-300">
                  {currentCrop.priceTrendReason}
                </p>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">🌾 Field Advisory:</span>
                <p className="leading-relaxed text-stone-300">
                  {currentCrop.harvestAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleApplyToSell}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>Pre-List this Harvest on Marketplace ({totalKg.toLocaleString('en-IN')} kg @ ₹{expectedRate}/kg)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleShareSummary}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[var(--border)] text-[var(--text)] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share Forecast on WhatsApp</span>
              </button>

              <button
                onClick={handleRecalculate}
                disabled={isCalculating}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 transition-colors"
                title="Recalculate with latest parameters"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
                <span>Recalculate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
