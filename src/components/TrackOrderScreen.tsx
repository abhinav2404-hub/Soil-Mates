import React, { useState, useEffect, useMemo } from 'react';
import { OrderItem, ScreenId } from '../types';
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Navigation,
  Clock,
  Thermometer,
  Home,
  User,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface TrackOrderScreenProps {
  order: OrderItem;
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
}

// Bhopal & Surrounding Agricultural Belt coordinates
const FARM_LOCATION = { lat: 23.2845, lng: 77.3780 }; // Sonpur Organic Hub
const HOMESTEAD_LOCATION = { lat: 23.2185, lng: 77.4340 }; // Customer Homestead

// Interpolate waypoints along the delivery route
const ROUTE_WAYPOINTS = [
  { lat: 23.2845, lng: 77.3780, label: 'Farm Warehouse Dispatch' },
  { lat: 23.2680, lng: 77.3920, label: 'Kolar Bypass Checkpoint' },
  { lat: 23.2510, lng: 77.4080, label: 'Shahpura Ring Road' },
  { lat: 23.2350, lng: 77.4210, label: 'Arera Colony Avenue' },
  { lat: 23.2185, lng: 77.4340, label: 'Delivered at Homestead Gate' }
];

export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({
  order,
  onNavigate,
  onShowToast
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [deliveryProgress, setDeliveryProgress] = useState<number>(1); // Index 0 to 4
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  // Google Maps API Key from environment
  const mapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Current Courier Position
  const courierLocation = useMemo(() => {
    return ROUTE_WAYPOINTS[deliveryProgress];
  }, [deliveryProgress]);

  const isDelivered = deliveryProgress === ROUTE_WAYPOINTS.length - 1;

  // Auto-simulation interval when simulation mode is active
  useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setDeliveryProgress((prev) => {
        if (prev < ROUTE_WAYPOINTS.length - 1) {
          const next = prev + 1;
          if (next === ROUTE_WAYPOINTS.length - 1) {
            setIsSimulating(false);
            onShowToast('🎉 Mukesh Kumar has safely arrived and delivered to your homestead!');
          }
          return next;
        }
        setIsSimulating(false);
        return prev;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isSimulating, onShowToast]);

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  const remainingDistanceKm = useMemo(() => {
    if (isDelivered) return '0.0';
    return ((ROUTE_WAYPOINTS.length - 1 - deliveryProgress) * 1.4).toFixed(1);
  }, [deliveryProgress, isDelivered]);

  const remainingEtaMinutes = useMemo(() => {
    if (isDelivered) return 'Arrived';
    return `${(ROUTE_WAYPOINTS.length - 1 - deliveryProgress) * 7} mins`;
  }, [deliveryProgress, isDelivered]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)] text-[var(--text)]">
      {/* Top Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0 text-white shadow-sm"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('s-orders')}
            className="text-white hover:text-stone-200 p-1 cursor-pointer transition-transform"
            aria-label="Back to orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h3 className="font-serif-soil text-base font-bold text-white truncate leading-tight">
              Track Order {order.orderNumber}
            </h3>
            <span className="text-[10px] text-emerald-200 font-medium">
              Live Cold-Chain GPS Navigation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>{isDelivered ? 'Delivered' : 'Live Transit'}</span>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5 pb-12">
        {/* Real Google Maps Container */}
        <div className="bg-[var(--white)] rounded-2xl overflow-hidden border border-[var(--border)] shadow-xs relative">
          {/* Map Header Status Bar */}
          <div className="p-3 bg-[var(--cream2)] border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                🛵
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text)]">
                  {isDelivered ? 'Order Delivered to Homestead' : 'Mukesh Kumar is En Route'}
                </div>
                <div className="text-[10px] text-[var(--text3)]">
                  {isDelivered
                    ? 'Handed over at Plot 42, Homestead Drive'
                    : `Coming to myself · ${remainingDistanceKm} km away · ETA: ${remainingEtaMinutes}`}
                </div>
              </div>
            </div>

            {/* Quick Status Pill */}
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isDelivered
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {isDelivered ? '🏡 Delivered' : '⚡ On the Way'}
            </span>
          </div>

          {/* Interactive Map View */}
          <div className="w-full h-72 relative bg-stone-100 dark:bg-stone-900">
            {mapsApiKey ? (
              <APIProvider apiKey={mapsApiKey}>
                <Map
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={{ lat: 23.2515, lng: 77.4060 }}
                  defaultZoom={12}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Farm Origin Pin */}
                  <AdvancedMarker position={FARM_LOCATION} title="Sonpur Organic Farm Hub">
                    <Pin background="#2D5A27" glyphColor="#FFFFFF" borderColor="#1E3F1A" />
                  </AdvancedMarker>

                  {/* Customer Homestead Pin */}
                  <AdvancedMarker position={HOMESTEAD_LOCATION} title="Your Homestead">
                    <div className="bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform -translate-y-2">
                      <Home className="w-4 h-4" />
                    </div>
                  </AdvancedMarker>

                  {/* Delivery Courier / Person Pin (Moving along route) */}
                  <AdvancedMarker position={courierLocation} title="Delivery Person: Mukesh Kumar">
                    <div className="relative cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center text-lg shadow-xl border-2 border-white animate-pulse">
                        🛵
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        Mukesh (Courier)
                      </div>
                    </div>
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              /* Fallback Interactive GPS Canvas when API key is provisioning or in local mode */
              <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-between p-4 bg-gradient-to-br from-emerald-50/70 via-stone-50 to-amber-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950">
                {/* Simulated Geographic Grid Lines */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #2D5A27 1px, transparent 1px), linear-gradient(to right, rgba(45,90,39,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,90,39,0.1) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Top Telemetry overlay */}
                <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-semibold text-[var(--text2)] bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                    <span>Payload: 4.2°C (Sealed)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Speed: 28 km/h</span>
                  </div>
                </div>

                {/* Route Visualizer */}
                <div className="relative z-10 w-full max-w-xs my-auto py-2">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting Route Track */}
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-stone-300 dark:bg-stone-700 rounded-full" />
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${(deliveryProgress / (ROUTE_WAYPOINTS.length - 1)) * 100}%`
                      }}
                    />

                    {/* Farm Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shadow-md">
                        🌱
                      </div>
                      <span className="text-[9px] font-bold mt-1 text-[var(--text2)]">Farm Hub</span>
                    </div>

                    {/* Active Courier Person Node */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-base shadow-lg border-2 border-white ring-2 ring-amber-300">
                        🛵
                      </div>
                      <span className="text-[9px] font-bold mt-1 text-amber-700 dark:text-amber-400 whitespace-nowrap">
                        Mukesh (Courier)
                      </span>
                    </motion.div>

                    {/* Homestead Destination Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md transition-colors ${
                          isDelivered ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-800 text-[var(--text2)]'
                        }`}
                      >
                        🏡
                      </div>
                      <span className="text-[9px] font-bold mt-1 text-[var(--text2)]">My Homestead</span>
                    </div>
                  </div>
                </div>

                {/* Waypoint Milestone Banner */}
                <div className="relative z-10 text-center">
                  <span className="text-[11px] font-bold text-[var(--text)] bg-white/90 dark:bg-stone-900/90 px-3 py-1 rounded-full border border-[var(--border)] shadow-xs">
                    Current Landmark: {courierLocation.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Person / Delivery Controls Bar */}
          <div className="p-3 bg-[var(--white)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-[var(--text)] font-bold text-xs">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Mukesh Kumar</div>
                  <div className="text-[10px] text-[var(--text3)]">
                    Hero Electric Scooter · MP-04-TR-8821
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => onShowToast(`📞 Calling delivery partner Mukesh Kumar (+91 94251 09871)...`)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Courier</span>
              </motion.button>
            </div>

            {/* Simulation Controls: "Coming to myself" vs "Delivered to homestead" */}
            <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2 items-center justify-between">
              <div className="text-[11px] text-[var(--text3)]">
                Status:{' '}
                <strong className="text-[var(--text)]">
                  {isDelivered ? 'Arrived at your homestead' : 'Coming to your address'}
                </strong>
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isDelivered) {
                      setDeliveryProgress(1);
                      setIsSimulating(false);
                      onShowToast('Resetting tracker: Courier Mukesh is back en route!');
                    } else {
                      setIsSimulating(!isSimulating);
                      onShowToast(
                        !isSimulating
                          ? '🚚 Simulating courier movement towards your homestead...'
                          : 'Simulation paused'
                      );
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--cream2)] hover:bg-stone-200 dark:hover:bg-stone-850 text-[var(--text)] text-[11px] font-bold border border-[var(--border)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isDelivered ? 'Restart Track' : isSimulating ? 'Pause Movement' : 'Simulate Ride'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryProgress(ROUTE_WAYPOINTS.length - 1);
                    setIsSimulating(false);
                    onShowToast('✅ Order marked as successfully delivered to your homestead!');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mark Delivered</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Homestead & OTP Verification Card */}
        <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Delivery Destination</h4>
                <p className="text-[10px] text-[var(--text3)]">
                  Plot 42, Green Meadows, Homestead Colony, Bhopal
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md">
              Doorstep Safe Drop
            </span>
          </div>

          <div className="bg-[var(--cream2)] rounded-xl p-3 border border-[var(--border)] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[var(--text3)] font-semibold">Delivery Handover PIN</div>
              <div className="text-base font-extrabold font-mono text-[var(--text)] tracking-wider">
                {otpVerified ? 'VERIFIED ✓' : '4 8 9 2'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setOtpVerified(true);
                setDeliveryProgress(ROUTE_WAYPOINTS.length - 1);
                onShowToast('🎉 OTP Handshake complete: Produce handed over safely!');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                otpVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--soil)] text-white hover:bg-[var(--soil2)]'
              }`}
            >
              {otpVerified ? 'Delivered ✓' : 'Verify OTP Handover'}
            </button>
          </div>
        </div>

        {/* 5-Step Animated Milestone Stepper */}
        <div className="bg-[var(--white)] rounded-2xl p-4 border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
            <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Delivery Milestones (Farm to Homestead)
            </h4>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md">
              {isDelivered ? 'Completed' : 'Step 4 of 5'}
            </span>
          </div>

          <div className="space-y-3.5 relative">
            {/* Connecting line */}
            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-stone-200 dark:bg-stone-700 z-0" />

            {order.steps.map((step, idx) => {
              // Dynamically update steps based on deliveryProgress
              const isDone = isDelivered ? true : idx < deliveryProgress;
              const isActive = !isDelivered && idx === deliveryProgress;
              const isExpanded = expandedStep === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-start gap-3 relative z-10 cursor-pointer"
                  onClick={() => toggleStep(idx)}
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isActive
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950'
                        : 'bg-[var(--cream2)] text-[var(--text3)] border border-[var(--border)]'
                    }`}
                  >
                    {isDone ? '✓' : isActive ? '🛵' : idx + 1}
                  </motion.div>

                  <div className="flex-1 min-w-0 bg-[var(--cream2)]/60 rounded-xl p-2.5 border border-[var(--border)]/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text)]">
                        {step.title}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text3)]">
                        {isActive ? 'In Progress' : isDone ? 'Completed' : step.timestamp}
                      </span>
                    </div>

                    <p className="text-[10px] text-[var(--text2)] mt-0.5">
                      {idx === 3 && !isDelivered
                        ? 'Mukesh Kumar is navigating towards your homestead on his electric scooter.'
                        : idx === 4 && isDelivered
                        ? 'Package securely handed over at your doorstep. Verified with OTP.'
                        : step.description}
                    </p>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-[var(--border)] text-[9px] text-[var(--text3)] space-y-1"
                        >
                          <div>Telemetry Hub: Agro-Cold Telemetry Gate #3</div>
                          <div>Cryptographic Proof: 0x7fa2...9b18 (Tamper Proof)</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Blockchain Origin Quality Verification */}
        <div className="bg-[var(--cream2)] border border-[var(--border)] rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text)]">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Traceability Checkpoints</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold">
              <span>✓</span>
              <span>Farm Origin Sealed</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold">
              <span>✓</span>
              <span>Grade A Lab Verified</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold">
              <span>✓</span>
              <span>Cold-Chain &lt; 5°C</span>
            </div>
            <div
              className={`flex items-center gap-1 font-semibold ${
                isDelivered
                  ? 'text-emerald-800 dark:text-emerald-400'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <span>{isDelivered ? '✓' : '○'}</span>
              <span>{isDelivered ? 'OTP Handshake Verified' : 'OTP Handshake Pending'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
