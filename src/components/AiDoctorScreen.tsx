import React, { useState, useRef, useEffect } from 'react';
import { CropDiagnosis, ScreenId } from '../types';
import { SAMPLE_DIAGNOSES } from '../data/agriData';
import { Camera, Upload, Mic, Clock, Sparkles } from 'lucide-react';

interface AiDoctorScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSetDiagnosis: (diag: CropDiagnosis) => void;
  onStartVoice: (context: string) => void;
  onShowToast: (msg: string) => void;
}

export const AiDoctorScreen: React.FC<AiDoctorScreenProps> = ({
  onNavigate,
  onSetDiagnosis,
  onStartVoice,
  onShowToast
}) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [photoReady, setPhotoReady] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startLiveCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setPhotoReady(false);
        onShowToast('Camera started. Point at crop leaf.');
      } else {
        onShowToast('Camera is unavailable on this device. You can upload a photo or choose a sample.');
      }
    } catch (err) {
      console.warn('Live camera access error:', err);
      onShowToast('Camera access failed. Check permission or upload a photo instead.');
    }
  };

  const captureCameraFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewImage(dataUrl);
      }
    }
    // Stop live tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setPhotoReady(true);
    onShowToast('Leaf snapshot captured.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        setPhotoReady(true);
        setIsCameraActive(false);
        onShowToast('Photo uploaded successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSimulatedPhoto = (selectedDiag: CropDiagnosis) => {
    setPreviewImage(null);
    setPhotoReady(true);
    setIsCameraActive(false);
    runAnalysis(selectedDiag);
  };

  const runAnalysis = (diagToUse?: CropDiagnosis) => {
    if (!diagToUse) {
      onShowToast('Live AI diagnosis is not connected yet. Choose a sample diagnosis to preview the result.');
      return;
    }

    const diag = diagToUse;
    setIsAnalyzing(true);
    onShowToast('AI analyzing leaf tissue & symptoms...');

    setTimeout(() => {
      setIsAnalyzing(false);
      onSetDiagnosis(diag);
      onNavigate('s-result');
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Header */}
      <div
        className="px-4 pt-3.5 pb-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-soil text-xl font-extrabold text-[#EDD9B8]">
              🔬 AI Crop Doctor
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 mt-0.5 font-medium">
              Demo mode · live diagnosis service not connected
            </p>
          </div>
          <span className="text-xl">🌿</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
        {/* Banner */}
        <div
          className="rounded-2xl p-4 text-center text-white shadow-sm"
          style={{ backgroundColor: 'var(--leaf)' }}
        >
          <div className="text-4xl mb-1.5 select-none">🌿</div>
          <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8]">
            Diagnose Your Crop
          </h3>
          <p className="text-[11px] text-[#EDD9B8]/80 mt-1 max-w-xs mx-auto leading-relaxed">
            Use a sample diagnosis to preview the flow. Connect a trusted AI service before using real crop photos for advice.
          </p>
        </div>

        {/* Upload / Camera Interactive Box */}
        <div
          className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all bg-[var(--cream2)] relative overflow-hidden ${
            photoReady ? 'border-[var(--leaf2)] bg-emerald-50/50' : 'border-[var(--soil)]/25'
          }`}
        >
          {/* Live Video Preview if active */}
          {isCameraActive ? (
            <div className="relative rounded-xl overflow-hidden mb-3 bg-black max-h-48 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-44 object-cover"
              />
              <button
                onClick={captureCameraFrame}
                className="absolute bottom-2.5 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg"
              >
                📸 Click Snapshot
              </button>
            </div>
          ) : previewImage ? (
            <div className="mb-3 max-h-40 rounded-xl overflow-hidden mx-auto max-w-[200px] border border-[var(--leaf2)] shadow-md">
              <img
                src={previewImage}
                alt="Captured crop leaf"
                className="w-full h-36 object-cover"
              />
            </div>
          ) : (
            <div className="py-2">
              <div className="text-4xl mb-1 select-none">📸</div>
              <h4 className="text-xs font-bold text-[var(--text2)]">
                {photoReady ? 'Crop Leaf Ready for Diagnosis' : 'Take or upload a clear crop photo'}
              </h4>
              <p className="text-[10px] text-[var(--text3)] mt-0.5 max-w-xs mx-auto">
                Center one leaf under daylight. Tomato · Wheat · Potato · Cotton & 50+ crops
              </p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Quick Trigger Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-2.5">
            <button
              onClick={startLiveCamera}
              className="px-3 py-1.5 rounded-full bg-[var(--white)] text-[var(--soil2)] border border-[var(--border)] text-[11px] font-bold shadow-sm hover:bg-[var(--leaf-pale)] flex items-center gap-1 active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full bg-[var(--white)] text-[var(--soil2)] border border-[var(--border)] text-[11px] font-bold shadow-sm hover:bg-[var(--leaf-pale)] flex items-center gap-1 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-amber-600" />
              <span>Upload File</span>
            </button>

            <button
              onClick={() => triggerSimulatedPhoto(SAMPLE_DIAGNOSES[0])}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-full bg-[var(--leaf)] text-[#EDD9B8] text-[11px] font-bold shadow-sm hover:bg-emerald-800 flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Tomato Sample'}</span>
            </button>
          </div>

          {photoReady && (
            <button
              onClick={() => runAnalysis()}
              disabled={isAnalyzing}
              className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
              style={{ backgroundColor: 'var(--soil)', color: '#EDD9B8' }}
            >
              {isAnalyzing ? '⏳ Running AI Diagnostic Engine...' : '🔬 Analyze Detected Photo Now →'}
            </button>
          )}
        </div>

        {/* Quick Diagnostic Presets */}
        <div>
          <div className="text-[11px] font-bold text-[var(--text2)] mb-1.5 px-0.5">
            Quick Diagnostic Test Presets:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_DIAGNOSES.map((diag) => (
              <button
                key={diag.id}
                onClick={() => triggerSimulatedPhoto(diag)}
                className="bg-[var(--white)] border border-[var(--border)] rounded-xl p-2 text-center hover:border-[var(--leaf2)] transition-all active:scale-95 shadow-sm"
              >
                <div className="text-2xl mb-0.5">{diag.detectedVisual}</div>
                <div className="text-[10px] font-bold text-[var(--text)] truncate">{diag.cropName}</div>
                <div className="text-[8px] text-[var(--coral)] font-bold">{diag.severity.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Query & Past History Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => onStartVoice('crop')}
            className="bg-[var(--cream2)] border border-[var(--border)] rounded-2xl p-3 text-center cursor-pointer hover:bg-[var(--amber-pale)] transition-colors shadow-sm"
          >
            <div className="text-2xl mb-1 select-none">🎙️</div>
            <div className="text-xs font-bold text-[var(--text2)] flex items-center justify-center gap-1">
              <Mic className="w-3 h-3 text-amber-700" />
              <span>Voice Query</span>
            </div>
            <div className="text-[9px] text-[var(--text3)] mt-0.5">
              Speak symptoms in Hindi/local language
            </div>
          </div>

          <div
            onClick={() => {
              onSetDiagnosis(SAMPLE_DIAGNOSES[0]);
              onNavigate('s-result');
            }}
            className="bg-[var(--cream2)] border border-[var(--border)] rounded-2xl p-3 text-center cursor-pointer hover:bg-[var(--leaf-pale)] transition-colors shadow-sm"
          >
            <div className="text-2xl mb-1 select-none">📁</div>
            <div className="text-xs font-bold text-[var(--text2)] flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-emerald-700" />
              <span>Sample Reports (demo)</span>
            </div>
            <div className="text-[9px] text-[var(--text3)] mt-0.5">
              View past diagnosis history & logs
            </div>
          </div>
        </div>

        {/* Sample Diagnosis History (demo) List */}
        <div className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)]">
          <div className="font-serif-soil text-xs font-bold text-[var(--text)] mb-2">
            🌾 Recent Diagnoses
          </div>

          <div className="divide-y divide-[var(--leaf-pale)]">
            <div
              onClick={() => {
                onSetDiagnosis(SAMPLE_DIAGNOSES[0]);
                onNavigate('s-result');
              }}
              className="py-2 flex items-center justify-between cursor-pointer hover:bg-[var(--leaf-pale)]/30 rounded-lg px-1 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--coral-pale)] flex items-center justify-center text-lg flex-shrink-0">
                  🍅
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Tomato Early Blight</div>
                  <div className="text-[10px] text-[var(--text3)]">3 days ago · Treated ✓</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[var(--coral)]">94%</span>
                <span className="block text-[8px] text-[var(--text3)]">confidence</span>
              </div>
            </div>

            <div
              onClick={() => {
                onSetDiagnosis(SAMPLE_DIAGNOSES[1]);
                onNavigate('s-result');
              }}
              className="py-2 flex items-center justify-between cursor-pointer hover:bg-[var(--leaf-pale)]/30 rounded-lg px-1 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--amber-pale)] flex items-center justify-center text-lg flex-shrink-0">
                  🌾
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Wheat Rust (Minor)</div>
                  <div className="text-[10px] text-[var(--text3)]">1 week ago · Monitoring</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[var(--amber)]">88%</span>
                <span className="block text-[8px] text-[var(--text3)]">confidence</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
};
