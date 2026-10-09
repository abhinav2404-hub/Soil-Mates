import React, { useState, useEffect } from 'react';
import { CropDiagnosis, ScreenId, ProduceItem } from '../types';
import { Volume2, VolumeX, ArrowLeft, ShoppingBag, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiagnosisResultScreenProps {
  diagnosis: CropDiagnosis;
  onNavigate: (screen: ScreenId) => void;
  onAddToCart: (item: ProduceItem) => void;
  onShowToast: (msg: string) => void;
}

export const DiagnosisResultScreen: React.FC<DiagnosisResultScreenProps> = ({
  diagnosis,
  onNavigate,
  onAddToCart,
  onShowToast
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechLang, setSpeechLang] = useState<'hi' | 'en'>('hi');
  const [treatmentTab, setTreatmentTab] = useState<'organic' | 'chemical'>('organic');
  const [acreage, setAcreage] = useState<number>(1);

  // Stop speech when leaving screen
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('Text-to-speech audio not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onShowToast('Audio stopped.');
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak =
        speechLang === 'hi'
          ? diagnosis.hindiNarration
          : diagnosis.englishNarration;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = speechLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      onShowToast(speechLang === 'hi' ? '🎙️ Playing Hindi voice advice...' : '🎙️ Playing English voice advice...');
    }
  };

  const medicineCost = diagnosis.recommendedProduct.price * acreage;

  const handleBuyMedicine = () => {
    const medicineItem: ProduceItem = {
      id: `med-${diagnosis.id}-${Date.now()}`,
      name: `${diagnosis.recommendedProduct.name} (${acreage} Acre Pack)`,
      category: 'herbs',
      emoji: '💊',
      farmName: 'Agro-Care Pharmacy Partner',
      location: 'Certified Agro Store, Bhopal',
      pricePerKg: medicineCost,
      unit: 'pack',
      availableKg: 50,
      rating: 4.9,
      reviewsCount: 142,
      deliveryHours: 2,
      farmerAadhaarVerified: true,
      harvestTime: 'Verified Authentic Batch',
      grade: 'Grade A',
      description: `Targeted treatment for ${diagnosis.diseaseName}. Prescribed dosage: ${diagnosis.recommendedProduct.dosage} across ${acreage} Acre.`
    };

    onAddToCart(medicineItem);
    onShowToast(`Added ${acreage}x ${diagnosis.recommendedProduct.name} to Cart!`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Top Header Bar */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0 text-white"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('s-ai')}
            className="text-white hover:text-stone-200 p-1 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h3 className="font-serif-soil text-base font-bold text-white">
            Diagnosis Report
          </h3>
        </div>
        <span className="text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium">
          Confidence: {diagnosis.confidence}%
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5 pb-8">
        {/* Visual Pathology Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--coral-pale)] rounded-2xl p-4 border border-[var(--coral)]/30 flex items-center gap-3 shadow-xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-3xl flex-shrink-0 shadow-xs">
            {diagnosis.detectedVisual}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {diagnosis.severity.toUpperCase()} SEVERITY
            </span>
            <h3 className="font-serif-soil text-sm font-extrabold text-[var(--text)] mt-1 truncate">
              {diagnosis.diseaseName}
            </h3>
            <p className="text-[10px] text-[var(--text3)] italic">
              {diagnosis.scientificName}
            </p>
          </div>
        </motion.div>

        {/* Severity & Confidence Meter */}
        <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex justify-between text-xs font-bold text-[var(--text)]">
            <span>Clinical Severity Assessment</span>
            <span className="text-[var(--coral)]">{diagnosis.confidence}% Match</span>
          </div>

          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${diagnosis.confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
            />
          </div>

          <p className="text-[10px] text-[var(--text3)]">
            Urgency: Act within <strong>{diagnosis.urgencyDays}</strong> to prevent field transmission.
          </p>
        </div>

        {/* Detected Symptoms */}
        <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs">
          <h4 className="font-serif-soil text-xs font-bold text-[var(--text)] mb-2">
            Identified Foliar Symptoms
          </h4>
          <div className="space-y-1.5">
            {diagnosis.symptoms.map((symp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-2 text-[11px] text-[var(--text2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] mt-1 flex-shrink-0" />
                <span>{symp}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Treatment Options Switcher (Step / Option Animation) */}
        <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Prescribed Treatment Protocols
            </h4>
            <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              Bio & Standard
            </span>
          </div>

          {/* Option Selector Tabs with Animated Sliding Pill */}
          <div className="grid grid-cols-2 p-1 bg-[var(--cream2)] rounded-xl border border-[var(--border)]">
            <button
              onClick={() => setTreatmentTab('organic')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                treatmentTab === 'organic'
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
              }`}
            >
              <span>🌿</span>
              <span>Organic Bio</span>
            </button>

            <button
              onClick={() => setTreatmentTab('chemical')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                treatmentTab === 'chemical'
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
              }`}
            >
              <span>🧪</span>
              <span>Conventional</span>
            </button>
          </div>

          {/* Treatment Content with Animation */}
          <AnimatePresence mode="wait">
            {treatmentTab === 'organic' ? (
              <motion.div
                key="organic"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-2"
              >
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  Zero chemical residue · Export friendly
                </div>
                {(diagnosis.organicRemedies || diagnosis.treatmentSteps).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-[var(--text2)]">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="chemical"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-2"
              >
                <div className="text-[11px] font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  Fast systemic action · Curative within 48h
                </div>
                {(diagnosis.chemicalRemedies || diagnosis.treatmentSteps).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-[var(--text2)]">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Acreage & Dosage Selector Options */}
        <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text)]">
              Calculate Farm Coverage Dosage:
            </span>
            <span className="text-[10px] text-[var(--text3)]">
              {acreage} Acre ({acreage * 200}L spray volume)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 5].map((ac) => (
              <motion.button
                key={ac}
                whileTap={{ scale: 0.93 }}
                onClick={() => setAcreage(ac)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  acreage === ac
                    ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] text-[var(--leaf2)] shadow-xs'
                    : 'bg-[var(--cream2)] border-[var(--border)] text-[var(--text2)]'
                }`}
              >
                <span>{ac} Acre</span>
                <span className="block text-[9px] font-normal text-[var(--text3)]">
                  ₹{diagnosis.recommendedProduct.price * ac}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Agricultural Advisory Notice */}
        <div className="bg-[var(--sky)] border border-sky-300/60 rounded-2xl p-3 text-[10px] text-sky-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-sky-900">
            <span>ℹ️</span>
            <span>AI Agricultural Advisory Notice</span>
          </div>
          <p className="leading-relaxed text-sky-900/80">
            This guidance is generated from computer vision observations and does not constitute a guaranteed clinical cure. For severe outbreaks or before large-scale chemical applications, always cross-consult with your district Krishi Vigyan Kendra (KVK) extension officer.
          </p>
        </div>

        {/* Action Buttons: Add Medicine & Audio Voice Advice */}
        <div className="space-y-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleBuyMedicine}
            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              Buy {diagnosis.recommendedProduct.name} ({acreage} Acre · ₹{medicineCost})
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('s-ai')}
            className="w-full py-2.5 rounded-xl border border-[var(--leaf2)] text-[var(--leaf2)] text-xs font-bold hover:bg-[var(--leaf-pale)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📸 Scan Another Crop Leaf</span>
          </motion.button>

          {/* Voice Narration Audio Toggle */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleSpeech}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Voice Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>Listen in {speechLang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
                setSpeechLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
                onShowToast(`Language switched to ${speechLang === 'hi' ? 'English' : 'Hindi'}`);
              }}
              className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--white)] text-[10px] font-bold text-[var(--soil2)] hover:bg-[var(--cream2)] cursor-pointer"
            >
              {speechLang === 'hi' ? 'EN' : 'HI'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
