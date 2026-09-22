import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  ThumbsUp,
  MessageSquarePlus,
  CheckCircle2,
  Filter,
  Sparkles,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { ProduceItem, VendorReview } from '../types';

interface VendorReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  produce: ProduceItem | null;
  reviews: VendorReview[];
  onAddReview: (review: Omit<VendorReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onHelpfulClick: (reviewId: string) => void;
  onShowToast: (msg: string) => void;
}

const PRESET_REVIEW_TAGS = [
  'Super Fresh 🥬',
  'Zero Chemical Smell 🌿',
  'Authentic Taste 🍅',
  'Clean & Crisp 🥗',
  'Great Packing 📦',
  'Prompt Delivery ⚡',
  'Direct from Farmer 🤝'
];

export const VendorReviewsModal: React.FC<VendorReviewsModalProps> = ({
  isOpen,
  onClose,
  produce,
  reviews,
  onAddReview,
  onHelpfulClick,
  onShowToast
}) => {
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);

  // Form state
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formName, setFormName] = useState<string>('Priya Sharma');
  const [formLocation, setFormLocation] = useState<string>('Arera Colony, Bhopal');
  const [formComment, setFormComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Fresh 🥬']);

  if (!isOpen || !produce) return null;

  // Filter reviews for this farmer/produce
  const vendorReviews = reviews.filter(
    (r) =>
      r.produceId === produce.id ||
      r.farmerName.toLowerCase() === produce.farmName.toLowerCase()
  );

  const displayReviews = vendorReviews.filter((r) => {
    if (filterStars === 'all') return true;
    return r.rating === filterStars;
  });

  // Calculate rating stats
  const totalCount = vendorReviews.length || produce.reviewsCount;
  const avgRating =
    vendorReviews.length > 0
      ? (
          vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length
        ).toFixed(1)
      : produce.rating.toFixed(1);

  // Rating breakdown percentages
  const ratingCounts = {
    5: vendorReviews.filter((r) => r.rating === 5).length,
    4: vendorReviews.filter((r) => r.rating === 4).length,
    3: vendorReviews.filter((r) => r.rating === 3).length,
    2: vendorReviews.filter((r) => r.rating === 2).length,
    1: vendorReviews.filter((r) => r.rating === 1).length
  };

  const getPercent = (count: number) => {
    if (vendorReviews.length === 0) return 0;
    return Math.round((count / vendorReviews.length) * 100);
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) {
      onShowToast('Please write a brief comment sharing your experience.');
      return;
    }

    onAddReview({
      produceId: produce.id,
      farmerName: produce.farmName,
      reviewerName: formName.trim() || 'Verified Consumer',
      reviewerLocation: formLocation.trim() || 'Madhya Pradesh',
      rating: formRating,
      comment: formComment.trim(),
      verifiedBuyer: true,
      tags: selectedTags
    });

    onShowToast(`Thank you! Your ${formRating}-star review has been published.`);
    setFormComment('');
    setIsWritingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--cream)] rounded-3xl border border-white/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div
          className="p-4 text-[#EDD9B8] flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
              {produce.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif-soil text-sm font-extrabold text-[#EDD9B8] line-clamp-1">
                  {produce.farmName}
                </h3>
                <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[9px] px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-[#EDD9B8]/75 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>{produce.location}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5">
          {/* Trust Score & Overall Rating Card */}
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              {/* Star Rating Overview */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="font-serif-soil text-3xl font-black text-[var(--soil)] leading-none">
                    {avgRating}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
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
                  <div className="text-[10px] text-[var(--text3)] font-semibold">
                    {totalCount} Verified Reviews
                  </div>
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1 pl-2 border-l border-[var(--border)] space-y-1 text-[9px] font-bold text-[var(--text3)]">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = (ratingCounts as any)[stars];
                    const pct = getPercent(count);
                    return (
                      <div key={stars} className="flex items-center gap-1.5">
                        <span className="w-3 text-right">{stars}★</span>
                        <div className="flex-1 h-1.5 bg-[var(--cream2)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="w-6 text-right text-[8px] text-[var(--text3)]">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Farmer Trust Credentials Strip */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-center">
              <div className="bg-[var(--leaf-pale)] rounded-xl p-2 border border-[var(--leaf2)]/20">
                <div className="text-emerald-800 font-bold text-xs">
                  {produce.vendorTrustScore || 98}%
                </div>
                <div className="text-[9px] text-[var(--text3)] uppercase font-semibold">
                  Trust Index
                </div>
              </div>

              <div className="bg-[var(--cream2)] rounded-xl p-2 border border-[var(--border)]">
                <div className="text-[var(--text)] font-bold text-xs">
                  {produce.repeatBuyerRate || 88}%
                </div>
                <div className="text-[9px] text-[var(--text3)] uppercase font-semibold">
                  Repeat Buyers
                </div>
              </div>

              <div className="bg-[var(--amber-pale)] rounded-xl p-2 border border-amber-300/40">
                <div className="text-amber-900 font-bold text-xs">
                  {produce.totalBatchesSold || 290}+
                </div>
                <div className="text-[9px] text-[var(--text3)] uppercase font-semibold">
                  Batches Placed
                </div>
              </div>
            </div>
          </div>

          {/* Action to Write Review */}
          {!isWritingReview ? (
            <button
              onClick={() => setIsWritingReview(true)}
              className="w-full py-2.5 rounded-2xl bg-[var(--leaf)] text-white text-xs font-bold shadow-xs hover:bg-[var(--leaf2)] transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Rate Farmer & Write a Review</span>
            </button>
          ) : (
            /* Interactive Review Form */
            <form
              onSubmit={handleSubmitReview}
              className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--leaf2)]/30 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif-soil text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Your Verified Farmer Review</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="text-[10px] text-[var(--text3)] hover:underline"
                >
                  Cancel
                </button>
              </div>

              {/* Star Selection */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text3)] mb-1">
                  Tap to Rate (1 to 5 Stars):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || formRating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-700 ml-1">
                    {formRating === 5
                      ? '5.0 · Outstanding Farm Fresh'
                      : formRating === 4
                      ? '4.0 · Very Good Harvest'
                      : formRating === 3
                      ? '3.0 · Average Quality'
                      : '2.0 · Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Preset Feedback Tags */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text3)] mb-1">
                  Select Highlights:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_REVIEW_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          isSelected
                            ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                            : 'bg-[var(--cream2)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text3)] mb-1">
                  Your Review / Experience:
                </label>
                <textarea
                  rows={2}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Describe the freshness, taste, aroma, packing, or direct delivery..."
                  className="w-full text-xs p-2 rounded-xl bg-[var(--cream2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--leaf)] focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Name & Location Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-[var(--text3)] mb-0.5">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--leaf)]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-[var(--text3)] mb-0.5">
                    Your City / Area:
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--leaf)]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[var(--leaf)] text-white text-xs font-bold shadow-xs hover:bg-[var(--leaf2)] transition-transform active:scale-95"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Review Filter Tabs */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
              <span>Consumer Reviews ({displayReviews.length})</span>
            </div>

            <div className="flex gap-1">
              {(['all', 5, 4] as const).map((starVal) => (
                <button
                  key={starVal}
                  onClick={() => setFilterStars(starVal)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                    filterStars === starVal
                      ? 'bg-[var(--soil)] text-[#EDD9B8]'
                      : 'bg-[var(--cream2)] text-[var(--text3)] hover:bg-[var(--leaf-pale)]'
                  }`}
                >
                  {starVal === 'all' ? 'All' : `${starVal}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-2.5">
            {displayReviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--text3)] bg-[var(--white)] rounded-2xl border border-[var(--border)]">
                No reviews found for this filter. Be the first to share your experience!
              </div>
            ) : (
              displayReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)] shadow-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif-soil text-xs font-bold text-[var(--text)]">
                          {rev.reviewerName}
                        </span>
                        {rev.verifiedBuyer && (
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--text3)] flex items-center gap-1">
                        <span>{rev.reviewerLocation}</span>
                        <span>·</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {/* Star Badge */}
                    <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-lg">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span className="font-serif-soil font-extrabold text-[10px] text-amber-800">
                        {rev.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-[var(--text2)] leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {/* Review Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rev.tags.map((t, i) => (
                        <span
                          key={i}
                          className="bg-[var(--leaf-pale)] text-[var(--leaf2)] text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex justify-end pt-1 border-t border-[var(--leaf-pale)]/50">
                    <button
                      onClick={() => onHelpfulClick(rev.id)}
                      className="text-[10px] font-bold text-[var(--text3)] hover:text-emerald-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[var(--cream2)] transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[var(--cream2)] border-t border-[var(--border)] flex justify-between items-center text-xs">
          <div className="text-[10px] text-[var(--text3)]">
            🛡️ Certified farmer direct ratings protected by SoilChain
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--soil)] text-[#EDD9B8] font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
