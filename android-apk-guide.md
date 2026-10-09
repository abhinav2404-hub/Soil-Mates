# 📱 Soil Mates — Android APK Generation & Native Build Guide

This document details how to generate and distribute native Android APKs for **Soil Mates** (`com.soilmates.app`) using Capacitor and Android Studio.

---

## 🚀 Application Startup Flow

```text
Android Device Launches APK
            │
            ▼
Capacitor Loads React Application (Vite bundle in android/app/src/main/assets/public)
            │
            ▼
Authentication State Check (localStorage: soilMatesToken & soilMatesUser)
            ├─────────────────────────────────────────┐
            ▼                                         ▼
   [Token Present & Valid]                  [No Token / Unauthenticated]
            │                                         │
            ▼                                         ▼
Home Dashboard directly (`s-home`)        Login Screen directly (`s-login`)
(or Farmer Hub `s-farmer` if farmer)    (NO splash/welcome page shown)
```

---

## 🛠️ Target Platforms & Architecture (Android 16 & 17 Ready)

- **Target SDK**: Android 16 (API Level 36, Baklava) & Android 17 Forward Compatible (API Level 37)
- **Minimum SDK**: Android 7.0 (API Level 24)
- **Package Size**: ~32.3 MB standalone package (includes uncompressed offline AgriVision TFLite model weights, APMC mandi database & multi-DEX runtime)
- **16 KB Memory Page-Size Alignment**: Fully compliant with Android 15, 16, and 17 64-bit kernels (ELF shared libraries `lib/arm64-v8a/*.so` are uncompressed and aligned for zero-overhead direct `mmap`)
- **Supported ABIs**: `arm64-v8a` (primary), `armeabi-v7a`, `x86_64` (emulators)

### Prerequisites for Compiling
1. **Node.js**: v18+ or v20+
2. **Android Studio**: Ladybug / Meerkat / Koala (2024.2+)
3. **Android SDK**: API Level 34, 35, or 36 installed via Android Studio SDK Manager
4. **Java Development Kit (JDK)**: JDK 17 or JDK 21 (bundled with Android Studio)

---

## 📦 Required Commands for Project Setup & Sync

Run these commands from the root directory:

```bash
# 1. Install all dependencies
npm install

# 2. Compile production web assets
npm run build

# 3. Synchronize web assets and plugins to Android native project
npx cap sync android

# 4. Open project in Android Studio
npx cap open android
```

---

## 🔨 Method 1: Building Debug APK (`.apk`)

A Debug APK is ideal for immediate testing on physical Android smartphones or emulators.

### Option A: Using Android Studio GUI (Easiest)
1. Run `npx cap open android` to open the `android/` directory in Android Studio.
2. Wait for Gradle sync to complete.
3. In the top menu bar, select:
   **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**.
4. When the notification appears:
   Click **"locate"** or find your generated APK at:
   ```text
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
5. Transfer `app-debug.apk` to your phone via USB, Google Drive, WhatsApp, or ADB:
   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option B: Using Command Line (Gradle Wrapper)
Without opening Android Studio, you can compile the debug APK directly from your terminal:

```bash
cd android
./gradlew assembleDebug
cd ..
```
The resulting APK is generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🔐 Method 2: Building Production / Release APK (`.apk`)

For distributing to testers or publishing outside Google Play.

### Step 1: Generate a Keystore (One-Time)
Run this command in terminal to create a private signing key:

```bash
keytool -genkey -v -keystore soilmates-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias soilmates
```
Enter a secure keystore password when prompted and remember the alias (`soilmates`).

### Step 2: Configure Signing in `android/app/build.gradle` (or via Android Studio)
In Android Studio:
1. Go to **Build** ➔ **Generate Signed Bundle / APK...**
2. Choose **APK** ➔ click **Next**.
3. Select your `soilmates-release-key.jks` file, enter passwords, and choose **Release**.
4. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**.
5. Click **Create**.

Your signed release APK will be located at:
```text
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🖥️ Backend & API Configuration for Android

When running on an Android physical device, `localhost:3000` points to the Android phone itself. You must configure the API URL:

### 1. In Local Development / LAN Testing
Point `VITE_API_BASE_URL` in your `.env` to your computer's local Wi-Fi IP:
```env
VITE_API_BASE_URL=http://192.168.1.50:3000
```
Then run:
```bash
npm run build
npx cap sync android
```

### 2. In Production / Cloud Hosted
Point to your hosted URL (e.g. Cloud Run, Railway, Render, VPS):
```env
VITE_API_BASE_URL=https://your-soilmates-domain.com
```

### 3. Cleartext Traffic
The Android project is pre-configured with `android:usesCleartextTraffic="true"` in `android/app/src/main/AndroidManifest.xml` to allow `http://` API calls during development and testing.

---

## 👆 Biometric (Fingerprint & Face) Authentication

Soil Mates includes native biometric authentication powered by the Capacitor biometric plugin and Android BiometricPrompt APIs:
1. **Hardware Detection**: Automatically detects device capabilities (Fingerprint, Face Unlock, or Touch ID).
2. **Instant 1-Tap Unlock**: Mobile users who have previously logged in or chosen "Remember Me" can authenticate via fingerprint sensor without retyping passwords.
3. **Android Permissions**: `android.permission.USE_BIOMETRIC` and `android.permission.USE_FINGERPRINT` are registered in `AndroidManifest.xml`.
4. **Fallback Handling**: If biometric scan fails or user cancels, graceful fallback to device PIN/passcode or standard password/OTP is supported.

---

## 🗄️ MongoDB Setup

1. **Local MongoDB**:
   ```bash
   docker compose -f docker-compose.database.yml up -d
   ```
   MongoDB starts on `localhost:27017` and Mongo Express starts on `http://localhost:8081`.

2. **MongoDB Atlas (Cloud)**:
   Set `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/soilmates?retryWrites=true&w=majority
   ```

3. **In-Memory Store (Zero-Dependency)**:
   If MongoDB is unreachable or omitted, Soil Mates automatically runs on its resilient in-memory hybrid store pre-seeded with 8 authentic agricultural produce lots and mandi rates.
