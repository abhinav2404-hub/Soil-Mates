import React, { useState } from 'react';
import { OrderItem, ScreenId } from '../types';
import { ArrowLeft, Phone, ShieldCheck, MapPin, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackOrderScreenProps {
  order: OrderItem;
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
}

export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({
  order,
  onNavigate,
  onShowToast
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Back Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0 text-white"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('s-orders')}
          className="text-white hover:text-stone-200 p-1 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h3 className="font-serif-soil text-base font-bold text-white truncate">
          Live Tracker {order.orderNumber}
        </h3>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5 pb-8">
        {/* Live GPS Map Simulation Card */}
        <div className="bg-[var(--leaf-pale)] rounded-2xl p-5 text-center border border-[rgba(45,106,45,0.2)] shadow-xs relative overflow-hidden">
          {/* Simulated Map Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #2D6A2D 0, #2D6A2D 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2D6A2D 0, #2D6A2D 1px, transparent 1px, transparent 20px)'
            }}
          />

          <div className="relative z-10 space-y-2">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-4xl select-none"
            >
              🚚
            </motion.div>

            <div className="text-xs font-bold text-[var(--leaf2)] flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Cold-Chain Telemetry GPS Active</span>
            </div>

            <p className="text-[10px] text-[var(--text3)]">
              Temperature: 4.2°C · Distance: 2.8 km away · ETA: {order.eta}
            </p>

            <div className="pt-1 flex gap-2 justify-center">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() =>
                  onShowToast(`Connecting call with rider ${order.riderName}...`)
                }
                className="px-3.5 py-1.5 rounded-xl bg-[var(--soil)] text-[#EDD9B8] text-xs font-bold shadow-xs hover:bg-[var(--soil2)] transition-transform inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider ({order.riderName.split(' ')[0]})</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* 5-Step Animated Milestone Stepper */}
        <div className="bg-[var(--white)] rounded-2xl p-4 border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
            <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Delivery Milestones (5 Steps)
            </h4>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              Live Transit
            </span>
          </div>

          <div className="space-y-3.5 relative">
            {/* Connecting line */}
            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-stone-200 z-0" />

            {order.steps.map((step, idx) => {
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';
              const isExpanded = expandedStep === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-3 relative z-10 cursor-pointer"
                  onClick={() => toggleStep(idx)}
                >
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      isDone
                        ? 'bg-[var(--leaf2)] text-white shadow-xs'
                        : isActive
                        ? 'bg-[var(--amber)] text-white ring-4 ring-amber-100'
                        : 'bg-[var(--cream2)] text-[var(--text3)] border border-[var(--border)]'
                    }`}
                  >
                    {isDone ? '✓' : isActive ? '🚚' : idx + 1}
                  </motion.div>

                  <div className="flex-1 min-w-0 bg-[var(--cream2)]/60 rounded-xl p-2 border border-[var(--border)]/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text)]">
                        {step.title}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text3)]">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-[10px] text-[var(--text2)] mt-0.5">
                      {step.description}
                    </p>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-[var(--border)] text-[9px] text-[var(--text3)] space-y-1"
                        >
                          <div>Verified by: Agro-Cold Telemetry Gate #3</div>
                          <div>Cryptographic Hash: 0x7fa2...9b18 (Immutable)</div>
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
            <div className="flex items-center gap-1 text-emerald-800 font-semibold">
              <span>✓</span>
              <span>Farm Origin Sealed</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 font-semibold">
              <span>✓</span>
              <span>Grade A Lab Verified</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800 font-semibold">
              <span>✓</span>
              <span>Cold-Chain &lt; 5°C</span>
            </div>
            <div className="flex items-center gap-1 text-stone-600 font-semibold">
              <span>○</span>
              <span>OTP Handshake Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
