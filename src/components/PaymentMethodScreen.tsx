import React, { useState } from 'react';
import { ScreenId, OrderItem, CartItem } from '../types';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, AlertCircle, Smartphone, CreditCard, Building } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentMethodScreenProps {
  amount?: number;
  cart: CartItem[];
  onNavigate: (screen: ScreenId) => void;
  onPlaceOrder: (order: OrderItem) => void;
  onShowToast: (msg: string) => void;
}

export const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({
  amount = 308,
  cart,
  onNavigate,
  onPlaceOrder,
  onShowToast
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState<string>('priya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/29');
  const [cardCvv, setCardCvv] = useState<string>('424');
  const [cardName, setCardName] = useState<string>('Priya Sharma');
  
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const totalPayable = amount > 0 ? amount : cart.reduce((acc, item) => acc + item.produce.pricePerKg * item.quantity, 308);

  const handlePay = () => {
    // If UPI contains 'fail', simulate payment failure state as requested
    if (selectedMethod === 'upi' && upiId.toLowerCase().includes('fail')) {
      setPaymentState('processing');
      setTimeout(() => {
        setPaymentState('failed');
        setErrorMessage('Your bank declined the UPI request. Any amount debited will be refunded within 3-5 working days.');
      }, 1500);
      return;
    }

    setPaymentState('processing');
    onShowToast('🔒 Securing escrow and connecting with UPI/Bank...');

    setTimeout(() => {
      setPaymentState('success');
      const orderNum = `SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const summary = cart.length > 0 
        ? cart.map(c => `${c.quantity}kg × ${c.produce.name}`).join(', ') 
        : 'Fresh Organic Produce (1 Bundle)';

      const newOrder: OrderItem = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        dateStr: 'Just now',
        status: 'in_transit',
        statusLabel: 'Payment confirmed via Smart Escrow',
        itemsSummary: summary,
        pickupInfo: 'Direct cold dispatch from Sonpur Farm Hub',
        totalAmount: totalPayable,
        eta: 'Today, 6 - 8 PM',
        riderName: 'Mukesh Kumar (Rider #402)',
        riderPhone: '+91 94251 09871',
        steps: [
          { title: 'Payment verified & Escrow locked', description: `Paid ₹${totalPayable} via ${selectedMethod.toUpperCase()}`, timestamp: 'Just now', status: 'done' },
          { title: 'Packed at farm', description: 'Quality checked, crate sealed', timestamp: 'Just now', status: 'done' },
          { title: 'Rider picked up', description: 'Insulated transport · 12°C', timestamp: 'In progress', status: 'active' },
          { title: 'Out for delivery', description: 'Arriving soon', timestamp: 'Pending', status: 'pending' },
          { title: 'Delivered', description: 'OTP signature handover', timestamp: 'Pending', status: 'pending' }
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
      onShowToast(`🎉 Order ${orderNum} confirmed successfully!`);
    }, 1800);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0 text-white"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('s-cart')}
            className="text-white hover:text-stone-200 p-1 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h3 className="font-serif-soil text-base font-bold text-white">
            Secure Payment Gateway
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#6BBF6B] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit SSL</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-12">
        {paymentState === 'processing' ? (
          <div className="bg-[var(--white)] rounded-2xl p-8 text-center border border-[var(--border)] shadow-xs my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto animate-spin text-2xl">
              ⏳
            </div>
            <h4 className="font-serif-soil text-lg font-bold text-[var(--text)]">
              Processing payment...
            </h4>
            <p className="text-xs text-[var(--text3)]">
              ₹{totalPayable} · {selectedMethod.toUpperCase()} · Secure Escrow Gateway
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold space-y-1">
              <div>✓ Contacting your bank</div>
              <div>✓ Verifying UPI / Card token</div>
              <div>⏳ Confirming funds with farmer escrow</div>
            </div>
          </div>
        ) : paymentState === 'success' ? (
          <div className="bg-[var(--white)] rounded-2xl p-8 text-center border border-[var(--border)] shadow-xs my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-md">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="font-serif-soil text-xl font-bold text-[var(--text)]">
              Payment Successful!
            </h4>
            <p className="text-xs text-[var(--text3)]">
              Farmer is packing your fresh organic harvest. Money remains in escrow until delivery.
            </p>
            <div className="flex gap-2 pt-2">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onNavigate('s-track')}
                className="flex-1 py-3 rounded-xl bg-[#2D5A27] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Track Order & OTP →
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onNavigate('s-home')}
                className="py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--text2)] text-xs font-bold hover:bg-[var(--cream2)] cursor-pointer"
              >
                Home
              </motion.button>
            </div>
          </div>
        ) : paymentState === 'failed' ? (
          <div className="bg-[var(--white)] rounded-2xl p-8 text-center border border-[var(--border)] shadow-xs my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-3xl shadow-md">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h4 className="font-serif-soil text-lg font-bold text-[var(--text)]">
              Payment Failed
            </h4>
            <p className="text-xs text-rose-700 font-medium">
              {errorMessage}
            </p>
            <div className="space-y-2 pt-2">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setPaymentState('idle');
                  setSelectedMethod('upi');
                  setUpiId('priya@okhdfcbank');
                }}
                className="w-full py-3 rounded-xl bg-[#2D5A27] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Try Another Payment Method
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onNavigate('s-cart')}
                className="w-full py-2.5 rounded-xl border border-[var(--border)] text-[var(--text2)] text-xs font-bold hover:bg-[var(--cream2)] cursor-pointer"
              >
                Back to Cart
              </motion.button>
            </div>
          </div>
        ) : (
          /* IDLE PAYMENT FORM */
          <div className="space-y-4">
            {/* Amount Summary Banner */}
            <div className="bg-[var(--white)] rounded-2xl p-4 border border-[var(--border)] shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[var(--text3)] uppercase font-bold">Total Amount Payable</div>
                <div className="font-serif-soil text-2xl font-extrabold text-[var(--text)] tabular-nums">
                  ₹{totalPayable}
                </div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[var(--leaf-pale)] text-[var(--leaf2)] text-xs font-bold">
                🔒 Escrow Protected
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[var(--cream2)] rounded-2xl border border-[var(--border)]">
              {[
                { id: 'upi', label: 'UPI / GPay', icon: '📱' },
                { id: 'card', label: 'Cards', icon: '💳' },
                { id: 'netbanking', label: 'NetBank', icon: '🏦' },
                { id: 'cod', label: 'Cash COD', icon: '💵' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as any)}
                  className={`py-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center ${
                    selectedMethod === m.id
                      ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                      : 'text-[var(--text2)] hover:bg-white/60'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="text-[10px] mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Method Details Form */}
            <div className="bg-[var(--white)] rounded-2xl p-4 border border-[var(--border)] shadow-xs space-y-3.5">
              {selectedMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Instant UPI Transfer (Google Pay, PhonePe, Paytm, BHIM)</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">
                      Your UPI ID (VPA)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="priya@okhdfcbank"
                      className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text)] outline-none focus:border-emerald-600"
                    />
                    <div className="text-[10px] text-[var(--text3)] mt-1">
                      Tip: Enter an UPI ID with <strong className="text-rose-600">"fail"</strong> (e.g. testfail@upi) to test failure simulation.
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Credit or Debit Card (Visa, Mastercard, RuPay)</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-mono font-semibold text-[var(--text)] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-mono font-semibold text-[var(--text)] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-mono font-semibold text-[var(--text)] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text2)] mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text)] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Select Bank for Net Banking</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'].map((bank) => (
                      <div key={bank} className="p-2.5 rounded-xl bg-[var(--cream2)] border border-[var(--border)] text-xs font-bold text-[var(--text)] text-center cursor-pointer hover:border-emerald-600 transition-colors">
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMethod === 'cod' && (
                <div className="space-y-2 py-3 text-center">
                  <div className="text-2xl mb-1">💵</div>
                  <div className="text-xs font-bold text-[var(--text)]">Cash on Farmgate Delivery</div>
                  <p className="text-[11px] text-[var(--text3)]">
                    Pay cash directly to the delivery rider upon inspecting your fresh harvest at your doorstep.
                  </p>
                </div>
              )}
            </div>

            {/* Pay Action Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handlePay}
              className="w-full py-4 rounded-xl text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#3E7338] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Pay ₹{totalPayable} Securely →</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};
