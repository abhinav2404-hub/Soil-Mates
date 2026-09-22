import React from 'react';
import { OrderItem, ScreenId } from '../types';
import { ArrowLeft, Phone, ShieldCheck, MapPin } from 'lucide-react';

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
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Back Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <button
          onClick={() => onNavigate('s-orders')}
          className="text-[#EDD9B8] hover:text-white p-1 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8] truncate">
          Track Order {order.orderNumber}
        </h3>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5">
        {/* Live GPS Map Simulation Card */}
        <div className="bg-[var(--leaf-pale)] rounded-2xl p-6 text-center border border-[rgba(45,106,45,0.2)] shadow-xs relative overflow-hidden">
          {/* Simulated Map Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #2D6A2D 0, #2D6A2D 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #2D6A2D 0, #2D6A2D 1px, transparent 1px, transparent 20px)'
            }}
          ></div>

          <div className="relative z-10 space-y-1.5">
            <div className="text-4xl select-none mb-1 animate-bounce">🚚</div>
            <div className="text-xs font-bold text-[var(--leaf2)] flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Live Cold-Chain GPS Tracking</span>
            </div>
            <p className="text-[10px] text-[var(--text3)]">
              Rider is 3.2 km away · Estimated Arrival {order.eta}
            </p>

            <div className="pt-2">
              <button
                onClick={() =>
                  onShowToast(`Calling rider ${order.riderName} at ${order.riderPhone}...`)
                }
                className="px-4 py-1.5 rounded-xl bg-[var(--soil)] text-[#EDD9B8] text-xs font-bold shadow-sm hover:bg-[var(--soil2)] transition-transform active:scale-95 inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider ({order.riderName.split(' ')[0]})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5-Step Pipeline Tracking Stepper */}
        <div className="bg-[var(--white)] rounded-2xl p-4 border border-[var(--border)] shadow-xs">
          <h4 className="font-serif-soil text-xs font-bold text-[var(--text)] mb-3">
            Milestone Progress
          </h4>

          <div className="space-y-3.5 relative">
            {/* Connecting line */}
            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-[var(--leaf-pale)] z-0"></div>

            {order.steps.map((step, idx) => {
              const isDone = step.status === 'done';
              const isActive = step.status === 'active';

              return (
                <div key={idx} className="flex items-start gap-3 relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      isDone
                        ? 'bg-[var(--leaf2)] text-white shadow-xs'
                        : isActive
                        ? 'bg-[var(--amber)] text-white ring-4 ring-[var(--amber-pale)] animate-pulse'
                        : 'bg-[var(--leaf-pale)] text-[var(--leaf2)] border border-[var(--leaf2)]/30'
                    }`}
                  >
                    {isDone ? '✓' : isActive ? '🚚' : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[var(--text)]">{step.title}</h5>
                      <span className="text-[9px] text-[var(--text3)] font-medium">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text3)] mt-0.5 leading-tight">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blockchain Verified Trail Card */}
        <div className="bg-[var(--cream2)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--soil2)]">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>🔗 Blockchain Verified Supply Chain Trail</span>
          </div>

          <div className="text-[11px] text-[var(--text2)] space-y-1 font-mono leading-relaxed bg-white/60 rounded-xl p-2.5 border border-[var(--border)]">
            <div>🔗 Farm Origin Hash → Verified (Block #89102) ✓</div>
            <div>🔗 Grade A Quality Certificate → Anchored ✓</div>
            <div>🔗 Real-time Temperature Sensor: 11.8°C (Compliant) ✓</div>
            <div>🔗 Delivery Agent Bond: Active ✓</div>
            <div>🔗 Delivery OTP Handshake: Pending Customer Verification</div>
          </div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
};
