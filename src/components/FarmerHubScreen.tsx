import React, { useState, useEffect } from 'react';
import {
  FarmerDispatchOrder,
  ProduceItem,
  ScreenId,
  SupportedLanguage
} from '../types';
import {
  Truck,
  Navigation,
  Phone,
  ShieldCheck,
  QrCode,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ArrowRight,
  RefreshCw,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Share2,
  IndianRupee,
  Sun,
  TrendingUp,
  PackageCheck,
  PackagePlus
} from 'lucide-react';
import QRCode from 'qrcode';

interface FarmerHubScreenProps {
  dispatches: FarmerDispatchOrder[];
  onUpdateDispatches: (dispatches: FarmerDispatchOrder[]) => void;
  products: ProduceItem[];
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
  onOpenQRScanner?: () => void;
  onOpenOriginModal?: (produceId?: string) => void;
  onOpenYieldCalculator?: () => void;
  onOpenMaterialLister?: () => void;
}

export const FarmerHubScreen: React.FC<FarmerHubScreenProps> = ({
  dispatches,
  onUpdateDispatches,
  products,
  onNavigate,
  onShowToast,
  onOpenQRScanner,
  onOpenOriginModal,
  onOpenYieldCalculator,
  onOpenMaterialLister
}) => {
  const [selectedDispatchId, setSelectedDispatchId] = useState<string>(
    dispatches[0]?.id || ''
  );
  const [generatedOtps, setGeneratedOtps] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    dispatches.forEach((d) => {
      map[d.id] = d.handoverOtp;
    });
    return map;
  });
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});
  const [isSimulatingRider, setIsSimulatingRider] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'logistics' | 'listings' | 'earnings'>('logistics');

  const activeDispatch =
    dispatches.find((d) => d.id === selectedDispatchId) || dispatches[0];

  // Generate QR code for the active handover OTP
  useEffect(() => {
    if (activeDispatch) {
      const otp = generatedOtps[activeDispatch.id] || activeDispatch.handoverOtp;
      const qrPayload = JSON.stringify({
        soilChainBatch: activeDispatch.batchNumber,
        otp: otp,
        crop: activeDispatch.cropName,
        crates: activeDispatch.crateCount,
        farm: 'Ramesh Patel Farm',
        buyer: activeDispatch.buyerName
      });

      QRCode.toDataURL(qrPayload, {
        width: 180,
        margin: 1,
        color: { dark: '#1E3F1A', light: '#FFFFFF' }
      })
        .then((url) => {
          setQrCodeDataUrls((prev) => ({ ...prev, [activeDispatch.id]: url }));
        })
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [activeDispatch, generatedOtps]);

  // Handle regenerating a new Handover OTP
  const handleRegenerateOtp = (dispatchId: string) => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtps((prev) => ({ ...prev, [dispatchId]: newOtp }));

    const updated = dispatches.map((d) =>
      d.id === dispatchId ? { ...d, handoverOtp: newOtp } : d
    );
    onUpdateDispatches(updated);
    onShowToast(`🔑 New Handover OTP: ${newOtp} generated for ${activeDispatch.cropName}`);
  };

  // Simulate rider arriving and entering the handover OTP
  const handleSimulateRiderHandover = (dispatchId: string) => {
    setIsSimulatingRider(true);
    onShowToast('⏳ Rider Suresh Kumar is validating Handover OTP...');

    setTimeout(() => {
      const updated = dispatches.map((d) => {
        if (d.id === dispatchId) {
          return {
            ...d,
            isOtpVerified: true,
            payoutStatus: 'transferred_to_upi' as const,
            escrowReleaseTime: 'Released Just now',
            upiTransactionId: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/OKSBI`,
            rider: {
              ...d.rider,
              status: 'in_transit_to_buyer' as const,
              isComingToFarmer: false,
              currentLocationName: 'Crates loaded! Heading on Highway towards Buyer'
            }
          };
        }
        return d;
      });

      onUpdateDispatches(updated);
      setIsSimulatingRider(false);
      onShowToast(`🎉 OTP Verified! ₹${activeDispatch.totalPayout.toLocaleString('en-IN')} escrow credited to your UPI!`);
    }, 1800);
  };

  const farmerProducts = products.filter(
    (p) => p.farmName.includes('Ramesh') || p.id === 'prod-1'
  );

  const totalDispatchedKg = dispatches.reduce((acc, d) => acc + d.quantityKg, 0);
  const totalInEscrow = dispatches
    .filter((d) => d.payoutStatus === 'escrow_locked')
    .reduce((acc, d) => acc + d.totalPayout, 0);
  const totalPaidOut = dispatches
    .filter((d) => d.payoutStatus === 'transferred_to_upi')
    .reduce((acc, d) => acc + d.totalPayout, 0);

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar bg-[var(--cream)] pb-20">
      {/* Top Farmgate Command Banner */}
      <div
        className="px-4 pt-4 pb-4 flex-shrink-0 text-[#EDD9B8]"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-xs">
              👨‍🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif-soil text-lg font-extrabold text-[#EDD9B8] leading-tight">
                  Ramesh Patel Farm
                </h2>
                <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Aadhaar ✓
                </span>
              </div>
              <p className="text-[10px] text-[#EDD9B8]/75 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Sonpur Village, Vidisha MP · SoilChain #FC-9482</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              onClick={onOpenMaterialLister}
              className="p-1.5 px-2.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/40 text-amber-200 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
              title="List daily food items (milk, ghee, flour, honey) or farm materials (fodder, compost)"
            >
              <span>🧺</span>
              <span>Food & Materials</span>
            </button>

            <button
              onClick={onOpenYieldCalculator}
              className="p-1.5 px-2.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
              title="AI Yield & Mandi Price Calculator"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Yield AI</span>
            </button>

            <button
              onClick={() => onNavigate('s-sell')}
              className="p-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#EDD9B8] text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
              title="Shoot harvest to list with AI"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AI Snap</span>
            </button>

            <button
              onClick={() => onNavigate('s-profile')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-[#EDD9B8] transition-colors"
              title="Profile & Settings"
            >
              👤
            </button>
          </div>
        </div>

        {/* Live Farm KPIs Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/15 text-center">
          <div className="bg-white/5 rounded-xl p-2 border border-white/10">
            <div className="text-[9px] text-[#EDD9B8]/70 font-semibold uppercase">Today's Harvest</div>
            <div className="text-sm font-extrabold font-serif-soil text-white mt-0.5">
              {totalDispatchedKg} kg
            </div>
            <div className="text-[9px] text-emerald-300 font-bold">12 Crates</div>
          </div>

          <div className="bg-white/5 rounded-xl p-2 border border-white/10">
            <div className="text-[9px] text-[#EDD9B8]/70 font-semibold uppercase">Pending Escrow</div>
            <div className="text-sm font-extrabold font-serif-soil text-amber-300 mt-0.5">
              ₹{totalInEscrow.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-amber-200/80 font-medium">OTP Locked</div>
          </div>

          <div className="bg-white/5 rounded-xl p-2 border border-white/10">
            <div className="text-[9px] text-[#EDD9B8]/70 font-semibold uppercase">Direct UPI Paid</div>
            <div className="text-sm font-extrabold font-serif-soil text-emerald-400 mt-0.5">
              ₹{totalPaidOut.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-emerald-300 font-medium">Settled 100%</div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex bg-[var(--leaf-pale)] border-b border-[var(--border)] p-1 gap-1 flex-shrink-0">
        <button
          onClick={() => setActiveTab('logistics')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'logistics'
              ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
              : 'text-[var(--text2)] hover:text-[var(--text)]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>🚚 Rider Tracker & OTP</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'listings'
              ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
              : 'text-[var(--text2)] hover:text-[var(--text)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🌾 Active Harvests ({farmerProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'earnings'
              ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
              : 'text-[var(--text2)] hover:text-[var(--text)]'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>💰 Bank & UPI</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-3.5 space-y-4">
        {/* LOGISTICS & DELIVERY BOY RADAR TAB */}
        {activeTab === 'logistics' && (
          <div className="space-y-3.5">
            {/* Batch Selector Pills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-[var(--text2)] uppercase tracking-wider">
                  Active Dispatch Batches:
                </span>
                <span className="text-[10px] text-[var(--leaf2)] font-bold">
                  {dispatches.length} Outgoing Orders
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {dispatches.map((d) => {
                  const isSelected = d.id === selectedDispatchId;
                  const isComing = d.rider.isComingToFarmer;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDispatchId(d.id)}
                      className={`py-2 px-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all flex-shrink-0 ${
                        isSelected
                          ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] shadow-xs ring-2 ring-[var(--leaf2)]/30'
                          : 'bg-white border-[var(--border)] hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-2xl">{d.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-[var(--text)] truncate max-w-[130px]">
                          {d.cropName}
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          {isComing ? (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Rider Coming
                            </span>
                          ) : d.isOtpVerified ? (
                            <span className="text-blue-700 font-bold">Dispatched</span>
                          ) : (
                            <span className="text-amber-700 font-bold">In Transit</span>
                          )}
                          <span className="text-[var(--text3)]">· {d.quantityKg}kg</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIVE DELIVERY BOY STATUS CARD (Primary Requirement) */}
            {activeDispatch && (
              <div className="bg-white border-2 border-[var(--border)] rounded-3xl p-4 shadow-sm space-y-3.5">
                {/* Rider Incoming Radar Banner */}
                <div
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    activeDispatch.rider.status === 'en_route_to_farm'
                      ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                      : activeDispatch.rider.status === 'at_farmgate'
                      ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800'
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs ${
                        activeDispatch.rider.isComingToFarmer
                          ? 'bg-emerald-600 text-white animate-bounce'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {activeDispatch.rider.status === 'at_farmgate' ? '📍' : '🛵'}
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                        {activeDispatch.rider.isComingToFarmer ? (
                          <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            DELIVERY BOY IS COMING TO YOUR FARM
                          </span>
                        ) : activeDispatch.rider.status === 'at_farmgate' ? (
                          <span className="text-amber-700 dark:text-amber-300 font-bold">
                            DELIVERY BOY AT FARMGATE (READY TO LOAD)
                          </span>
                        ) : (
                          <span className="text-blue-700 dark:text-blue-300 font-bold">
                            COLLECTED & ON ROAD TO BUYER
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-stone-900 dark:text-white mt-0.5">
                        {activeDispatch.rider.isComingToFarmer
                          ? `Arriving in ~${activeDispatch.rider.etaToFarmMinutes} mins · ${activeDispatch.rider.distanceToFarmKm} km away`
                          : activeDispatch.rider.status === 'at_farmgate'
                          ? 'Vehicle parked at Gate 1 · Ready for Crate Handover'
                          : `En-route to ${activeDispatch.buyerName} · 8°C cold maintained`}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeDispatch.rider.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs flex-shrink-0"
                    title={`Call Rider ${activeDispatch.rider.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Rider Details Strip */}
                <div className="flex items-center justify-between text-xs bg-[var(--cream2)] p-3 rounded-2xl border border-[var(--border)]">
                  <div>
                    <div className="font-bold text-[var(--text)] flex items-center gap-1.5">
                      <span>{activeDispatch.rider.name}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                        ★ {activeDispatch.rider.rating}
                      </span>
                    </div>
                    <div className="text-[10px] text-[var(--text2)] mt-0.5">
                      {activeDispatch.rider.vehicle} · {activeDispatch.rider.completedPickups} pickups done
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Insulated Box: {activeDispatch.rider.temperatureReading || '10°C'}
                    </span>
                  </div>
                </div>

                {/* WHERE PRODUCT HAS TO BE DELIVERED (The "River" / Buyer Destination) */}
                <div className="bg-[var(--leaf-pale)] border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-[var(--leaf2)] uppercase">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Delivery Destination (Where Product Goes):</span>
                    </span>
                    <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">
                      {activeDispatch.distanceToDestinationKm} km journey
                    </span>
                  </div>

                  <div className="bg-white/80 dark:bg-stone-900/80 p-3 rounded-xl border border-emerald-300/40 space-y-1">
                    <div className="text-xs font-extrabold text-[var(--text)] flex items-center justify-between">
                      <span>🏢 {activeDispatch.buyerName}</span>
                      <span className="text-[10px] text-emerald-700 font-bold capitalize">
                        {activeDispatch.buyerType === 'apmc_mandi' ? 'APMC Mandi Yard' : `${activeDispatch.buyerType} Order`}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text2)] leading-relaxed">
                      {activeDispatch.destinationAddress}, {activeDispatch.destinationCity}
                    </p>
                    <div className="text-[10px] text-[var(--text3)] pt-1 flex items-center justify-between border-t border-stone-200 dark:border-stone-800 mt-1">
                      <span>Harvest Lot: <strong>{activeDispatch.batchNumber}</strong></span>
                      <span>{activeDispatch.crateCount} Crates ({activeDispatch.quantityKg} kg)</span>
                    </div>
                  </div>

                  {/* Route Progress Visualizer */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text2)] mb-1">
                      <span>🏡 Your Sonpur Farm</span>
                      <span className="text-emerald-700">🛵 Cold-Chain Highway Route</span>
                      <span>🎯 Buyer Location</span>
                    </div>
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                        style={{
                          width: activeDispatch.isOtpVerified
                            ? '65%'
                            : activeDispatch.rider.status === 'at_farmgate'
                            ? '30%'
                            : '15%'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECURE CRATE HANDOVER OTP GENERATOR */}
                <div className="bg-stone-900 text-white rounded-3xl p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Farmgate Handover Secure OTP
                      </span>
                    </div>
                    <button
                      onClick={() => handleRegenerateOtp(activeDispatch.id)}
                      className="text-[10px] text-stone-300 hover:text-white flex items-center gap-1 underline font-semibold"
                      title="Generate new Handover OTP"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh Code</span>
                    </button>
                  </div>

                  {/* OTP Code Display Box */}
                  <div className="bg-stone-800 border-2 border-dashed border-amber-400/60 rounded-2xl p-4 text-center space-y-1">
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">
                      Share this 4-Digit OTP with Rider {activeDispatch.rider.name}:
                    </div>

                    <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-widest text-amber-400 py-1">
                      {generatedOtps[activeDispatch.id] || activeDispatch.handoverOtp}
                    </div>

                    <p className="text-[10px] text-stone-300 leading-relaxed max-w-xs mx-auto">
                      {activeDispatch.isOtpVerified ? (
                        <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          OTP Verified! Escrow released to your SBI Bank account.
                        </span>
                      ) : (
                        'Rider must input this code into their delivery handheld app to confirm receipt of the 6 crates. Escrow payment releases instantly upon OTP verification.'
                      )}
                    </p>
                  </div>

                  {/* QR Code Handover Option & Interactive Test Simulation */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-[10px] text-stone-400">
                      Crate Payout: <strong className="text-emerald-400 text-xs font-bold">₹{activeDispatch.totalPayout.toLocaleString('en-IN')}</strong>
                    </div>

                    {!activeDispatch.isOtpVerified ? (
                      <button
                        onClick={() => handleSimulateRiderHandover(activeDispatch.id)}
                        disabled={isSimulatingRider}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all active:scale-95 disabled:opacity-50"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>{isSimulatingRider ? 'Verifying OTP...' : '⚡ Test Rider OTP Scan'}</span>
                      </button>
                    ) : (
                      <div className="px-3 py-1 rounded-xl bg-emerald-900/60 border border-emerald-500 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>UPI Settled: {activeDispatch.upiTransactionId || 'OKSBI/4821'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Drawer Toggle */}
                {qrCodeDataUrls[activeDispatch.id] && (
                  <div className="p-2.5 bg-stone-50 border border-[var(--border)] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={qrCodeDataUrls[activeDispatch.id]}
                        alt="Handover QR"
                        className="w-10 h-10 rounded-lg border border-stone-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-[var(--text)]">
                          Digital Crate SoilChain QR
                        </div>
                        <div className="text-[10px] text-[var(--text3)]">
                          Rider can also scan this QR to verify OTP automatically
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenOriginModal?.(activeDispatch.id)}
                      className="text-xs font-bold text-[var(--leaf2)] underline"
                    >
                      View Tag
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Dedicated Card: List Food Items & Farm Materials */}
            <div
              onClick={onOpenMaterialLister}
              className="bg-gradient-to-r from-amber-950/85 via-stone-900 to-emerald-950/75 text-white rounded-3xl p-4 shadow-md border border-amber-500/40 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🧺
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-amber-200">
                      List Food Items & Farm Materials
                    </h4>
                    <span className="text-[9px] bg-amber-400 text-stone-950 font-extrabold px-1.5 py-0.2 rounded">
                      QUICK
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5 leading-relaxed">
                    List daily dairy (A2 milk, ghee), staples (flour, honey, oil) or rest of materials (bhoosa fodder, vermicompost, dung cakes) in 1-tap.
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-[8px] bg-white/10 text-amber-200 px-1.5 py-0.2 rounded border border-white/10">🥛 A2 Milk</span>
                    <span className="text-[8px] bg-white/10 text-amber-200 px-1.5 py-0.2 rounded border border-white/10">🧈 Desi Ghee</span>
                    <span className="text-[8px] bg-white/10 text-amber-200 px-1.5 py-0.2 rounded border border-white/10">🌾 Chakki Atta</span>
                    <span className="text-[8px] bg-white/10 text-amber-200 px-1.5 py-0.2 rounded border border-white/10">🪵 Cattle Feed</span>
                    <span className="text-[8px] bg-white/10 text-amber-200 px-1.5 py-0.2 rounded border border-white/10">🪴 Vermicompost</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>

            {/* Quick Shoot AI Crop Snapper Teaser Card */}
            <div
              onClick={() => onNavigate('s-sell')}
              className="bg-gradient-to-r from-emerald-800 to-stone-900 text-white rounded-3xl p-4 shadow-md flex items-center justify-between cursor-pointer hover:opacity-95 transition-all group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📸
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#EDD9B8] flex items-center gap-1.5">
                    <span>Shoot Fresh Harvest to List (AI Scanner)</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    Snap a photo of your crates: AI grades crop quality, recommends APMC mandi price, & auto-lists in 30s.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>

            {/* AI Yield Prediction Calculator Card */}
            <div
              onClick={onOpenYieldCalculator}
              className="bg-gradient-to-r from-amber-900/90 via-stone-900 to-stone-900 text-white rounded-3xl p-4 shadow-md border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🔮
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-amber-200">
                      AI Yield & Mandi Price Calculator
                    </h4>
                    <span className="text-[9px] bg-amber-500 text-stone-950 font-extrabold px-1.5 py-0.2 rounded">
                      NEW
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">
                    Input your farm acreage & variety (Tomato, Wheat, Onion, Soybean): get estimated harvest quintals & 30-90 day APMC price forecasts.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
            </div>

            {/* Weather & Golden Harvest Advisory */}
            <div className="bg-[var(--amber-pale)] border border-amber-300 rounded-2xl p-3.5 flex items-start gap-3">
              <Sun className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-2">
                  <span>Vidisha Weather: 28°C · Sunny & Clear</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    Ideal Harvest Day
                  </span>
                </div>
                <p className="text-[10px] text-amber-900 leading-relaxed">
                  <strong>Golden Harvest Window:</strong> Pick tomatoes and leafy greens between 6:00 AM – 10:30 AM before heat peaks. Keeps produce skin crisp and extends market shelf life by 48 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-serif-soil text-base font-extrabold text-[var(--text)]">
                  My Farmgate Live Listings
                </h3>
                <p className="text-[10px] text-[var(--text2)]">
                  Visible to 240+ verified buyers & local supermarkets
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={onOpenMaterialLister}
                  className="py-1.5 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  title="List daily food items or farm materials"
                >
                  <span>🧺</span>
                  <span>+ Food & Material</span>
                </button>
                <button
                  onClick={() => onNavigate('s-sell')}
                  className="py-1.5 px-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  style={{ backgroundColor: 'var(--leaf)' }}
                >
                  <span>+ Harvest</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {farmerProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[var(--border)] rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-[var(--leaf2)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.emoji}</span>
                    <div>
                      <div className="font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                          {p.grade}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--text2)] mt-0.5">
                        Stock: <strong>{p.availableKg} kg</strong> available · ₹{p.pricePerKg}/{p.unit}
                      </div>
                      <div className="text-[9px] text-emerald-700 font-medium">
                        Rating: ★ {p.rating} ({p.reviewsCount} verified reviews)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-extrabold text-[var(--leaf2)] font-serif-soil">
                      ₹{p.pricePerKg}/{p.unit}
                    </span>
                    <button
                      onClick={() => onOpenOriginModal?.(p.id)}
                      className="px-2 py-1 rounded-lg bg-[var(--leaf-pale)] text-[var(--leaf2)] text-[10px] font-bold border border-[var(--leaf2)]/30 hover:bg-[var(--leaf-pale)]/80"
                    >
                      🔗 Crate QR
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live APMC Mandi Rates Comparison */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Today's APMC Mandi Rate vs Your Farmgate</span>
                </span>
                <span className="text-[10px] text-[var(--leaf2)] font-bold">Live Feed</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-stone-50">
                  <span>🍅 Tomato (Karond APMC)</span>
                  <div className="text-right">
                    <span className="font-bold text-stone-900">₹32/kg</span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                      Your Price: ₹32/kg (100% Fair)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-stone-50">
                  <span>🥬 Palak Spinach (Bhopal APMC)</span>
                  <div className="text-right">
                    <span className="font-bold text-stone-900">₹16/bunch</span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                      Your Price: ₹18/bunch (+12% Premium)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded-xl bg-stone-50">
                  <span>🌾 Sharbati Wheat (Sehore APMC)</span>
                  <div className="text-right">
                    <span className="font-bold text-stone-900">₹41/kg</span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                      Your Price: ₹44/kg (+7% Premium)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANK & UPI EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <div className="space-y-3.5">
            <div className="bg-emerald-900 text-white rounded-3xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Farmer Direct UPI Account
                </span>
                <span className="text-[9px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
                  Verified SBI
                </span>
              </div>

              <div>
                <div className="text-[11px] text-emerald-200">Total Harvest Earnings (Month)</div>
                <div className="text-3xl font-serif-soil font-extrabold text-white mt-0.5">
                  ₹48,250
                </div>
              </div>

              <div className="p-2.5 bg-white/10 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-emerald-200">Registered UPI ID:</div>
                  <div className="font-mono font-bold text-white">rameshpatel@oksbi</div>
                </div>
                <span className="text-emerald-300 font-bold text-[10px]">Instant Payouts</span>
              </div>
            </div>

            {/* Escrow Settlement Pipeline */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-3.5 space-y-2.5 shadow-xs">
              <h4 className="font-bold text-xs text-[var(--text)]">
                Recent Escrow Handover Transactions
              </h4>

              <div className="space-y-2">
                {dispatches.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between text-xs border border-stone-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{d.emoji}</span>
                      <div>
                        <div className="font-bold text-stone-900">{d.cropName}</div>
                        <div className="text-[10px] text-stone-500">
                          {d.crateCount} crates ({d.quantityKg}kg) · Lot {d.batchNumber}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-stone-900">
                        ₹{d.totalPayout.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9px] font-bold">
                        {d.payoutStatus === 'transferred_to_upi' ? (
                          <span className="text-emerald-600">✓ UPI Paid</span>
                        ) : (
                          <span className="text-amber-600">⏳ OTP Escrow</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
