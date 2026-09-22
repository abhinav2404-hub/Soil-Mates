import React, { useState } from 'react';
import { ProduceItem, ScreenId, VendorReview } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Star,
  Camera,
  MessageSquarePlus,
  ThumbsUp,
  CheckCircle2,
  Award,
  ChevronRight
} from 'lucide-react';

interface ProductDetailScreenProps {
  product: ProduceItem;
  onNavigate: (screen: ScreenId) => void;
  onAddToCart: (product: ProduceItem, quantity: number) => void;
  onOpenFarmerChat: (farmName: string) => void;
  onOpenOriginModal?: (produceId: string) => void;
  onOpenQRScanner?: () => void;
  onOpenVendorReviews?: (product: ProduceItem) => void;
  reviews: VendorReview[];
  onAddReview: (review: Omit<VendorReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onHelpfulClick: (reviewId: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onNavigate,
  onAddToCart,
  onOpenFarmerChat,
  onOpenOriginModal,
  onOpenQRScanner,
  onOpenVendorReviews,
  reviews,
  onAddReview,
  onHelpfulClick,
  onShowToast
}) => {
  const [quantity, setQuantity] = useState<number>(2);

  const handleIncrement = () => {
    if (quantity < product.availableKg) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const totalPrice = product.pricePerKg * quantity;

  // Filter reviews for this specific product or farmer
  const productReviews = reviews.filter(
    (r) =>
      r.produceId === product.id ||
      r.farmerName.toLowerCase() === product.farmName.toLowerCase()
  );

  const reviewsCount = productReviews.length || product.reviewsCount;
  const avgRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        ).toFixed(1)
      : product.rating.toFixed(1);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Back Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('s-home')}
            className="text-[#EDD9B8] hover:text-white p-1 transition-transform active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8]">
            Product Details
          </h3>
        </div>

        {/* Quick Camera QR Scan Button */}
        {onOpenQRScanner && (
          <button
            onClick={onOpenQRScanner}
            className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1.5 transition-colors"
            title="Scan Physical Crate Tag with Camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Tag</span>
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Visual Hero */}
        <div className="bg-[var(--leaf-pale)] h-44 flex items-center justify-center text-8xl relative border-b border-[var(--border)]">
          <span>{product.emoji}</span>
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {product.isOrganic && (
              <span className="bg-[var(--amber-pale)] text-[var(--amber)] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[var(--amber)]/30 shadow-xs">
                ORGANIC
              </span>
            )}
            <span className="bg-[var(--leaf-pale)] text-[var(--leaf2)] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[var(--leaf2)]/30 shadow-xs">
              {product.grade}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 space-y-3.5">
          {/* Title & Badge */}
          <div className="flex items-center justify-between">
            <h2 className="font-serif-soil text-xl font-extrabold text-[var(--text)]">
              {product.name}
            </h2>
            {product.isFreshToday && (
              <span className="bg-[var(--leaf-pale)] text-[var(--leaf2)] text-[10px] font-bold px-2 py-0.5 rounded-md">
                ✓ Fresh Today
              </span>
            )}
          </div>

          {/* Farm Location & Rating Trigger */}
          <div
            onClick={() => onOpenVendorReviews?.(product)}
            className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)] cursor-pointer hover:border-[var(--leaf)] transition-colors shadow-xs group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--leaf2)] flex items-center gap-1.5">
                  <span>🌱 {product.farmName}</span>
                  {product.farmerAadhaarVerified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Aadhaar Verified
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text3)] mt-0.5">
                  📍 {product.location}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[var(--text3)] group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Star Rating & Trust Row */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--leaf-pale)]/50">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-500 text-xs">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= Math.round(Number(avgRating))
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-[var(--text)]">
                  {avgRating}
                </span>
                <span className="text-[10px] text-[var(--text3)]">
                  ({reviewsCount} reviews)
                </span>
              </div>

              <div className="ml-auto text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                {product.vendorTrustScore || 98}% Trust Index
              </div>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="bg-[var(--cream2)] rounded-2xl p-3 border border-[var(--border)] grid grid-cols-3 gap-2 text-center shadow-xs">
            <div>
              <div className="text-[10px] text-[var(--text3)] uppercase">Price / {product.unit}</div>
              <div className="font-serif-soil text-lg font-extrabold text-[var(--leaf)] mt-0.5">
                ₹{product.pricePerKg}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--text3)] uppercase">Available</div>
              <div className="font-serif-soil text-lg font-extrabold text-[var(--text)] mt-0.5">
                {product.availableKg} {product.unit}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--text3)] uppercase">Delivery ETA</div>
              <div className="font-serif-soil text-base font-extrabold text-[var(--amber)] mt-0.5 flex items-center justify-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>{product.deliveryHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-[var(--text2)] leading-relaxed bg-[var(--white)] rounded-xl p-3 border border-[var(--border)]">
            {product.description}
          </div>

          {/* Blockchain Traceability Card with Physical QR Tag Scanner */}
          <div className="bg-[var(--leaf-pale)] rounded-2xl p-3.5 border border-[rgba(45,106,45,0.2)] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--leaf2)]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>📋 Blockchain Produce Traceability</span>
              </div>
              <span className="text-[9px] font-mono bg-white/60 px-1.5 py-0.5 rounded text-emerald-900 font-bold">
                SoilChain V2
              </span>
            </div>

            <div className="text-[11px] text-[var(--text2)] space-y-1 leading-relaxed">
              <div>🧑‍🌾 <strong>Farmer:</strong> {product.farmName} · Aadhaar Verified ✓</div>
              <div>📍 <strong>Origin:</strong> {product.location}</div>
              <div>📅 <strong>Harvested:</strong> {product.harvestTime} · {product.grade}</div>
              <div>🔬 <strong>Chemical Residue:</strong> 0.00 PPM (Lab Tested Zero Pesticide)</div>
              <div>❄️ <strong>Cold Chain:</strong> Monitored &lt; 14°C reefer transit</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onOpenOriginModal?.(product.id)}
                className="py-2 px-2.5 rounded-xl bg-white border border-[var(--leaf2)]/40 text-[var(--leaf2)] text-[11px] font-bold shadow-xs hover:bg-[var(--leaf2)] hover:text-white transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>View Blockchain Trail →</span>
              </button>

              {onOpenQRScanner && (
                <button
                  onClick={onOpenQRScanner}
                  className="py-2 px-2.5 rounded-xl bg-[var(--soil)] text-[#EDD9B8] text-[11px] font-bold shadow-xs hover:bg-[var(--soil2)] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan Crate Tag</span>
                </button>
              )}
            </div>
          </div>

          {/* VENDOR REVIEWS & RATINGS PREVIEW SECTION */}
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-soil text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Farmer Rating & Reviews ({reviewsCount})</span>
                </h4>
                <p className="text-[10px] text-[var(--text3)]">
                  100% verified consumer feedback after delivery
                </p>
              </div>

              <button
                onClick={() => onOpenVendorReviews?.(product)}
                className="text-[10px] font-bold text-[var(--leaf2)] hover:underline flex items-center gap-0.5"
              >
                <span>See All ({reviewsCount}) →</span>
              </button>
            </div>

            {/* Farmer Reviews Highlight */}
            <div className="space-y-2">
              {productReviews.slice(0, 2).map((rev) => (
                <div
                  key={rev.id}
                  className="p-2.5 rounded-xl bg-[var(--cream2)] border border-[var(--border)] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif-soil text-xs font-bold text-[var(--text)]">
                        {rev.reviewerName}
                      </span>
                      {rev.verifiedBuyer && (
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded flex items-center gap-0.5">
                          <CheckCircle2 className="w-2 h-2" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500 text-[10px]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-2.5 h-2.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text2)] leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-[var(--text3)] pt-1">
                    <span>{rev.reviewerLocation} · {rev.date}</span>
                    <button
                      onClick={() => onHelpfulClick(rev.id)}
                      className="hover:text-emerald-700 flex items-center gap-1 font-bold"
                    >
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>{rev.helpfulCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Write a review button */}
            <button
              onClick={() => onOpenVendorReviews?.(product)}
              className="w-full py-2 rounded-xl bg-[var(--leaf-pale)] text-[var(--leaf2)] border border-[var(--leaf2)]/30 text-xs font-bold hover:bg-[var(--leaf2)] hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Rate this Farmer & Add Review</span>
            </button>
          </div>

          {/* Quantity Selector */}
          <div className="bg-[var(--white)] rounded-xl p-3 border border-[var(--border)]">
            <div className="text-xs font-bold text-[var(--text)] mb-2">
              Select Quantity:
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[var(--soil)] font-extrabold text-sm flex items-center justify-center hover:bg-[var(--border)] transition-colors disabled:opacity-40"
                >
                  −
                </button>
                <span className="font-serif-soil text-lg font-extrabold text-[var(--text)] min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.availableKg}
                  className="w-8 h-8 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[var(--soil)] font-extrabold text-sm flex items-center justify-center hover:bg-[var(--border)] transition-colors disabled:opacity-40"
                >
                  +
                </button>
                <span className="text-xs text-[var(--text3)] font-semibold">
                  {product.unit}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[var(--text3)] block">Subtotal</span>
                <span className="font-serif-soil text-xl font-extrabold text-[var(--leaf)]">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onNavigate('s-cart');
              }}
              className="w-full py-3.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--leaf)', color: '#EDD9B8' }}
            >
              <span>🛒 Add {quantity} {product.unit} to Cart (₹{totalPrice})</span>
            </button>

            <button
              onClick={() => onOpenFarmerChat(product.farmName)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[var(--leaf2)] border border-[var(--leaf2)]/40 bg-transparent hover:bg-[var(--leaf-pale)] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>💬 Direct Chat with Farmer ({product.farmName.split(' ')[0]})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
