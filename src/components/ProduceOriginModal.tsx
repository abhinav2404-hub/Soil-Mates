import React, { useState } from 'react';
import { ProduceItem, ProduceTraceabilityData } from '../types';
import { PRODUCE_TRACEABILITY_DATABASE } from '../data/agriData';
import {
  X,
  ShieldCheck,
  QrCode,
  MapPin,
  Calendar,
  Thermometer,
  CheckCircle2,
  Clock,
  Camera,
  Copy,
  ExternalLink,
  Leaf
} from 'lucide-react';

interface ProduceOriginModalProps {
  isOpen: boolean;
  produce?: ProduceItem | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onOpenQRScanner?: () => void;
}

export const ProduceOriginModal: React.FC<ProduceOriginModalProps> = ({
  isOpen,
  produce,
  onClose,
  onShowToast,
  onOpenQRScanner
}) => {
  const [selectedProduceId, setSelectedProduceId] = useState<string>(
    produce?.id || 'prod-1'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'farmer' | 'lab'>('journey');

  // Sync when prop changes
  React.useEffect(() => {
    if (produce?.id && PRODUCE_TRACEABILITY_DATABASE[produce.id]) {
      setSelectedProduceId(produce.id);
    }
  }, [produce]);

  if (!isOpen) return null;

  // Fallback to prod-1 if not in database
  const traceData: ProduceTraceabilityData =
    PRODUCE_TRACEABILITY_DATABASE[selectedProduceId] ||
    PRODUCE_TRACEABILITY_DATABASE['prod-1'];

  const handleScanClick = () => {
    if (onOpenQRScanner) {
      onOpenQRScanner();
      return;
    }
    setIsScanning(true);
    onShowToast('Point camera at produce QR code label...');
    setTimeout(() => {
      setIsScanning(false);
      // Pick random produce to demonstrate live scanning
      const keys = Object.keys(PRODUCE_TRACEABILITY_DATABASE);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setSelectedProduceId(randomKey);
      onShowToast(`QR Verified: Loaded ${PRODUCE_TRACEABILITY_DATABASE[randomKey].produceName}!`);
    }, 1800);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    onShowToast('Block hash copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--cream)] rounded-2xl border border-white/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className="p-3.5 flex items-center justify-between text-[#EDD9B8] flex-shrink-0"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(107,191,107,0.2)] border border-[#6BBF6B]/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-soil text-sm font-extrabold text-[#EDD9B8] flex items-center gap-1.5">
                <span>Produce Origin & Blockchain Ledger</span>
              </h3>
              <p className="text-[10px] text-[#EDD9B8]/70 font-mono">
                SoilChain V2 · Immutable Provenance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Produce Switcher & QR Scanner Bar */}
        <div className="p-2.5 bg-[var(--cream2)] border-b border-[var(--border)] flex items-center justify-between gap-2 flex-shrink-0">
          {/* Quick produce lot chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'prod-1', label: '🍅 Tomato' },
              { id: 'prod-2', label: '🥬 Palak' },
              { id: 'prod-3', label: '🥔 Potato' },
              { id: 'prod-4', label: '🧅 Onion' },
              { id: 'prod-6', label: '🌾 Wheat' }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedProduceId(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  selectedProduceId === chip.id
                    ? 'bg-[var(--leaf)] text-white shadow-xs'
                    : 'bg-white text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* QR Scan Button */}
          <button
            onClick={handleScanClick}
            disabled={isScanning}
            className="px-2.5 py-1 rounded-lg bg-[var(--soil)] text-[#EDD9B8] text-[10px] font-bold flex items-center gap-1 hover:bg-[var(--soil2)] flex-shrink-0 transition-transform active:scale-95"
          >
            <Camera className="w-3 h-3" />
            <span>{isScanning ? 'Scanning...' : 'Scan QR'}</span>
          </button>
        </div>

        {/* Scanner Viewfinder Overlay */}
        {isScanning && (
          <div className="bg-stone-900 text-white p-4 text-center space-y-2 flex-shrink-0 animate-pulse">
            <div className="w-20 h-20 mx-auto border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
              <QrCode className="w-12 h-12 text-emerald-400 opacity-60" />
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            </div>
            <p className="text-[11px] text-emerald-300 font-mono">
              Align camera with QR label on produce crate...
            </p>
          </div>
        )}

        {/* Scrollable Trace Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
          {/* Main Lot Summary Card */}
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--leaf-pale)] border border-[var(--leaf2)]/20 flex items-center justify-center text-3xl shadow-xs">
                  {traceData.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
                      {traceData.produceName}
                    </h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text3)] mt-0.5">
                    Batch: <span className="font-bold text-[var(--soil)]">{traceData.batchNumber}</span>
                  </div>
                </div>
              </div>

              {/* QR Code graphic */}
              <div
                onClick={() => onShowToast('SoilChain QR Certificate verified on IPFS')}
                className="w-11 h-11 bg-white p-1 rounded-lg border border-[var(--border)] shadow-xs cursor-pointer flex items-center justify-center hover:scale-105 transition-transform"
                title="Click to view IPFS Certificate"
              >
                <QrCode className="w-9 h-9 text-[var(--soil)]" />
              </div>
            </div>

            {/* Block Hash & Smart Contract Bar */}
            <div className="mt-3 pt-2.5 border-t border-[var(--leaf-pale)] bg-[var(--cream2)] rounded-xl p-2 text-[10px] font-mono text-[var(--text2)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text3)]">Tx Hash:</span>
                <button
                  onClick={() => handleCopyHash(traceData.blockHash)}
                  className="flex items-center gap-1 text-[var(--leaf2)] hover:underline font-bold"
                >
                  <span>{traceData.blockHash.substring(0, 16)}...</span>
                  <Copy className="w-2.5 h-2.5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text3)]">Contract:</span>
                <span className="text-[var(--text)] font-bold">{traceData.contractAddress}</span>
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Journey / Farm / Lab */}
          <div className="grid grid-cols-3 bg-[var(--cream2)] p-1 rounded-xl border border-[var(--border)] text-center text-xs font-bold">
            <button
              onClick={() => setActiveTab('journey')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'journey'
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
              }`}
            >
              🚚 Transit History
            </button>
            <button
              onClick={() => setActiveTab('farmer')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'farmer'
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
              }`}
            >
              🌱 Farm Origin
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`py-1.5 rounded-lg transition-all ${
                activeTab === 'lab'
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                  : 'text-[var(--text2)] hover:text-[var(--text)]'
              }`}
            >
              🔬 Lab & Quality
            </button>
          </div>

          {/* TAB 1: TRANSIT HISTORY (Cold Chain Journey) */}
          {activeTab === 'journey' && (
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-serif-soil text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <span>Cold-Chain Transit Checkpoints</span>
                </h5>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  ❄️ 10°C–13°C Compliant
                </span>
              </div>

              {/* Chronological Stepper */}
              <div className="space-y-3 relative pl-1">
                {/* Vertical connecting bar */}
                <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-[var(--leaf-pale)] z-0"></div>

                {traceData.transitHistory.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={step.id} className="flex items-start gap-3 relative z-10">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all ${
                          isDone
                            ? 'bg-[var(--leaf2)] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-[var(--amber)] text-white ring-4 ring-[var(--amber-pale)] animate-pulse'
                            : 'bg-[var(--leaf-pale)] text-[var(--leaf2)]'
                        }`}
                      >
                        {isDone ? '✓' : isCurrent ? '📍' : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0 bg-[var(--cream2)] rounded-xl p-2.5 border border-[var(--border)] text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="font-bold text-[var(--text)] text-[11px]">
                            {step.stage}
                          </strong>
                          <span className="text-[9px] text-[var(--text3)] flex items-center gap-0.5 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{step.timestamp}</span>
                          </span>
                        </div>

                        <div className="text-[10px] text-[var(--leaf2)] font-semibold mt-0.5 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{step.location}</span>
                        </div>

                        <p className="text-[10px] text-[var(--text2)] mt-1 leading-relaxed">
                          {step.details}
                        </p>

                        <div className="mt-1.5 pt-1 border-t border-[var(--border)] flex items-center justify-between text-[9px] font-mono text-[var(--text3)]">
                          <span>Handler: {step.handler}</span>
                          {step.temperature && (
                            <span className="text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-[var(--border)]">
                              🌡 {step.temperature}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FARM ORIGIN (Farmer & Soil Details) */}
          {activeTab === 'farmer' && (
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--cream2)] border-2 border-[var(--leaf2)]/40 flex items-center justify-center text-2xl">
                  👨‍🌾
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-serif-soil text-sm font-bold text-[var(--text)]">
                      {traceData.farmer.name}
                    </h5>
                    <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Aadhaar {traceData.farmer.aadhaarStatus}</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--text3)] mt-0.5">
                    📍 {traceData.farmer.village}, {traceData.farmer.district}
                  </div>
                </div>
              </div>

              {/* Farm Spec Table */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[var(--cream2)] p-2.5 rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] text-[var(--text3)] uppercase">Farm Size</div>
                  <div className="font-serif-soil text-sm font-extrabold text-[var(--text)] mt-0.5">
                    {traceData.farmer.farmSizeAcres} Acres
                  </div>
                </div>

                <div className="bg-[var(--cream2)] p-2.5 rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] text-[var(--text3)] uppercase">Soil Health</div>
                  <div className="font-bold text-[11px] text-emerald-700 mt-0.5 truncate">
                    {traceData.farmer.soilType}
                  </div>
                </div>
              </div>

              {/* Soil Health Verification Note */}
              <div className="bg-[var(--leaf-pale)] rounded-xl p-2.5 border border-[var(--leaf2)]/20 text-[11px] text-[var(--leaf2)] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-700" />
                  <span>Bio-Organic Cultivation Standards</span>
                </div>
                <p className="text-[10px] text-[var(--text)] leading-relaxed">
                  Field fertilized exclusively with natural vermicompost and cow dung manure.
                  Underground drip irrigation fed by rainwater harvesting reservoirs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: LAB & QUALITY CERTIFICATION */}
          {activeTab === 'lab' && (
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-serif-soil text-xs font-bold text-[var(--text)]">
                  Scientific Quality Parameters
                </h5>
                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  ISO/IEC 17025 Certified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[var(--cream2)] p-2.5 rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] text-[var(--text3)] uppercase">Harvest Timestamp</div>
                  <div className="font-bold text-[11px] text-[var(--text)] mt-0.5">
                    {traceData.harvest.exactTime}
                  </div>
                  <div className="text-[9px] text-[var(--text3)]">{traceData.harvest.date}</div>
                </div>

                <div className="bg-[var(--cream2)] p-2.5 rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] text-[var(--text3)] uppercase">Sorting Grade</div>
                  <div className="font-bold text-[11px] text-emerald-700 mt-0.5">
                    {traceData.harvest.grade}
                  </div>
                  <div className="text-[9px] text-[var(--text3)]">Export Standard</div>
                </div>

                <div className="bg-[var(--cream2)] p-2.5 rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] text-[var(--text3)] uppercase">Moisture Content</div>
                  <div className="font-bold text-[11px] text-[var(--text)] mt-0.5">
                    {traceData.harvest.moisturePercent}%
                  </div>
                  <div className="text-[9px] text-emerald-600">Optimal freshness</div>
                </div>

                <div className="bg-[var(--cream2)] p-2.5 rounded-xl border border-[var(--border)]">
                  <div className="text-[9px] text-[var(--text3)] uppercase">Chemical Residue</div>
                  <div className="font-bold text-[11px] text-emerald-700 mt-0.5">
                    {traceData.harvest.chemicalResiduePPM} PPM
                  </div>
                  <div className="text-[9px] text-emerald-600">Pesticide Safe ✓</div>
                </div>
              </div>

              {/* Lab Certification Box */}
              <div className="bg-[var(--cream2)] rounded-xl p-2.5 border border-[var(--border)] text-[10px] text-[var(--text2)] space-y-1 font-mono">
                <div className="font-bold text-[var(--text)]">
                  Testing Authority: {traceData.harvest.certificationLab}
                </div>
                <div className="text-[var(--text3)]">
                  Digital Certificate ID: CERT-MP-94821-V2
                </div>
              </div>
            </div>
          )}

          {/* Action footer */}
          <div className="pt-1 flex gap-2">
            <button
              onClick={() => onShowToast('IPFS Blockchain Certificate downloaded!')}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#EDD9B8] shadow-sm flex items-center justify-center gap-1.5"
              style={{ backgroundColor: 'var(--soil)' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Download Ledger Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
