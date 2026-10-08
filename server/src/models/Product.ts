import mongoose, { Schema, Document } from 'mongoose';

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

ProductSchema.index({ name: 'text', description: 'text', location: 'text' });

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
