import { useState, useCallback } from 'react';
import { api } from '../services/api';

export interface CropDiagnosisResult {
  id?: string;
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
  imageUrl?: string;
  createdAt?: string;
}

export function useCropDiagnosis() {
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<CropDiagnosisResult | null>(null);
  const [history, setHistory] = useState<CropDiagnosisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const diagnoseImage = async (
    imageFileOrBase64: File | string,
    cropHint?: string
  ): Promise<CropDiagnosisResult> => {
    setIsDiagnosing(true);
    setError(null);

    try {
      let res;
      if (typeof imageFileOrBase64 === 'string') {
        res = await api.diagnoseCropBase64({
          imageBase64: imageFileOrBase64,
          cropHint
        });
      } else {
        const formData = new FormData();
        formData.append('image', imageFileOrBase64);
        if (cropHint) formData.append('cropHint', cropHint);
        res = await api.diagnoseCrop(formData);
      }

      if (res.success && res.data) {
        setCurrentDiagnosis(res.data);
        return res.data;
      }
      throw new Error(res.message || 'Crop diagnosis could not be completed.');
    } catch (err: any) {
      setError(err.message || 'Error communicating with Crop Doctor service.');
      throw err;
    } finally {
      setIsDiagnosing(false);
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.getDiagnosisHistory();
      if (res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err: any) {
      console.warn('[useCropDiagnosis] History fetch note:', err.message);
    }
  }, []);

  return {
    isDiagnosing,
    currentDiagnosis,
    setCurrentDiagnosis,
    diagnoseImage,
    history,
    fetchHistory,
    error,
    clearError: () => setError(null)
  };
}
