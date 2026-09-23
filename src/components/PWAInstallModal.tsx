import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle,
  Copy,
  ExternalLink,
  QrCode,
  Shield,
  Sparkles,
  Terminal,
  FolderArchive
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'qr-test' | 'direct' | 'apk-build' | 'instructions'>('qr-test');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const mobileUrl = typeof window !== 'undefined'
    ? window.location.href.split('?')[0].split('#')[0]
    : 'https://ais-pre-zpvaibxii6elges2mvd2su-178647378503.asia-east1.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(mobileUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: '#1E3F1A',
          light: '#FFFFFF'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [isOpen, mobileUrl]);

  if (!isOpen) return null;

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(label);
    onShowToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onShowToast('Soil Mates installed successfully to your home screen! 🎉');
        onClose();
      }
    } else {
      onShowToast('Use browser menu (⋮) -> "Install app" or "Add to Home screen"');
    }
  };

  const capacitorCommands = `# 1. Extract the downloaded zip & install dependencies
npm install

# 2. Build web assets & add Android platform
npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap sync android

# 3. Open in Android Studio to build APK
npx cap open android
# Menu: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
# Output: android/app/build/outputs/apk/debug/app-debug.apk`;

  const bubblewrapCommands = `# 1. Install Google Bubblewrap CLI (Official WebAPK tool)
npm install -g @bubblewrap/cli

# 2. Build signed Android APK directly from PWA manifest:
bubblewrap init --manifest="${mobileUrl}manifest.webmanifest"
bubblewrap build

# Result: app-release-signed.apk generated!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--white)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="p-4 text-[#EDD9B8] flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xl shadow-xs">
              📱
            </div>
            <div>
              <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8] flex items-center gap-1.5">
                <span>Mobile Test & APK Hub</span>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/40">
                  Live
                </span>
              </h3>
              <p className="text-[10px] text-[#EDD9B8]/75">
                Instant phone testing, WebAPK & downloadable package
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[var(--leaf-pale)] border-b border-[var(--border)] p-1 gap-1 flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('qr-test')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'qr-test'
                ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>📱 Test on Phone</span>
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'direct'
                ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1-Click Install</span>
          </button>
          <button
            onClick={() => setActiveTab('apk-build')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'apk-build'
                ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>APK Build</span>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
              activeTab === 'instructions'
                ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text2)] hover:text-[var(--text)]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>GitHub CI</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs text-[var(--text)] no-scrollbar">
          {activeTab === 'qr-test' && (
            <div className="space-y-3 text-center">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  <strong>Instant Mobile Launch:</strong> Point your phone's camera at the QR code below to immediately run Soil Mates on your device with full hardware camera scanning & leaf diagnosis.
                </div>
              </div>

              {/* QR Code Container */}
              <div className="inline-block p-3 bg-white rounded-2xl border-2 border-[var(--soil)] shadow-md">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan to open on mobile"
                    className="w-44 h-44 mx-auto rounded-xl"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-stone-100 rounded-xl text-[10px] text-stone-400">
                    Generating QR Code...
                  </div>
                )}
                <div className="mt-1 text-[10px] font-bold text-[var(--soil)] flex items-center justify-center gap-1">
                  <span>📷 Scan with Android / iPhone Camera</span>
                </div>
              </div>

              {/* Share / Copy URL button */}
              <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800/60 p-2 rounded-xl border border-[var(--border)] text-left">
                <input
                  type="text"
                  readOnly
                  value={mobileUrl}
                  className="flex-1 bg-transparent text-[10px] font-mono text-[var(--text2)] outline-hidden truncate select-all"
                />
                <button
                  onClick={() => handleCopy(mobileUrl, 'Mobile URL')}
                  className="px-2.5 py-1 rounded-lg bg-[var(--soil)] text-[#EDD9B8] font-bold text-[10px] flex items-center gap-1 flex-shrink-0 hover:bg-[var(--soil2)] transition-colors active:scale-95"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode === 'Mobile URL' ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Direct Download Android Package Button */}
              <div className="pt-1">
                <a
                  href="/downloads/soil-mates-android-package.zip"
                  download="soil-mates-android-package.zip"
                  onClick={() => onShowToast('Downloading Android Project Package Zip...')}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>Download Android Project Package (.ZIP)</span>
                </a>
                <p className="text-[10px] text-[var(--text3)] mt-1">
                  Includes Capacitor Android config, icons, manifest & build scripts.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'direct' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                    Native WebAPK / Android Standalone App
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 leading-relaxed">
                    Soil Mates is configured as a Progressive Web App. When opened on Android, Chrome and Google Play Services automatically package and install a native <strong>WebAPK package</strong> that sits in your Android app drawer with full screen, splash screen, and offline caching.
                  </p>
                </div>
              </div>

              {/* Install action button */}
              <div className="bg-[var(--leaf-pale)]/50 border border-[var(--border)] rounded-2xl p-4 text-center space-y-2.5">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--soil)] flex items-center justify-center text-2xl shadow-md text-[#EDD9B8]">
                  🌱
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--text)]">
                    Soil Mates Mobile Edition
                  </div>
                  <div className="text-[10px] text-[var(--text3)]">
                    Package: com.soilmates.app · Size: ~3.2 MB
                  </div>
                </div>

                {isInstalled ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>App is already installed on this device!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                    style={{ backgroundColor: 'var(--leaf)' }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App on Android / Home Screen</span>
                  </button>
                )}
              </div>

              {/* Manual Steps for Chrome / Android */}
              <div className="border border-[var(--border)] rounded-xl p-3 bg-stone-50 space-y-2">
                <div className="font-bold text-[11px] text-[var(--text)] flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--leaf2)]" />
                  <span>How to install in Android Chrome:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[10px] text-[var(--text2)]">
                  <li>Open the link in <strong>Google Chrome</strong> on your Android phone.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> menu in the top right.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Android will automatically generate the native app on your phone.</li>
                </ol>
              </div>

              {isIOS && (
                <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-3 space-y-1 text-[10px] text-blue-900">
                  <div className="font-bold">📱 iPhone / iPad Safari Steps:</div>
                  <p>Tap the <strong>Share</strong> icon in the bottom Safari toolbar, scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'apk-build' && (
            <div className="space-y-3">
              <p className="text-[11px] text-[var(--text2)]">
                To build a standalone signed native <strong>.apk</strong> binary for Google Play Store or direct sideloading, use either toolchain:
              </p>

              {/* Method 1: Capacitor CLI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[var(--leaf)] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Option 1: Capacitor & Android Studio (Recommended)
                  </span>
                  <button
                    onClick={() => handleCopy(capacitorCommands, 'Capacitor Build Script')}
                    className="p-1 px-2 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode === 'Capacitor Build Script' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed whitespace-pre">
                  {capacitorCommands}
                </pre>
              </div>

              {/* Method 2: Google Bubblewrap CLI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[var(--leaf)] flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    Option 2: Google Bubblewrap (Instant CLI APK from Manifest)
                  </span>
                  <button
                    onClick={() => handleCopy(bubblewrapCommands, 'Bubblewrap Build Script')}
                    className="p-1 px-2 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode === 'Bubblewrap Build Script' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-stone-900 text-amber-300 p-2.5 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed whitespace-pre">
                  {bubblewrapCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 space-y-1.5">
                <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Automated GitHub Actions APK Build</span>
                </h4>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  We have added an automated workflow file <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[10px]">.github/workflows/build-apk.yml</code> to this project.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[10px] text-blue-900 pt-1">
                  <li>Push this project to your GitHub repository.</li>
                  <li>Click on the <strong>Actions</strong> tab in your repository.</li>
                  <li>Select <strong>"Build Android APK"</strong> and click <strong>"Run workflow"</strong>.</li>
                  <li>GitHub's cloud servers will compile and provide a downloadable <strong>.apk</strong> artifact automatically!</li>
                </ol>
              </div>

              <div className="bg-stone-50 border border-[var(--border)] rounded-xl p-3 space-y-2">
                <div className="font-bold text-[11px] text-[var(--text)]">
                  📁 Project Files Created for APK:
                </div>
                <ul className="space-y-1 text-[10px] text-[var(--text2)]">
                  <li>• <code className="font-mono text-emerald-700 font-bold">capacitor.config.json</code> — Android app bundle configuration</li>
                  <li>• <code className="font-mono text-emerald-700 font-bold">.github/workflows/build-apk.yml</code> — CI workflow for automatic APK release</li>
                  <li>• <code className="font-mono text-emerald-700 font-bold">public/pwa-192x192.png</code> & <code className="font-mono text-emerald-700 font-bold">pwa-512x512.png</code> — Android launcher icons</li>
                  <li>• <code className="font-mono text-emerald-700 font-bold">public/downloads/soil-mates-android-package.zip</code> — Downloadable bundle</li>
                  <li>• <code className="font-mono text-emerald-700 font-bold">android-apk-guide.md</code> — Full documentation</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-[var(--border)] flex items-center justify-between flex-shrink-0">
          <span className="text-[10px] text-[var(--text3)]">
            Soil Mates Mobile PWA / APK v2.4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--soil)] text-[#EDD9B8] font-bold text-xs hover:bg-[var(--soil2)] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
