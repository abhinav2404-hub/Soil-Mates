import React, { useState } from 'react';
import { CartItem, ScreenId, OrderItem } from '../types';
import { ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';

interface CartScreenProps {
  cart: CartItem[];
  onNavigate: (screen: ScreenId) => void;
  onUpdateQuantity: (produceId: string, delta: number) => void;
  onRemoveItem: (produceId: string) => void;
  onPlaceOrder: (newOrder: OrderItem) => void;
  onShowToast: (msg: string) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onShowToast
}) => {
  const [address, setAddress] = useState<string>('42, Arera Colony, Bhopal 462016');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const subtotal = cart.reduce((acc, item) => {
    return acc + item.produce.pricePerKg * item.quantity;
  }, 0);

  const discount = Math.round(subtotal * 0.05);
  const isFreeDelivery = subtotal >= 120;
  const deliveryFee = isFreeDelivery ? 0 : 25;
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleCheckout = () => {
    if (cart.length === 0) {
      onShowToast('Your cart is empty.');
      return;
    }

    setIsCheckingOut(true);
    onShowToast('Processing secure payment & booking rider...');

    setTimeout(() => {
      setIsCheckingOut(false);
      const orderNum = `#SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const summary = cart
        .map((c) => `${c.produce.emoji} ${c.produce.name} (${c.quantity}${c.produce.unit})`)
        .join(' · ');

      const newOrder: OrderItem = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        dateStr: 'Just now',
        status: 'in_transit',
        statusLabel: 'In Transit',
        itemsSummary: summary,
        pickupInfo: 'Pickup verified from Sonpur Farm Hub',
        totalAmount: finalTotal,
        eta: 'In 2 hours (11:30 AM)',
        riderName: 'Mukesh Kumar (Rider #402)',
        riderPhone: '+91 94251 09871',
        steps: [
          { title: 'Order Confirmed', description: `Payment of ₹${finalTotal} verified via ${selectedPayment.toUpperCase()}`, timestamp: 'Just now', status: 'done' },
          { title: 'Farmer Notified', description: 'Farmers packing harvest lot', timestamp: 'Just now', status: 'done' },
          { title: 'Pickup Scheduled', description: 'Local cold-chain truck dispatched', timestamp: 'Next', status: 'active' },
          { title: 'Out for Delivery', description: 'Assigned to delivery rider', timestamp: 'Pending', status: 'pending' },
          { title: 'Delivered', description: 'OTP confirmation at destination', timestamp: 'Pending', status: 'pending' }
        ],
        blockchainTrail: {
          originVerified: true,
          qualityCertified: true,
          coldChainMaintained: true,
          deliveryPartnerAssigned: true,
          otpDelivered: false
        }
      };

      onPlaceOrder(newOrder);
      onShowToast(`🎉 Order ${orderNum} placed successfully!`);
      onNavigate('s-track');
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Back Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <button
          onClick={() => onNavigate('s-home')}
          className="text-[#EDD9B8] hover:text-white p-1 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8]">
          Your Cart ({cart.length} items)
        </h3>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
        {/* Free Delivery Banner */}
        <div className="bg-[var(--leaf-pale)] border border-[rgba(45,106,45,0.2)] rounded-xl p-2.5 text-xs text-[var(--leaf2)] font-bold flex items-center gap-2">
          <span>🚚</span>
          <span>
            {isFreeDelivery
              ? 'Free express delivery unlocked! (Orders above ₹120)'
              : `Add ₹${120 - subtotal} more for FREE express delivery`}
          </span>
        </div>

        {/* Cart Items List */}
        {cart.length === 0 ? (
          <div className="bg-[var(--white)] rounded-2xl p-8 text-center border border-[var(--border)] shadow-xs">
            <div className="text-5xl mb-2 select-none">🛒</div>
            <h4 className="font-serif-soil text-base font-bold text-[var(--text)]">
              Your cart is empty
            </h4>
            <p className="text-xs text-[var(--text3)] mt-1">
              Explore today's fresh farm harvest and add produce.
            </p>
            <button
              onClick={() => onNavigate('s-home')}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-[#EDD9B8] shadow-sm"
              style={{ backgroundColor: 'var(--soil)' }}
            >
              Browse Fresh Harvest →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.produce.id}
                className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)] shadow-xs flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--leaf-pale)] flex items-center justify-center text-3xl flex-shrink-0">
                  {item.produce.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--text)] truncate">
                    {item.produce.name}
                  </div>
                  <div className="text-[10px] text-[var(--text3)] truncate">
                    🌱 {item.produce.farmName}
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateQuantity(item.produce.id, -1)}
                        className="w-5 h-5 rounded bg-[var(--cream2)] border border-[var(--border)] text-[var(--soil)] font-extrabold text-xs flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-xs font-extrabold text-[var(--text)] min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.produce.id, 1)}
                        className="w-5 h-5 rounded bg-[var(--cream2)] border border-[var(--border)] text-[var(--soil)] font-extrabold text-xs flex items-center justify-center"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-[var(--text3)]">
                        {item.produce.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-serif-soil text-sm font-extrabold text-[var(--leaf)]">
                        ₹{item.produce.pricePerKg * item.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.produce.id)}
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Summary Box */}
        {cart.length > 0 && (
          <>
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
                Order Summary
              </h4>

              <div className="flex justify-between text-xs text-[var(--text2)]">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-xs text-[var(--text2)]">
                <span>Direct Cold Delivery</span>
                <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : ''}>
                  {isFreeDelivery ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Soil Mates 5% Direct Discount</span>
                <span>-₹{discount}</span>
              </div>

              <div className="pt-2 border-t border-[var(--leaf-pale)] flex justify-between items-center">
                <span className="font-bold text-xs text-[var(--text)]">Total Pay Amount</span>
                <span className="font-serif-soil text-lg font-extrabold text-[var(--text)]">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-[var(--cream2)] border border-[var(--border)] rounded-2xl p-3 text-xs text-[var(--text2)] space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[var(--text)]">📍 Delivery Address</span>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-[10px] text-[var(--leaf2)] font-bold hover:underline"
                >
                  {isEditingAddress ? 'Save' : 'Change'}
                </button>
              </div>
              {isEditingAddress ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 bg-white border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--text)] outline-none"
                />
              ) : (
                <p className="text-[11px] text-[var(--text3)]">{address}</p>
              )}
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[var(--text2)] uppercase">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { id: 'upi', label: '📱 UPI / GPay' },
                  { id: 'card', label: '💳 Cards / Net' },
                  { id: 'cash', label: '💵 Cash (COD)' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedPayment(mode.id as any)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                      selectedPayment === mode.id
                        ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-xs'
                        : 'bg-[var(--white)] text-[var(--text2)] border-[var(--border)]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--leaf)', color: '#EDD9B8' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCheckingOut ? 'Securing Farm Booking...' : `Pay ₹${finalTotal} & Confirm Order`}
              </span>
            </button>
          </>
        )}

        <div className="h-4"></div>
      </div>
    </div>
  );
};
