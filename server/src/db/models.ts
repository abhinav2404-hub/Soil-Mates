import mongoose, { Schema, Document, Model } from 'mongoose';

// ==========================================
// 1. USER MODEL & INTERFACE
// ==========================================
export type UserRole = 'FARMER' | 'BUYER' | 'VENDOR' | 'ADMIN';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  phone?: string;
  location?: string;
  farmDetails?: {
    farmName: string;
    acres: number;
    crops: string[];
    soilType: string;
    aadhaarVerified: boolean;
  };
  vendorDetails?: {
    companyName: string;
    gstin?: string;
    procurementVolumeTonnes?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['FARMER', 'BUYER', 'VENDOR', 'ADMIN'], default: 'BUYER' },
    phone: { type: String },
    location: { type: String },
    farmDetails: {
      farmName: String,
      acres: Number,
      crops: [String],
      soilType: String,
      aadhaarVerified: { type: Boolean, default: false }
    },
    vendorDetails: {
      companyName: String,
      gstin: String,
      procurementVolumeTonnes: Number
    }
  },
  { timestamps: true }
);

// ==========================================
// 2. PRODUCT MODEL & INTERFACE
// ==========================================
export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  sellerId: string;
  sellerName?: string;
  farmName: string;
  images: string[];
  emoji?: string;
  location: string;
  available: boolean;
  grade?: string;
  isOrganic?: boolean;
  isFreshToday?: boolean;
  deliveryHours?: number;
  rating?: number;
  reviewsCount?: number;
  vendorTrustScore?: number;
  repeatBuyerRate?: number;
  harvestTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    quantity: { type: Number, required: true, default: 0 },
    sellerId: { type: String, required: true, index: true },
    sellerName: { type: String, default: 'Farmer' },
    farmName: { type: String, default: 'Green Acres' },
    images: { type: [String], default: [] },
    emoji: { type: String, default: '🌾' },
    location: { type: String, default: 'Madhya Pradesh' },
    available: { type: Boolean, default: true, index: true },
    grade: { type: String, default: 'Grade A' },
    isOrganic: { type: Boolean, default: false },
    isFreshToday: { type: Boolean, default: true },
    deliveryHours: { type: Number, default: 4 },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 12 },
    vendorTrustScore: { type: Number, default: 95 },
    repeatBuyerRate: { type: Number, default: 85 },
    harvestTime: { type: String, default: 'Fresh Today' }
  },
  { timestamps: true }
);

// ==========================================
// 3. ORDER MODEL & INTERFACE
// ==========================================
export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'ESCROW_LOCKED' | 'COMPLETED' | 'REFUNDED';

export interface IOrderItemDetail {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  emoji?: string;
  sellerId?: string;
  farmName?: string;
}

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  items: IOrderItemDetail[];
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    pincode: string;
  };
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  rider?: {
    name: string;
    phone: string;
    vehicle?: string;
    status: string;
  };
  eta?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'kg' },
        emoji: { type: String, default: '🌾' },
        sellerId: { type: String },
        farmName: { type: String }
      }
    ],
    total: { type: Number, required: true },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Madhya Pradesh' },
      pincode: { type: String, default: '462001' }
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'ESCROW_LOCKED', 'COMPLETED', 'REFUNDED'],
      default: 'ESCROW_LOCKED'
    },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
      index: true
    },
    rider: {
      name: { type: String, default: 'Vikas Sharma (Soil Mates Logistics)' },
      phone: { type: String, default: '+91 98260 12345' },
      vehicle: { type: String, default: 'E-Cargo MP-04-EA-9912' },
      status: { type: String, default: 'Assigned' }
    },
    eta: { type: String, default: '35 mins' }
  },
  { timestamps: true }
);

// ==========================================
// 4. CROP DIAGNOSIS MODEL & INTERFACE
// ==========================================
export interface ICropDiagnosis extends Document {
  id: string;
  userId: string;
  imageUrl?: string;
  crop: string;
  disease: string;
  scientificName?: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  possibleCauses: string[];
  treatment: string[];
  prevention: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  whenToConsultExpert: boolean;
  notes?: string;
  createdAt: Date;
}

const CropDiagnosisSchema = new Schema<ICropDiagnosis>(
  {
    userId: { type: String, required: true, index: true },
    imageUrl: { type: String },
    crop: { type: String, required: true },
    disease: { type: String, required: true },
    scientificName: { type: String },
    confidence: { type: Number, required: true, default: 0.9 },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    symptoms: { type: [String], default: [] },
    possibleCauses: { type: [String], default: [] },
    treatment: { type: [String], default: [] },
    prevention: { type: [String], default: [] },
    organicTreatment: { type: [String], default: [] },
    chemicalTreatment: { type: [String], default: [] },
    whenToConsultExpert: { type: Boolean, default: false },
    notes: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ==========================================
// 5. MARKET RATE MODEL & INTERFACE
// ==========================================
export interface IMarketRate extends Document {
  id: string;
  commodity: string;
  category: 'vegetables' | 'grains' | 'fruits' | 'pulses' | 'oilseeds';
  emoji: string;
  unit: string;
  price: number;
  previousPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
  state: string;
  arrivalTonnes: number;
  demandStatus: 'HIGH' | 'STABLE' | 'LOW';
  history: Array<{
    day: string;
    price: number;
  }>;
  lastUpdated: Date;
}

const MarketRateSchema = new Schema<IMarketRate>(
  {
    commodity: { type: String, required: true },
    category: { type: String, required: true },
    emoji: { type: String, default: '🌾' },
    unit: { type: String, default: 'quintal' },
    price: { type: Number, required: true },
    previousPrice: { type: Number, required: true },
    changePercent: { type: Number, default: 0 },
    trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
    mandi: { type: String, required: true },
    state: { type: String, default: 'Madhya Pradesh' },
    arrivalTonnes: { type: Number, default: 150 },
    demandStatus: { type: String, enum: ['HIGH', 'STABLE', 'LOW'], default: 'STABLE' },
    history: [
      {
        day: String,
        price: Number
      }
    ],
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// ==========================================
// 6. REVIEW MODEL & INTERFACE
// ==========================================
export interface IReview extends Document {
  id: string;
  productId: string;
  farmerName: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true },
    farmerName: { type: String, required: true },
    reviewerName: { type: String, required: true },
    reviewerLocation: { type: String, default: 'India' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verifiedBuyer: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ==========================================
// 7. NOTIFICATION MODEL & INTERFACE
// ==========================================
export interface INotification extends Document {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PRICE_ALERT' | 'DIAGNOSIS' | 'SYSTEM';
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['ORDER', 'PRICE_ALERT', 'DIAGNOSIS', 'SYSTEM'], default: 'SYSTEM' },
    read: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ==========================================
// 8. FARM PROFILE MODEL & INTERFACE
// ==========================================
export interface IFarmProfile extends Document {
  id: string;
  farmerId: string;
  farmName: string;
  acres: number;
  crops: string[];
  soilType: string;
  aadhaarVerified: boolean;
  village: string;
  district: string;
  state: string;
  coldStorageAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FarmProfileSchema = new Schema<IFarmProfile>(
  {
    farmerId: { type: String, required: true, unique: true, index: true },
    farmName: { type: String, required: true },
    acres: { type: Number, default: 5 },
    crops: { type: [String], default: [] },
    soilType: { type: String, default: 'Black Cotton Soil' },
    aadhaarVerified: { type: Boolean, default: true },
    village: { type: String, default: 'Sonpur' },
    district: { type: String, default: 'Vidisha' },
    state: { type: String, default: 'Madhya Pradesh' },
    coldStorageAvailable: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ==========================================
// 9. VENDOR PROFILE MODEL & INTERFACE
// ==========================================
export interface IVendorProfile extends Document {
  id: string;
  vendorId: string;
  companyName: string;
  gstin?: string;
  procurementVolumeTonnes: number;
  address: string;
  contactPerson: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorProfileSchema = new Schema<IVendorProfile>(
  {
    vendorId: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    gstin: { type: String },
    procurementVolumeTonnes: { type: Number, default: 100 },
    address: { type: String, default: 'Karond Mandi, Bhopal' },
    contactPerson: { type: String, default: 'Rajesh Agrawal' }
  },
  { timestamps: true }
);

// ==========================================
// EXPORT MODELS
// ==========================================
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const CropDiagnosis: Model<ICropDiagnosis> = mongoose.models.CropDiagnosis || mongoose.model<ICropDiagnosis>('CropDiagnosis', CropDiagnosisSchema);
export const MarketRate: Model<IMarketRate> = mongoose.models.MarketRate || mongoose.model<IMarketRate>('MarketRate', MarketRateSchema);
export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export const FarmProfile: Model<IFarmProfile> = mongoose.models.FarmProfile || mongoose.model<IFarmProfile>('FarmProfile', FarmProfileSchema);
export const VendorProfile: Model<IVendorProfile> = mongoose.models.VendorProfile || mongoose.model<IVendorProfile>('VendorProfile', VendorProfileSchema);
