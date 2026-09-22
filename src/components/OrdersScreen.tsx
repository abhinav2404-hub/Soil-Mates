import React, { useState } from 'react';
import { OrderItem, ScreenId } from '../types';

interface OrdersScreenProps {
  orders: OrderItem[];
  onNavigate: (screen: ScreenId) => void;
  onSelectOrder: (order: OrderItem) => void;
  onShowToast: (msg: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  onNavigate,
  onSelectOrder,
  onShowToast
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return o.status === 'in_transit' || o.status === 'processing';
    if (activeFilter === 'delivered') return o.status === 'delivered';
    if (activeFilter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

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
              📦 My Orders
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 mt-0.5 font-medium">
              Track cold chain logistics & farm history
            </p>
          </div>
          <span className="text-xl">🚚</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active In-Transit' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-sm'
                  : 'bg-[var(--cream2)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-2.5">
          {filteredOrders.map((ord) => {
            const isDelivered = ord.status === 'delivered';
            const isInTransit = ord.status === 'in_transit';

            return (
              <div
                key={ord.id}
                className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2"
              >
                {/* Order Head */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif-soil text-xs font-bold text-[var(--text)]">
                      {ord.orderNumber}
                    </div>
                    <div className="text-[10px] text-[var(--text3)]">{ord.dateStr}</div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isDelivered
                        ? 'bg-[var(--leaf-pale)] text-[#2D6A2D]'
                        : isInTransit
                        ? 'bg-[var(--amber-pale)] text-[var(--amber)] animate-pulse'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {isInTransit ? '🚚 In Transit' : isDelivered ? '✓ Delivered' : '⏳ Processing'}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="text-xs text-[var(--text2)] leading-relaxed">
                  {ord.itemsSummary}
                </div>

                {/* Pickup Info */}
                <div className="bg-[var(--leaf-pale)] rounded-xl px-2.5 py-1.5 text-[10px] text-[var(--text2)] flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{ord.pickupInfo} · ETA: {ord.eta}</span>
                </div>

                {/* Bottom Total & Actions */}
                <div className="pt-2 border-t border-[var(--leaf-pale)] flex items-center justify-between">
                  <span className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
                    ₹{ord.totalAmount}
                  </span>

                  <div className="flex gap-2">
                    {isInTransit ? (
                      <button
                        onClick={() => {
                          onSelectOrder(ord);
                          onNavigate('s-track');
                        }}
                        className="px-3 py-1 rounded-lg bg-[var(--leaf-pale)] text-[var(--leaf2)] border border-[var(--leaf2)]/30 text-xs font-bold hover:bg-[var(--leaf-pale)]/80 transition-transform active:scale-95"
                      >
                        🗺 Track Live
                      </button>
                    ) : isDelivered ? (
                      <button
                        onClick={() => onShowToast('Thank you! Rating 5★ recorded.')}
                        className="px-3 py-1 rounded-lg bg-[var(--cream2)] text-[var(--text2)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--leaf-pale)]"
                      >
                        ★ Rate Order
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectOrder(ord);
                          onNavigate('s-track');
                        }}
                        className="px-3 py-1 rounded-lg bg-[var(--cream2)] text-[var(--text2)] border border-[var(--border)] text-xs font-bold"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
};
