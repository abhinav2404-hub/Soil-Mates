import React, { useState } from 'react';
import { ProduceItem, ScreenId } from '../types';
import { SAMPLE_CROP_AI_PRESETS } from '../data/agriData';
import {
  Sparkles,
  CheckCircle2,
  Camera,
  Upload,
  RefreshCw,
  ShieldCheck,
  Volume2,
  TrendingUp,
  Tag,
  Scale,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface SellProduceScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onAddProduct: (item: ProduceItem) => void;
  onShowToast: (msg: string) => void;
  onOpenYieldCalculator?: () => void;
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
  onShowToast,
  onOpenYieldCalculator
}) => {
  const [selectedCropName, setSelectedCropName] = useState<string>('Tomato');
  const [quantity, setQuantity] = useState<number>(150);
  const [price, setPrice] = useState<number>(34);
  const [harvestDate, setHarvestDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Mixed'>('Grade A');
  const [deliveryMethod, setDeliveryMethod] = useState<'platform' | 'self'>('platform');

  // AI Camera & Learning Model State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [snappedPhotoUrl, setSnappedPhotoUrl] = useState<string | null>(
    SAMPLE_CROP_AI_PRESETS[0].imageUrl
  );
  const [aiAnalysisResult, setAiAnalysisResult] = useState<typeof SAMPLE_CROP_AI_PRESETS[0] | null>(
    SAMPLE_CROP_AI_PRESETS[0]
  );

  const currentCrop = CROPS_META[selectedCropName] || CROPS_META['Tomato'];

  const handleSelectCrop = (cropName: string) => {
    setSelectedCropName(cropName);
    const meta = CROPS_META[cropName];
    if (meta) {
      setPrice(meta.optimal);
    }
  };

  // Run simulated AI Computer Vision analysis on photo
  const triggerAiLearningModel = (preset: typeof SAMPLE_CROP_AI_PRESETS[0]) => {
    setIsScanning(true);
    setSnappedPhotoUrl(preset.imageUrl);
    onShowToast(`🔬 AI Computer Vision analyzing ${preset.cropName}...`);

    setTimeout(() => {
      setAiAnalysisResult(preset);
      setSelectedCropName(preset.cropName.includes('Tomato') ? 'Tomato' : preset.cropName.includes('Palak') ? 'Palak' : 'Onion');
      setPrice(preset.suggestedPricePerKg);
      setQuantity(preset.estimatedWeightKg);
      setGrade(preset.grade);
      setIsScanning(false);
      onShowToast(`✨ Model matched: ${preset.cropName} (${preset.grade}) · 98.4% Confidence`);
    }, 1500);
  };

  // Handle local camera file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSnappedPhotoUrl(url);
      setIsScanning(true);
      onShowToast('📸 Uploaded photo! AI learning model is classifying...');

      setTimeout(() => {
        setIsScanning(false);
        const randomPreset = SAMPLE_CROP_AI_PRESETS[Math.floor(Math.random() * SAMPLE_CROP_AI_PRESETS.length)];
        setAiAnalysisResult(randomPreset);
        setPrice(randomPreset.suggestedPricePerKg);
        setQuantity(randomPreset.estimatedWeightKg);
        setGrade(randomPreset.grade);
        onShowToast(`✅ AI Scan Completed: ${randomPreset.cropName} (${randomPreset.grade})`);
      }, 1600);
    }
  };

  // Speak Hindi advice using SpeechSynthesis if available
  const handlePlayVoiceAdvice = () => {
    if (aiAnalysisResult && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(aiAnalysisResult.audioNarrationHindi);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
      onShowToast('🔊 Playing AI Hindi audio advisory...');
    } else if (aiAnalysisResult) {
      onShowToast(`🔊 AI Hindi: "${aiAnalysisResult.audioNarrationHindi}"`);
    }
  };

  const grossEarnings = quantity * price;
  const platformFee = Math.round(grossEarnings * 0.05);
  const netEarnings = grossEarnings - platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0 || price <= 0) {
      onShowToast('Please enter a valid quantity and price.');
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
      description: `Freshly snapped and AI-verified ${selectedCropName} lot from Ramesh Patel farm. ${grade} standard certified with direct farm pickup.`
    };

    onAddProduct(newProduce);
    onShowToast(`✅ Successfully listed ${quantity}kg ${selectedCropName}!`);
    onNavigate('s-farmer');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)] pb-16">
      {/* Header */}
      <div
        className="px-4 pt-3.5 pb-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-soil text-xl font-extrabold text-[#EDD9B8] flex items-center gap-1.5">
              <span>🌱 Sell & List Harvest</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.5 rounded font-bold">
                AI Vision
              </span>
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 mt-0.5 font-medium">
              Shoot crop photo · Instant AI auto-classification & APMC pricing
            </p>
          </div>
          <button
            onClick={() => onNavigate('s-farmer')}
            className="text-[11px] text-emerald-300 font-bold underline"
          >
            ← Farm Hub
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5">
        {/* AI CAMERA & LEARNING MODEL SHOOT-TO-LIST HERO CARD */}
        <div className="bg-stone-900 border-2 border-emerald-500/60 text-white rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                AI Crop Vision & Snapping Model
              </span>
            </div>
            <span className="text-[9px] bg-emerald-900 text-emerald-200 border border-emerald-500 px-2 py-0.5 rounded-full font-bold">
              ResNet-AgriVision v4
            </span>
          </div>

          {/* Photo & Scanner Viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 h-44 flex items-center justify-center group">
            {snappedPhotoUrl ? (
              <img
                src={snappedPhotoUrl}
                alt="Snapped harvest"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-stone-600 mx-auto mb-2 animate-pulse" />
                <span className="text-xs text-stone-400 font-bold block">
                  No crop photo captured yet
                </span>
                <span className="text-[10px] text-stone-500">
                  Tap "Shoot Photo" or choose a preset below
                </span>
              </div>
            )}

            {/* Scanning Line Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-500/15 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10B981] animate-pulse" />
                <div className="mt-3 px-3 py-1.5 rounded-xl bg-black/80 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 border border-emerald-500/40">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Scanning species, leaf texture & APMC rates...</span>
                </div>
              </div>
            )}

            {/* Overlay Model Badge */}
            {aiAnalysisResult && !isScanning && (
              <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-bold border border-emerald-500/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{aiAnalysisResult.cropName}</span>
                <span className="text-emerald-300 font-extrabold">({aiAnalysisResult.confidence}%)</span>
              </div>
            )}

            {/* Quality Grade Overlay */}
            {aiAnalysisResult && !isScanning && (
              <div className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-xs text-white px-2 py-1 rounded-xl text-[10px] font-extrabold shadow-xs flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-300" />
                <span>{aiAnalysisResult.grade}</span>
              </div>
            )}

            {/* Camera Reticle Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />
          </div>

          {/* Action Buttons: Camera Upload & Test Presets */}
          <div className="flex gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all text-center">
              <Camera className="w-3.5 h-3.5" />
              <span>📸 Shoot Camera Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {aiAnalysisResult && (
              <button
                type="button"
                onClick={handlePlayVoiceAdvice}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-1 border border-stone-700 transition-colors"
                title="Listen to AI Hindi advice"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio</span>
              </button>
            )}
          </div>

          {/* Sample Shoot Presets for Instant 1-Tap Test */}
          <div>
            <div className="text-[10px] text-stone-400 mb-1 font-semibold">
              Or test AI vision model with pre-captured harvest shots:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SAMPLE_CROP_AI_PRESETS.map((p) => (
                <button
                  key={p.cropName}
                  type="button"
                  onClick={() => triggerAiLearningModel(p)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    aiAnalysisResult?.cropName === p.cropName
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400 font-bold'
                      : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <span className="text-base block">{p.emoji}</span>
                  <span className="text-[9px] block truncate">{p.cropName.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Learning Model Diagnostics Card */}
          {aiAnalysisResult && (
            <div className="bg-stone-800/90 rounded-2xl p-3 border border-emerald-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 border-b border-stone-700 pb-1.5">
                <span>AI Vision & Defect Diagnostic</span>
                <span>Freshness: {aiAnalysisResult.freshnessScore}%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-300">
                <div>
                  <span className="text-stone-400 block">Defect Analysis:</span>
                  <span className="font-semibold text-emerald-400">{aiAnalysisResult.defectScan}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Pesticide Residue:</span>
                  <span className="font-semibold text-emerald-400">{aiAnalysisResult.chemicalResidueEst}</span>
                </div>
              </div>

              <div className="p-2 bg-stone-900 rounded-xl border border-stone-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-stone-400 uppercase">Live Karond APMC Rate</span>
                  <div className="text-xs font-bold text-white">₹{aiAnalysisResult.mandiPricePerKg}/kg</div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-400 uppercase font-bold">AI Fair Farmgate Price</span>
                  <div className="text-sm font-extrabold text-emerald-400 font-mono">
                    ₹{aiAnalysisResult.suggestedPricePerKg}/kg
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-amber-300/90 italic leading-snug">
                💡 {aiAnalysisResult.harvestAdvice}
              </p>
            </div>
          )}
        </div>

        {/* LISTING DETAILS FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-3xl border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 mb-1">
            <span className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
              Produce Listing Parameters
            </span>
            <div className="flex items-center gap-1.5">
              {onOpenYieldCalculator && (
                <button
                  type="button"
                  onClick={onOpenYieldCalculator}
                  className="text-[10px] text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-colors"
                >
                  <span>🔮 Acreage Yield Calc</span>
                </button>
              )}
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Auto-filled by AI
              </span>
            </div>
          </div>

          {/* Crop Selector Grid */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text2)] tracking-wider uppercase mb-1">
              Selected Crop
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

          {/* Quantity & Price Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1 flex items-center gap-1">
                <Scale className="w-3 h-3 text-emerald-600" />
                <span>Quantity (kg)</span>
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
              <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-600" />
                <span>Price (₹ / kg)</span>
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
            <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>Harvest Date</span>
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
            <label className="block text-[10px] font-bold text-[var(--text2)] uppercase mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-600" />
              <span>Quality Grade</span>
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

          {/* Delivery Logistics */}
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
                    Platform Cold-Chain Pickup (Driver Suresh Assigned)
                  </span>
                </div>
                <span className="text-[10px] text-[var(--leaf2)] font-bold">Free</span>
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
              Platform fee 5%: -₹{platformFee} · Direct deposit to SBI UPI (rameshpatel@oksbi):{' '}
              <strong className="text-[var(--leaf2)] font-bold text-xs">
                ₹{netEarnings.toLocaleString('en-IN')}
              </strong>{' '}
              released upon Rider OTP scan.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--soil)' }}
          >
            <span>🚀 Publish Verified Harvest to Live Marketplace</span>
          </button>
        </form>
      </div>
    </div>
  );
};
