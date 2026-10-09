import React, { useState } from 'react';
import { CartItem, ScreenId, OrderItem } from '../types';
import { ArrowLeft, Trash2, CheckCircle2, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartScreenProps {
  cart: CartItem[];
  onNavigate: (screen: ScreenId) => void;
  onUpdateQuantity: (produceId: string, delta: number) => void;
  onRemoveItem: (produceId: string) => void;
  onPlaceOrder: (newOrder: OrderItem) => void;
  onShowToast: (msg: string) => void;
}

const DELIVERY_SLOTS = [
  { id: 'morning', label: 'Morning Fresh', time: '6:30 AM - 9:00 AM', badge: 'Popular' },
  { id: 'afternoon', label: 'Mid-Day Express', time: '12:00 PM - 2:30 PM', badge: 'Fastest' },
  { id: 'evening', label: 'Evening Kitchen', time: '5:30 PM - 8:00 PM', badge: 'Convenient' }
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱', sub: 'Instant Zero-Fee Transfer' },
  { id: 'escrow', label: 'Mandi Smart Escrow', icon: '🔒', sub: 'Released upon OTP verification' },
  { id: 'card', label: 'Cards & NetBanking', icon: '💳', sub: 'Visa, Rupay, Mastercard' },
  { id: 'cash', label: 'Cash on Farmgate (COD)', icon: '💵', sub: 'Pay cash to delivery rider' }
];

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onShowToast
}) => {
  const [address, setAddress] = useState<string>('42, Arera Colony Phase 2, Bhopal 462016');
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('morning');
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');
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
    onShowToast('Securing farm lot & booking cold transport...');

    setTimeout(() => {
      setIsCheckingOut(false);
      const orderNum = `#SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const summary = cart
        .map((c) => `${c.produce.emoji} ${c.produce.name} (${c.quantity}${c.produce.unit})`)
        .join(' · ');

      const chosenSlotObj = DELIVERY_SLOTS.find((s) => s.id === selectedSlot);

      const newOrder: OrderItem = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        dateStr: 'Just now',
        status: 'in_transit',
        statusLabel: 'In Transit',
        itemsSummary: summary,
        pickupInfo: 'Direct cold dispatch from Sonpur Farm Hub',
        totalAmount: finalTotal,
        eta: chosenSlotObj ? chosenSlotObj.time : 'In 2 hours',
        riderName: 'Mukesh Kumar (Rider #402)',
        riderPhone: '+91 94251 09871',
        steps: [
          { title: 'Order Confirmed', description: `Payment of ₹${finalTotal} verified via ${selectedPayment.toUpperCase()}`, timestamp: 'Just now', status: 'done' },
          { title: 'Harvest Lot Packed', description: 'Freshly harvested lot packed with QR origin seal', timestamp: 'Just now', status: 'done' },
          { title: 'Cold-Chain Dispatched', description: 'Assigned to reefer truck #MP-04-HE-8901', timestamp: 'Next', status: 'active' },
          { title: 'Out for Delivery', description: `Scheduled slot: ${chosenSlotObj?.time || 'Morning'}`, timestamp: 'Pending', status: 'pending' },
          { title: 'Delivered', description: 'Customer OTP signature at doorstep', timestamp: 'Pending', status: 'pending' }
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
      onShowToast(`🎉 Order ${orderNum} confirmed!`);
      onNavigate('s-track');
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Back Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0 text-white"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('s-home')}
            className="text-white hover:text-stone-200 p-1 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h3 className="font-serif-soil text-base font-bold text-white">
            Your Cart ({cart.length} items)
          </h3>
        </div>
        <span className="text-[11px] text-[#6BBF6B] font-semibold">
          Direct Farmgate
        </span>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5 pb-8">
        {/* Free Delivery Banner */}
        <div className="bg-[var(--leaf-pale)] border border-[rgba(45,106,45,0.2)] rounded-xl p-2.5 text-xs text-[var(--leaf2)] font-bold flex items-center gap-2">
          <span>🚚</span>
          <span>
            {isFreeDelivery
              ? 'Free express cold delivery unlocked! (Orders above ₹120)'
              : `Add ₹${120 - subtotal} more for FREE express delivery`}
          </span>
        </div>

        {/* Step 1: Cart Items List */}
        {cart.length === 0 ? (
          <div className="bg-[var(--white)] rounded-2xl p-8 text-center border border-[var(--border)] shadow-xs">
            <div className="text-5xl mb-2 select-none">🛒</div>
            <h4 className="font-serif-soil text-base font-bold text-[var(--text)]">
              Your cart is empty
            </h4>
            <p className="text-xs text-[var(--text3)] mt-1">
              Explore today's fresh farm harvest and add produce.
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => onNavigate('s-home')}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-[#EDD9B8] shadow-sm cursor-pointer"
              style={{ backgroundColor: 'var(--soil)' }}
            >
              Browse Fresh Harvest →
            </motion.button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[var(--text2)] uppercase px-0.5">
              Step 1: Review Farm Items
            </div>
            {cart.map((item) => (
              <motion.div
                key={item.produce.id}
                layout
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
                    {/* Quantity Stepper with Motion */}
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onUpdateQuantity(item.produce.id, -1)}
                        className="w-6 h-6 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[var(--soil)] font-extrabold text-xs flex items-center justify-center cursor-pointer"
                      >
                        −
                      </motion.button>
                      <span className="text-xs font-extrabold text-[var(--text)] min-w-4 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onUpdateQuantity(item.produce.id, 1)}
                        className="w-6 h-6 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[var(--soil)] font-extrabold text-xs flex items-center justify-center cursor-pointer"
                      >
                        +
                      </motion.button>
                      <span className="text-[10px] text-[var(--text3)]">
                        {item.produce.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-serif-soil text-sm font-extrabold text-[var(--leaf)] tabular-nums">
                        ₹{item.produce.pricePerKg * item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onRemoveItem(item.produce.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Step 2: Delivery Slot Options */}
        {cart.length > 0 && (
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Step 2: Choose Delivery Time Slot</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DELIVERY_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] shadow-xs'
                        : 'bg-[var(--cream2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]/50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text)] block">
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-[var(--text3)]">
                        {slot.time}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      {slot.badge}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {cart.length > 0 && (
          <div className="bg-[var(--cream2)] border border-[var(--border)] rounded-2xl p-3 text-xs text-[var(--text2)] space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[var(--text)]">📍 Destination Address</span>
              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-[10px] text-[var(--leaf2)] font-bold hover:underline cursor-pointer"
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
        )}

        {/* Step 3: Payment Method Options */}
        {cart.length > 0 && (
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>Step 3: Select Payment Method</span>
            </span>

            <div className="space-y-1.5">
              {PAYMENT_METHODS.map((mode) => {
                const isSelected = selectedPayment === mode.id;
                return (
                  <motion.button
                    key={mode.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment(mode.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-xs'
                        : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mode.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{mode.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-[#EDD9B8]/70' : 'text-[var(--text3)]'}`}>
                          {mode.sub}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold">{isSelected ? '●' : '○'}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Summary & Pay Action */}
        {cart.length > 0 && (
          <>
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
                Price Breakdown
              </h4>

              <div className="flex justify-between text-xs text-[var(--text2)]">
                <span>Subtotal ({cart.length} crops)</span>
                <span className="tabular-nums">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-xs text-[var(--text2)]">
                <span>Direct Cold Delivery</span>
                <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : ''}>
                  {isFreeDelivery ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Direct Farmer Discount (5%)</span>
                <span className="tabular-nums">-₹{discount}</span>
              </div>

              <div className="pt-2 border-t border-[var(--leaf-pale)] flex justify-between items-center">
                <span className="font-bold text-xs text-[var(--text)]">Total Payable</span>
                <span className="font-serif-soil text-lg font-extrabold text-[var(--text)] tabular-nums">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCheckingOut
                  ? 'Securing Farm Harvest...'
                  : `Pay ₹${finalTotal} & Confirm Order →`}
              </span>
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};
