import mongoose, { Schema, Document } from 'mongoose';

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

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
