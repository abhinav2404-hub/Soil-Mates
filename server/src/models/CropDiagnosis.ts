import mongoose, { Schema, Document } from 'mongoose';

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

export const CropDiagnosisModel =
  mongoose.models.CropDiagnosis || mongoose.model<ICropDiagnosis>('CropDiagnosis', CropDiagnosisSchema);
