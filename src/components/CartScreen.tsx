import React, { useState } from 'react';
import { CartItem, ScreenId, OrderItem } from '../types';
import { ArrowLeft, Trash2, CheckCircle2, ShieldCheck, Clock, CreditCard, Lock, MapPin, ChevronRight, X } from 'lucide-react';
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
  { id: 'today', label: 'Today, 6 – 8 PM', time: 'Fastest · harvested this morning', badge: 'Fastest' },
  { id: 'tomorrow-am', label: 'Tomorrow, 7 – 9 AM', time: 'Fresh from tonight’s harvest', badge: 'Morning' },
  { id: 'tomorrow-pm', label: 'Tomorrow, 5 – 7 PM', time: 'Evening delivery', badge: 'Evening' }
];

const ADDRESSES = [
  { id: 'home', title: 'Home', address: 'Priya Sharma · Flat 402, Green Meadows, Arera Colony, Bhopal 462016' },
  { id: 'work', title: 'Work', address: 'Priya Sharma · 3rd Floor, MP Nagar Zone-II, Bhopal 462011' }
];

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onShowToast
}) => {
  // Checkout Step: 1 (Cart & Address), 2 (Delivery Slot), 3 (Payment), 4 (Review & Pay)
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('home');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('today');
  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Leave at door');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [upiId, setUpiId] = useState<string>('priya@okhdfcbank');
  
  // Card Details state
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/29');
  const [cardCvv, setCardCvv] = useState<string>('•••');
  const [cardName, setCardName] = useState<string>('Priya Sharma');

  // Interactive Payment / OTP Modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('111111');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);

  const subtotal = cart.reduce((acc, item) => {
    return acc + item.produce.pricePerKg * item.quantity;
  }, 0);

  const discount = Math.round(subtotal * 0.05);
  const isFreeDelivery = subtotal >= 120;
  const deliveryFee = isFreeDelivery ? 0 : 0;
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleStartCheckout = () => {
    if (cart.length === 0) {
      onShowToast('Your cart is empty.');
      return;
    }
    setCheckoutStep(2);
  };

  const handleStep2Next = () => {
    setCheckoutStep(3);
  };

  const handleStep3Next = () => {
    setCheckoutStep(4);
  };

  const handleExecutePayment = () => {
    if (paymentMethod === 'card') {
      setIsOtpModalOpen(true);
      return;
    }
    processOrderCompletion();
  };

  const processOrderCompletion = () => {
    setIsOtpModalOpen(false);
    setIsProcessingPayment(true);
    onShowToast('🔒 Connecting with bank & securing escrow...');

    setTimeout(() => {
      setIsProcessingPayment(false);
      const orderNum = `SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const summary = cart
        .map((c) => `${c.quantity}kg × ${c.produce.name}`)
        .join(', ');

      const chosenSlotObj = DELIVERY_SLOTS.find((s) => s.id === selectedSlot);

      const newOrder: OrderItem = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        dateStr: 'Just now',
        status: 'in_transit',
        statusLabel: 'Payment confirmed · Packed at farm',
        itemsSummary: summary,
        pickupInfo: 'Direct cold dispatch from Sonpur Farm Hub',
        totalAmount: finalTotal,
        eta: chosenSlotObj ? chosenSlotObj.label : 'Today, 6-8 PM',
        riderName: 'Mukesh Kumar (Rider #402)',
        riderPhone: '+91 94251 09871',
        steps: [
          { title: 'Order placed & Escrow secured', description: `Payment verified via ${paymentMethod.toUpperCase()}`, timestamp: 'Just now', status: 'done' },
          { title: 'Packed at farm', description: 'Quality checked, crate sealed with QR', timestamp: 'Just now', status: 'done' },
          { title: 'Rider picked up', description: 'Insulated box · 12°C active cold chain', timestamp: 'In progress', status: 'active' },
          { title: 'Out for delivery', description: 'Arriving soon', timestamp: 'Pending', status: 'pending' },
          { title: 'Delivered', description: 'Enjoy your fresh produce!', timestamp: 'Pending', status: 'pending' }
        ],
        blockchainTrail: {
          originVerified: true,
          qualityCertified: true,
          coldChainMaintained: true,
          deliveryPartnerAssigned: true,
          otpDelivered: false
        }
      };

      setPaymentSuccessData({
        orderNumber: orderNum,
        amount: finalTotal,
        method: paymentMethod.toUpperCase() === 'UPI' ? 'UPI ****' : 'VISA **** 4242',
        deliverySlot: chosenSlotObj?.label || 'Today, 6-8 PM',
        txnRef: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`
      });

      onPlaceOrder(newOrder);
    }, 1800);
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
            onClick={() => {
              if (checkoutStep > 1) {
                setCheckoutStep(checkoutStep - 1);
              } else {
                onNavigate('s-home');
              }
            }}
            className="text-white hover:text-stone-200 p-1 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h3 className="font-serif-soil text-base font-bold text-white flex items-center gap-2">
            <span>{checkoutStep === 1 ? 'My Cart' : 'Checkout'}</span>
            <span className="text-[10px] bg-white/20 text-[#6BBF6B] font-extrabold px-2 py-0.5 rounded-full">
              Secure
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#6BBF6B] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Escrow Protected</span>
        </div>
      </div>

      {/* Checkout Step Progress Bar */}
      {cart.length > 0 && (
        <div className="bg-[var(--white)] px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review' }
          ].map((s) => {
            const isDone = checkoutStep > s.num;
            const isCurrent = checkoutStep === s.num;
            return (
              <div key={s.num} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[var(--soil)] text-[#EDD9B8] ring-2 ring-emerald-500/40'
                      : 'bg-[var(--cream2)] text-[var(--text3)] border border-[var(--border)]'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <span
                  className={`text-[10px] font-bold hidden sm:inline ${
                    isCurrent ? 'text-[var(--text)]' : 'text-[var(--text3)]'
                  }`}
                >
                  {s.label}
                </span>
                {s.num < 4 && <div className="w-4 sm:w-8 h-[1px] bg-[var(--border)] mx-0.5" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5 pb-12">
        {cart.length === 0 ? (
          <div className="bg-[var(--white)] rounded-2xl p-8 text-center border border-[var(--border)] shadow-xs my-auto">
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
        ) : checkoutStep === 1 ? (
          /* STEP 1: CART ITEMS & ADDRESS SELECTION */
          <div className="space-y-3.5">
            <div className="bg-[var(--leaf-pale)] border border-[rgba(45,106,45,0.2)] rounded-xl p-2.5 text-xs text-[var(--leaf2)] font-bold flex items-center gap-2">
              <span>🚚</span>
              <span>
                {isFreeDelivery
                  ? 'Free express cold delivery unlocked!'
                  : `Add ₹${120 - subtotal} more for FREE express delivery`}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[var(--text2)] uppercase px-0.5">
                Cart Items ({cart.length})
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
                      ₹{item.produce.pricePerKg}/{item.produce.unit} · 🌱 {item.produce.farmName}
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
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
                        <span className="text-[10px] text-[var(--text3)]">{item.produce.unit}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-serif-soil text-sm font-extrabold text-[var(--leaf)] tabular-nums">
                          ₹{item.produce.pricePerKg * item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => onRemoveItem(item.produce.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Deliver To Address Selection */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2.5">
              <div className="text-[11px] font-bold text-[var(--text2)] uppercase">
                Deliver To Address
              </div>

              <div className="space-y-2">
                {ADDRESSES.map((addr) => {
                  const isSelected = selectedAddress === addr.id && !isAddingAddress;
                  return (
                    <motion.div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr.id);
                        setIsAddingAddress(false);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] shadow-xs'
                          : 'bg-[var(--cream2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]/30'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-base mt-0.5">📍</span>
                        <div>
                          <div className="text-xs font-bold text-[var(--text)]">{addr.title}</div>
                          <div className="text-[10px] text-[var(--text3)] mt-0.5">{addr.address}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white text-[9px]' : 'border-stone-300'
                      }`}>
                        {isSelected && '✓'}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add new address */}
                <div
                  onClick={() => setIsAddingAddress(true)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    isAddingAddress
                      ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)]'
                      : 'bg-[var(--cream2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]/30'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    +
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-[var(--text)]">Add a new address</div>
                    <div className="text-[10px] text-[var(--text3)]">Enter custom delivery street & pincode</div>
                  </div>
                </div>

                {isAddingAddress && (
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter street, landmark, city, pincode..."
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-[var(--border)] rounded-xl text-xs text-[var(--text)] outline-none focus:border-emerald-600 font-semibold mt-1"
                  />
                )}
              </div>
            </div>

            {/* Price Subtotal and Proceed */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <div className="flex justify-between text-xs text-[var(--text2)]">
                <span>Subtotal ({cart.length} items)</span>
                <span className="tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Direct Farmer Discount (5%)</span>
                <span className="tabular-nums">-₹{discount}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-bold text-xs text-[var(--text)]">Total</span>
                <span className="font-serif-soil text-base font-extrabold text-[var(--text)] tabular-nums">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleStartCheckout}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Delivery Slot →</span>
            </motion.button>
          </div>
        ) : checkoutStep === 2 ? (
          /* STEP 2: DELIVERY SLOT & INSTRUCTIONS */
          <div className="space-y-3.5">
            <div className="text-[11px] font-bold text-[var(--text2)] uppercase px-0.5">
              Step 2: Choose Delivery Time Slot
            </div>

            <div className="space-y-2">
              {DELIVERY_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)] shadow-xs'
                        : 'bg-[var(--white)] border-[var(--border)] hover:bg-[var(--leaf-pale)]/30'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text)] block">
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-[var(--text3)] mt-0.5 block">
                        {slot.time}
                      </span>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-[var(--cream2)] text-[var(--text3)] border border-[var(--border)]'
                    }`}>
                      {slot.badge}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Delivery Instructions */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2.5">
              <div className="text-[11px] font-bold text-[var(--text2)] uppercase">
                Delivery Instructions
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Leave at door', icon: '🚪', label: 'Leave at door' },
                  { id: 'Call on arrival', icon: '📞', label: 'Call on arrival' }
                ].map((inst) => {
                  const isSelected = deliveryInstruction === inst.id;
                  return (
                    <motion.button
                      key={inst.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setDeliveryInstruction(inst.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)]'
                          : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]/30'
                      }`}
                    >
                      <span className="text-base">{inst.icon}</span>
                      <span>{inst.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleStep2Next}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Payment →</span>
            </motion.button>
          </div>
        ) : checkoutStep === 3 ? (
          /* STEP 3: PAYMENT METHOD (UPI / CARD / NETBANKING / COD) */
          <div className="space-y-3.5">
            {/* Test Mode Badge */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-900 dark:text-amber-200 font-bold flex items-center gap-2">
              <span>⚡</span>
              <span>TEST MODE — no real money is charged</span>
            </div>

            <div className="text-[11px] font-bold text-[var(--text2)] uppercase px-0.5">
              Step 3: Select Payment Method
            </div>

            {/* Option A: UPI */}
            <div className={`rounded-2xl border p-3.5 transition-all space-y-3 ${
              paymentMethod === 'upi' ? 'bg-[var(--white)] border-[var(--leaf2)] ring-2 ring-emerald-500/20 shadow-xs' : 'bg-[var(--white)] border-[var(--border)]'
            }`}>
              <div
                onClick={() => setPaymentMethod('upi')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">UPI</div>
                    <div className="text-[10px] text-[var(--text3)]">Google Pay, PhonePe, Paytm, BHIM</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-600 text-white text-[9px]' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'upi' && '✓'}
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="pt-2 border-t border-[var(--border)] space-y-2.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'gpay', label: 'Google Pay', color: 'bg-blue-600 text-white' },
                      { id: 'phonepe', label: 'PhonePe', color: 'bg-purple-600 text-white' },
                      { id: 'paytm', label: 'Paytm', color: 'bg-cyan-600 text-white' },
                      { id: 'bhim', label: 'BHIM', color: 'bg-emerald-700 text-white' }
                    ].map((app) => (
                      <div key={app.id} className={`${app.color} py-1.5 px-1 rounded-xl text-center text-[10px] font-bold shadow-xs flex flex-col items-center`}>
                        <span>{app.label.slice(0, 2)}</span>
                        <span className="text-[8px] opacity-90">{app.label}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="priya@okhdfcbank"
                      className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-600"
                    />
                    <div className="text-[9px] text-[var(--text3)] mt-1">
                      Test: any ID works; an ID containing "fail" simulates a failed payment.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Option B: Credit / Debit Card */}
            <div className={`rounded-2xl border p-3.5 transition-all space-y-3 ${
              paymentMethod === 'card' ? 'bg-[var(--white)] border-[var(--leaf2)] ring-2 ring-emerald-500/20 shadow-xs' : 'bg-[var(--white)] border-[var(--border)]'
            }`}>
              <div
                onClick={() => setPaymentMethod('card')}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💳</span>
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">Credit / Debit card</div>
                    <div className="text-[10px] text-[var(--text3)]">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-600 text-white text-[9px]' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'card' && '✓'}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="pt-2 border-t border-[var(--border)] space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">Card number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-mono font-semibold text-[var(--text)] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-mono font-semibold text-[var(--text)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-mono font-semibold text-[var(--text)] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">Name on card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text)] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Option C: Net Banking & COD */}
            {[
              { id: 'netbanking', icon: '🏦', label: 'Net banking', sub: 'All major Indian banks' },
              { id: 'cod', icon: '💵', label: 'Cash on delivery', sub: 'Pay when your order arrives' }
            ].map((m) => {
              const isSelected = paymentMethod === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`rounded-2xl border p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'bg-[var(--white)] border-[var(--leaf2)] ring-2 ring-emerald-500/20 shadow-xs' : 'bg-[var(--white)] border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[var(--text)]">{m.label}</div>
                      <div className="text-[10px] text-[var(--text3)]">{m.sub}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-emerald-600 bg-emerald-600 text-white text-[9px]' : 'border-stone-300'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                </div>
              );
            })}

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleStep3Next}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Review Order & Pay →</span>
            </motion.button>
          </div>
        ) : (
          /* STEP 4: REVIEW & PAY */
          <div className="space-y-3.5">
            <div className="text-[11px] font-bold text-[var(--text2)] uppercase px-0.5">
              Step 4: Review & Pay
            </div>

            {/* Items Summary Card */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2.5">
              <div className="text-[11px] font-bold text-[var(--text)] flex items-center justify-between">
                <span>Items ({cart.length})</span>
                <button onClick={() => setCheckoutStep(1)} className="text-[10px] text-emerald-700 font-bold hover:underline">Edit</button>
              </div>
              {cart.map((item) => (
                <div key={item.produce.id} className="flex justify-between text-xs text-[var(--text2)]">
                  <span>{item.quantity}kg × {item.produce.name}</span>
                  <span className="font-semibold tabular-nums">₹{item.produce.pricePerKg * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Delivery & Address Card */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-[var(--text)]">📍 Delivery Address</span>
                <button onClick={() => setCheckoutStep(1)} className="text-[10px] text-emerald-700 font-bold hover:underline">Edit</button>
              </div>
              <p className="text-[10px] text-[var(--text3)]">
                {selectedAddress === 'home' ? ADDRESSES[0].address : ADDRESSES[1].address}
              </p>
            </div>

            {/* Delivery Slot Card */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-[var(--text)]">⏰ Delivery Slot & Instruction</span>
                <button onClick={() => setCheckoutStep(2)} className="text-[10px] text-emerald-700 font-bold hover:underline">Edit</button>
              </div>
              <p className="text-[10px] text-[var(--text3)]">
                {DELIVERY_SLOTS.find(s => s.id === selectedSlot)?.label} · {deliveryInstruction}
              </p>
            </div>

            {/* Payment Method Card */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-[var(--text)]">💳 Payment Method</span>
                <button onClick={() => setCheckoutStep(3)} className="text-[10px] text-emerald-700 font-bold hover:underline">Change</button>
              </div>
              <p className="text-[10px] text-[var(--text3)] uppercase">
                {paymentMethod === 'upi' ? `UPI · ${upiId}` : paymentMethod === 'card' ? 'VISA •••• 4242 (Test Mode)' : paymentMethod}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
              <div className="flex justify-between text-xs text-[var(--text2)]">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                <span>Direct Farmer Discount (5%)</span>
                <span className="tabular-nums">-₹{discount}</span>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-bold text-xs text-[var(--text)]">To pay</span>
                <span className="font-serif-soil text-lg font-extrabold text-[var(--text)] tabular-nums">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Money is held in escrow until your order is delivered & verified with OTP.</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleExecutePayment}
              disabled={isProcessingPayment}
              className="w-full py-4 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessingPayment ? 'Processing Bank Payment...' : `Pay ₹${finalTotal}`}
              </span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Card OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-3.5 relative">
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 text-xl">
                🔒
              </div>
              <h3 className="font-serif-soil text-base font-bold text-stone-900 dark:text-white">
                Verify with your bank
              </h3>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                Enter the 6-digit OTP sent to •••••210 for ₹{finalTotal}
              </p>
            </div>

            <div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-center text-lg tracking-widest font-mono font-bold text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 outline-none"
              />
              <div className="text-[10px] text-emerald-600 font-bold text-center mt-1.5">
                ⚡ Test OTP: 111111 (or 123456)
              </div>
            </div>

            <button
              onClick={processOrderCompletion}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Verify & Pay ₹{finalTotal}
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Overlay Modal */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-md">
              ✓
            </div>

            <div>
              <h3 className="font-serif-soil text-lg font-bold text-stone-900 dark:text-white">
                Payment successful
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Farmer Ramesh is packing your fresh harvest order
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-3 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Order ID</span>
                <span className="font-bold text-stone-900 dark:text-white">{paymentSuccessData.orderNumber}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Amount paid</span>
                <span className="font-bold text-emerald-700">₹{paymentSuccessData.amount}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Method</span>
                <span className="font-bold text-stone-900 dark:text-white">{paymentSuccessData.method}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-300">
                <span>Txn ref</span>
                <span className="font-mono text-[10px] text-stone-500">{paymentSuccessData.txnRef}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-xl p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
              <span>🔒 Escrow</span>
              <span>Farmer is paid only after you confirm delivery</span>
            </div>

            <div className="space-y-2 pt-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPaymentSuccessData(null);
                  onNavigate('s-track');
                }}
                className="w-full py-3 rounded-xl bg-[#2D5A27] hover:bg-[#3E7338] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Track Order & View OTP →
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setPaymentSuccessData(null);
                  onNavigate('s-home');
                }}
                className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Continue Shopping
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
