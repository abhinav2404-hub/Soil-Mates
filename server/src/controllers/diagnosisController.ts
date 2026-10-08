import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { geminiService } from '../services/geminiService';
import { store } from '../models/store';

export async function diagnoseCrop(req: AuthRequest, res: Response) {
  try {
    let imageBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';
    const cropHint = req.body.cropHint || req.body.crop;

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body.imageBase64) {
      // Support base64 image data from camera preview
      let base64String = req.body.imageBase64;
      const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64String = matches[2];
      }
      imageBuffer = Buffer.from(base64String, 'base64');
    }

    if (!imageBuffer) {
      return res.status(400).json({
        success: false,
        message: 'No crop image provided. Please capture or upload a leaf photo.'
      });
    }

    // Validate size (max 8MB)
    if (imageBuffer.length > 8 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum limit of 8MB.'
      });
    }

    // Validate mime type
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedMime.includes(mimeType)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported image format. Please upload JPG, PNG, or WebP.'
      });
    }

    // Server-side Gemini AI diagnosis
    const diagnosis = await geminiService.diagnoseCropImage(imageBuffer, mimeType, cropHint);

    const userId = req.user?.id || 'usr-farmer-1';

    // Persist diagnosis history
    const saved = await store.saveDiagnosis({
      userId,
      crop: diagnosis.crop,
      disease: diagnosis.disease,
      scientificName: diagnosis.scientificName,
      confidence: diagnosis.confidence,
      severity: diagnosis.severity,
      symptoms: diagnosis.symptoms,
      possibleCauses: diagnosis.possibleCauses,
      treatment: diagnosis.treatment,
      prevention: diagnosis.prevention,
      organicTreatment: diagnosis.organicTreatment,
      chemicalTreatment: diagnosis.chemicalTreatment,
      whenToConsultExpert: diagnosis.whenToConsultExpert,
      notes: diagnosis.notes,
      imageUrl: req.body.imageUrl || undefined
    });

    res.json({
      success: true,
      data: saved
    });
  } catch (error: any) {
    console.error('[DiagnosisError]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Crop image could not be analyzed.'
    });
  }
}

export async function getDiagnosisHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const history = await store.listDiagnoses(userId);

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch diagnosis history.'
    });
  }
}
