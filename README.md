# 🌱 Soil Mates - Agricultural Marketplace & AI Crop Doctor

Soil Mates is a full-stack agricultural mobile and web application connecting farmers, consumers, vendors, and agricultural administrators. It features an AI Crop Doctor (powered by Gemini API), live Mandi market price trends (Recharts), secure biometric authentication (Capacitor Biometric Auth), blockchain produce traceability, and a direct APK builder.

---

## 📱 Features

- **Direct Startup Flow**: Opens directly to Login when unauthenticated and to the Home dashboard when authenticated (no introductory marketing splash screen).
- **AI Crop Doctor**: Leaf disease scanner with Gemini AI integration.
- **Market Price Trend**: Recharts-powered 7-day historical mandi price trends with interactive commodity switcher pills.
- **Biometric Authentication**: Fingerprint & Face ID touch unlock (`@aparajita/capacitor-biometric-auth`).
- **Direct APK Generator**: Pre-built Android APK available for instant download (`SoilMates.apk`) and Gradle compilation scripts.
- **Multilingual Support**: English & Hindi vernacular support with speech synthesis and voice query assistant.

---

## 🛠️ System Prerequisites & Setup Guide

To successfully build and run Soil Mates for Android, you need to install and configure the following developer tools:

### 1. Node.js & npm
- Download and install **Node.js LTS (v18 or v20+)** from [nodejs.org](https://nodejs.org/).
- Verify installation:
  ```bash
  node -v
  npm -v
  ```

### 2. Java Development Kit (JDK 17 or 21)
- Download and install **JDK 17 or JDK 21** (e.g., Eclipse Temurin or Azul Zulu) from [Adoptium](https://adoptium.net/).
- Set up the `JAVA_HOME` environment variable:
  - **Windows**: Add `JAVA_HOME` pointing to your JDK installation path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17...`) and add `%JAVA_HOME%\bin` to your System `PATH`.
  - **macOS / Linux**: Export `JAVA_HOME` in your `~/.bashrc` or `~/.zshrc`:
    ```bash
    export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
    export PATH=$PATH:$JAVA_HOME/bin
    ```

### 3. Android Studio & Android SDK
- Download and install **Android Studio** from [developer.android.com](https://developer.android.com/studio).
- During setup, ensure you install:
  - **Android SDK**
  - **Android SDK Platform-Tools**
  - **Android SDK Build-Tools**
- Set up the `ANDROID_HOME` environment variable:
  - **Windows**: `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`
  - **macOS**: `/Users/<YourUsername>/Library/Android/sdk`
  - **Linux**: `/home/<YourUsername>/Android/Sdk`
  - Add `platform-tools` and `tools` to your system `PATH`.

---

## ⚙️ Environment Variables (`.env.example`)

Create a `.env` file in the project root based on `.env.example`:

```env
# Backend Server & Database
PORT=4000
MONGO_URI=mongodb://localhost:27017/soil-mates
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_API_KEY=your_admin_api_key_here

# Google Gemini AI (Server-side only - never expose in frontend)
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend Public API URL
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🚀 Quick Start & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Web Development Server**:
   ```bash
   npm run dev
   ```

3. **Build Web App**:
   ```bash
   npm run build
   ```

---

## 🤖 Building the Android APK

### Automatic APK Build Script
You can build the production web assets and generate `SoilMates.apk` directly in the project root with:
```bash
npm run build:apk
```
* **Root APK**: `/SoilMates.apk`
* **Web Download APK**: `/public/SoilMates.apk`
* **Android Debug Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### Manual Gradle Build Instructions (Windows / macOS / Linux)

1. **Synchronize Capacitor**:
   ```bash
   npx cap sync android
   ```

2. **Navigate to the Android Folder**:
   ```bash
   cd android
   ```

3. **Generate Debug APK**:
   - **Windows**:
     ```cmd
     gradlew.bat assembleDebug
     ```
   - **macOS / Linux**:
     ```bash
     ./gradlew assembleDebug
     ```
   * *Output*: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Generate Release APK (Signed)**:
   - **Windows**:
     ```cmd
     gradlew.bat assembleRelease
     ```
   - **macOS / Linux**:
     ```bash
     ./gradlew assembleRelease
     ```
   * *Output*: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 📂 Project Structure

```text
src/
  components/    # React UI components (Login, HomeScreen, MarketPriceTrend, etc.)
  services/      # API client & biometric auth services
  types.ts       # TypeScript interfaces & types
  App.tsx        # Main application router with Framer Motion transitions

server/
  src/
    config/      # Database configuration
    models/      # Mongoose schemas (User, Product, Order, Diagnosis, etc.)
    routes/      # Express API endpoints

android/         # Capacitor Android native wrapper project
docs/            # Project documentation & architecture specs
```

---

## 📄 License
Soil Mates Open Agricultural License. Designed for 600M+ farmers globally.
