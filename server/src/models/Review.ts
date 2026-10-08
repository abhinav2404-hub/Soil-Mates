import mongoose, { Schema, Document } from 'mongoose';

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

export const ReviewModel =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
