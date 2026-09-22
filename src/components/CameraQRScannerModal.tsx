import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  X,
  Flashlight,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { PRODUCE_TRACEABILITY_DATABASE } from '../data/agriData';
import { ProduceItem } from '../types';

interface CameraQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (produceId: string) => void;
  onShowToast: (msg: string) => void;
  products: ProduceItem[];
}

export const CameraQRScannerModal: React.FC<CameraQRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  onShowToast,
  products
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isProcessingScan, setIsProcessingScan] = useState<boolean>(false);

  // Play audio beep on successful QR scan
  const playScanBeep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.16);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }

    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  // Match raw string to produce ID
  const resolveProduceIdFromQR = (rawText: string): string => {
    const text = rawText.trim().toLowerCase();

    // Check direct produce IDs
    const matchedById = products.find((p) => p.id.toLowerCase() === text);
    if (matchedById) return matchedById.id;

    // Check batch numbers in traceability database
    for (const [pId, trace] of Object.entries(PRODUCE_TRACEABILITY_DATABASE)) {
      if (
        text.includes(trace.batchNumber.toLowerCase()) ||
        text.includes(pId.toLowerCase()) ||
        trace.batchNumber.toLowerCase().includes(text)
      ) {
        return pId;
      }
    }

    // Check crop names
    if (text.includes('tomato')) return 'prod-1';
    if (text.includes('palak') || text.includes('spinach')) return 'prod-2';
    if (text.includes('potato') || text.includes('aloo')) return 'prod-3';
    if (text.includes('onion') || text.includes('pyaaz')) return 'prod-4';
    if (text.includes('wheat') || text.includes('gehun')) return 'prod-6';

    // Fallback to prod-1
    return 'prod-1';
  };

  const handleValidTagDetected = (decodedText: string) => {
    if (isProcessingScan) return;
    setIsProcessingScan(true);
    setScannedResult(decodedText);
    playScanBeep();

    const targetProduceId = resolveProduceIdFromQR(decodedText);
    const targetProduct = products.find((p) => p.id === targetProduceId) || products[0];

    setTimeout(() => {
      stopCamera();
      onScanSuccess(targetProduceId);
      onShowToast(`Scanned tag for ${targetProduct.name} (${targetProduct.farmName})`);
      onClose();
      setIsProcessingScan(false);
      setScannedResult(null);
    }, 900);
  };

  // Start device camera
  const startCamera = async () => {
    setErrorMessage(null);
    setHasCameraPermission(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Camera access is not supported in this browser environment.');
      setHasCameraPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        await videoRef.current.play();
        setHasCameraPermission(true);
        startScanningLoop();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasCameraPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser settings, or use the sample tags below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device detected on this device. You can test by scanning the physical sample tags below.');
      } else {
        setErrorMessage('Unable to activate camera stream. You can scan using one of the sample crate tags below.');
      }
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Toggle flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        const capabilities: any = track.getCapabilities?.() || {};
        if (capabilities.torch) {
          const nextState = !torchOn;
          await track.applyConstraints({
            advanced: [{ torch: nextState } as any]
          });
          setTorchOn(nextState);
          onShowToast(nextState ? 'Flashlight ON' : 'Flashlight OFF');
        } else {
          onShowToast('Flashlight not supported on this camera');
        }
      } catch {
        onShowToast('Flashlight control unavailable');
      }
    }
  };

  // Continuous frame scanning loop
  const startScanningLoop = () => {
    const scanFrame = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });

            if (qrCode && qrCode.data) {
              handleValidTagDetected(qrCode.data);
              return; // Stop animation frame on success
            }
          } catch {
            // Frame processing error; continue loop
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[var(--soil)] text-[#EDD9B8] rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-soil text-sm font-bold text-[#EDD9B8]">
                Scan Physical Produce Tag
              </h3>
              <p className="text-[10px] text-[#EDD9B8]/70">
                Point camera at crate QR code or label
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center flex-shrink-0">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              hasCameraPermission ? 'block' : 'hidden'
            }`}
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Permission Pending or Denied Fallback Screen */}
          {!hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/90 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <QrCode className="w-7 h-7 animate-pulse" />
              </div>

              <div className="space-y-1">
                <p className="font-serif-soil text-sm font-bold text-white">
                  {errorMessage ? 'Camera Scanner Standby' : 'Connecting to Camera...'}
                </p>
                <p className="text-[11px] text-[#EDD9B8]/70 leading-tight">
                  {errorMessage || 'Requesting device camera permissions to scan crate tags...'}
                </p>
              </div>

              {errorMessage && (
                <button
                  onClick={startCamera}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera</span>
                </button>
              )}
            </div>
          )}

          {/* Scanner Overlay HUD */}
          {hasCameraPermission && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              {/* Corner Reticle Box */}
              <div
                className={`relative w-48 h-48 rounded-2xl transition-all duration-300 border-2 ${
                  scannedResult
                    ? 'border-emerald-400 bg-emerald-500/20 scale-105'
                    : 'border-emerald-400/80 bg-transparent'
                }`}
              >
                {/* 4 Corner Markers */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>

                {/* Laser scan line animation */}
                {!scannedResult && (
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-bounce"></div>
                )}

                {/* Scan Success Indicator */}
                {scannedResult && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-300 animate-in zoom-in-75 duration-200" />
                    <span className="text-[11px] font-extrabold text-white mt-1">
                      Tag Recognized!
                    </span>
                  </div>
                )}
              </div>

              {/* Status Pill */}
              <div className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 text-[10px] text-emerald-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Align SoilChain Tag in frame</span>
              </div>
            </div>
          )}

          {/* Flashlight button */}
          {hasCameraPermission && (
            <button
              onClick={toggleTorch}
              className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                torchOn
                  ? 'bg-amber-400 text-black border-amber-300'
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/80'
              }`}
              title="Toggle Flashlight"
            >
              <Flashlight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Physical Tag Selector (Works with or without physical camera) */}
        <div className="p-3.5 space-y-2.5 bg-[var(--soil2)] flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-[#EDD9B8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Or Tap a Physical Crate Tag to Test:</span>
            </div>
            <span className="text-[9px] text-[#EDD9B8]/60">5 Live Batches</span>
          </div>

          <div className="space-y-1.5">
            {products.slice(0, 4).map((p) => {
              const trace = PRODUCE_TRACEABILITY_DATABASE[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => handleValidTagDetected(trace ? trace.batchNumber : p.id)}
                  disabled={isProcessingScan}
                  className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1">
                        <span>{p.name}</span>
                        <span className="text-[9px] text-emerald-400 font-mono">
                          ({trace ? trace.batchNumber : `#BATCH-${p.id}`})
                        </span>
                      </div>
                      <div className="text-[10px] text-[#EDD9B8]/70">
                        🌱 {p.farmName} · {p.location.split(',')[0]}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Scan Tag →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-[var(--soil)] border-t border-white/10 text-center text-[10px] text-[#EDD9B8]/60">
          SoilChain cryptographic tags are printed on all farm-gate packaging
        </div>
      </div>
    </div>
  );
};
