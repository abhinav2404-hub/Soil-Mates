# 📱 Soil Mates — Android APK & Native Installation Guide

This project supports two primary ways to run as a native Android application:

---

## ⚡ Method 1: Instant 1-Click Native WebAPK Installation (Zero Tools Needed)

Soil Mates is configured with full **PWA (Progressive Web App)** and **WebAPK** standards.

1. Open the app URL in **Google Chrome** on any Android device:
   ```text
   https://ais-pre-zpvaibxii6elges2mvd2su-178647378503.asia-east1.run.app
   ```
2. Tap the in-app **"📲 Install App / APK"** button or Chrome's three-dot menu (**⋮**) -> **"Install app"** / **"Add to Home screen"**.
3. Android OS compiles and installs a genuine **WebAPK (`com.soilmates.app`)** directly onto your phone:
   - Sits in your Android App Drawer alongside native apps.
   - Launches in full-screen standalone mode without browser address bar.
   - Includes full offline caching and hardware camera permissions for QR scanning & Leaf Doctor.

---

## 🛠️ Method 2: Build Standalone `.apk` with Capacitor (Local Machine)

If you need a standalone `.apk` file for sideloading or submitting to the Google Play Store:

### Prerequisites
- Node.js 18+
- Android Studio with Android SDK 33+

### Step-by-Step Commands

```bash
# 1. Clone your GitHub repository
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
cd <YOUR_REPO>

# 2. Install dependencies & build production web assets
npm install
npm run build

# 3. Add Capacitor Android platform
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

In **Android Studio**:
1. Go to menu: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
2. Android Studio will generate the APK at:
   ```text
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Transfer `app-debug.apk` to any Android device and tap to install!

---

## 🤖 Method 3: Automated GitHub Actions APK Release (Cloud Build)

We have added `.github/workflows/build-apk.yml` to this repository.

1. Push your repository to GitHub.
2. In your GitHub repository, click on the **Actions** tab.
3. Select **"Build Android APK"** from the left sidebar and click **"Run workflow"**.
4. When finished (~2 minutes), download the generated **`soil-mates-debug-apk`** zip file containing `app-debug.apk` directly from the workflow summary!

---

## 📦 Package Details
- **App Name**: Soil Mates
- **Package Identifier**: `com.soilmates.app`
- **Orientation**: Portrait
- **Theme Color**: `#2D5A27`
- **Background Color**: `#FBF8F2`
- **Icons**: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/pwa-maskable-512x512.png`
