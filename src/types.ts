export type UserRole = 'farmer' | 'consumer' | 'vendor';

export type ScreenId =
  | 's-splash'
  | 's-login'
  | 's-home'
  | 's-farmer'
  | 's-ai'
  | 's-result'
  | 's-market'
  | 's-buy'
  | 's-sell'
  | 's-cart'
  | 's-orders'
  | 's-track'
  | 's-profile'
  | 's-vendor';

export type ProductCategory = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'herbs' | 'materials' | 'staples';

export interface ProduceItem {
  id: string;
  name: string;
  category: ProductCategory;
  emoji: string;
  farmName: string;
  location: string;
  pricePerKg: number;
  unit: string;
  availableKg: number;
  rating: number;
  reviewsCount: number;
  vendorTrustScore?: number;
  repeatBuyerRate?: number;
  totalBatchesSold?: number;
  isFreshToday?: boolean;
  isOrganic?: boolean;
  discountPercent?: number;
  deliveryHours: number;
  farmerAadhaarVerified: boolean;
  harvestTime: string;
  grade: 'Grade A' | 'Grade B' | 'Mixed';
  description: string;
}

export interface VendorReview {
  id: string;
  produceId: string;
  farmerName: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  tags?: string[];
  helpfulCount: number;
}

export interface PriceHistoryPoint {
  day: string;
  fullDate: string;
  price: number;
  mandiAverage?: number;
}

export interface MandiPriceItem {
  id: string;
  crop: string;
  emoji: string;
  category: 'vegetables' | 'grains' | 'fruits';
  unit: string;
  price: number;
  changePercent: number;
  changeType: 'up' | 'down';
  trendNote: string;
  mandi: string;
  demandStatus: 'HIGH' | 'STABLE' | 'LOW';
  history: PriceHistoryPoint[];
}

export interface TransitCheckpoint {
  id: string;
  stage: string;
  location: string;
  timestamp: string;
  handler: string;
  status: 'completed' | 'current' | 'upcoming';
  temperature?: string;
  details: string;
  blockHash: string;
}

export interface ProduceTraceabilityData {
  produceId: string;
  produceName: string;
  emoji: string;
  batchNumber: string;
  blockHash: string;
  contractAddress: string;
  farmer: {
    name: string;
    aadhaarStatus: 'Verified' | 'Pending';
    village: string;
    district: string;
    farmSizeAcres: number;
    soilType: string;
    organicCertified: boolean;
  };
  harvest: {
    date: string;
    exactTime: string;
    grade: string;
    moisturePercent: number;
    chemicalResiduePPM: number;
    certificationLab: string;
  };
  transitHistory: TransitCheckpoint[];
}

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp: string;
  status: 'done' | 'active' | 'pending';
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  dateStr: string;
  status: 'in_transit' | 'delivered' | 'processing' | 'cancelled';
  statusLabel: string;
  itemsSummary: string;
  pickupInfo: string;
  totalAmount: number;
  eta: string;
  riderName: string;
  riderPhone: string;
  steps: OrderTrackingStep[];
  blockchainTrail: {
    originVerified: boolean;
    qualityCertified: boolean;
    coldChainMaintained: boolean;
    deliveryPartnerAssigned: boolean;
    otpDelivered: boolean;
  };
}

export interface CropDiagnosis {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  detectedVisual: string;
  urgencyDays: string;
  symptoms: string[];
  treatmentSteps: string[];
  recommendedProduct: {
    name: string;
    dosage: string;
    price: number;
  };
  hindiNarration: string;
  englishNarration: string;
}

export type SupportedLanguage =
  | 'Hindi'
  | 'English'
  | 'Marathi'
  | 'Tamil'
  | 'Telugu'
  | 'Kannada'
  | 'Punjabi'
  | 'Bengali';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  native: string;
}

export interface CartItem {
  produce: ProduceItem;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  actionScreen?: ScreenId;
  actionLabel?: string;
}

export interface FarmerDispatchRider {
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  completedPickups: number;
  status: 'assigning' | 'en_route_to_farm' | 'at_farmgate' | 'in_transit_to_buyer' | 'delivered';
  isComingToFarmer: boolean;
  distanceToFarmKm: number;
  etaToFarmMinutes: number;
  currentLocationName: string;
  temperatureReading?: string;
}

export interface FarmerDispatchOrder {
  id: string;
  batchNumber: string;
  cropName: string;
  emoji: string;
  quantityKg: number;
  crateCount: number;
  totalPayout: number;
  buyerName: string;
  buyerType: 'consumer' | 'vendor' | 'apmc_mandi';
  destinationAddress: string;
  destinationCity: string;
  distanceToDestinationKm: number;
  handoverOtp: string;
  isOtpVerified: boolean;
  rider: FarmerDispatchRider;
  harvestDate: string;
  payoutStatus: 'escrow_locked' | 'transferred_to_upi' | 'pending';
  escrowReleaseTime?: string;
  upiTransactionId?: string;
}

export interface AICropSnapResult {
  cropName: string;
  variety: string;
  category: ProductCategory;
  emoji: string;
  confidence: number;
  grade: 'Grade A' | 'Grade B' | 'Mixed';
  freshnessScore: number;
  estimatedWeightKg: number;
  suggestedPricePerKg: number;
  mandiPricePerKg: number;
  defectScan: string;
  chemicalResidueEst: string;
  harvestAdvice: string;
  audioNarrationHindi: string;
  imageUrl?: string;
}

