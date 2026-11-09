# 🛠️ Soil Mates — Comprehensive Android SDK & APK Build Guide

This guide provides step-by-step instructions for setting up the Android SDK, configuring required environment variables (`JAVA_HOME` and `ANDROID_HOME`), and generating ready-to-test APKs for the **Soil Mates** project (`com.soilmates.app`). It specifically addresses common terminal and environment path issues for **VS Code** users across Windows, macOS, and Linux.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Configuring Environment Variables](#2-configuring-environment-variables)
   - [Windows Environment Variables](#windows)
   - [macOS / Linux Environment Variables](#macos--linux)
3. [VS Code Terminal Integration & Path Resolution](#3-vs-code-terminal-integration--path-resolution)
4. [Building the Android APK](#4-building-the-android-apk)
   - [Method A: Standalone Complete Package Script](#method-a-standalone-complete-package-script)
   - [Method B: Gradle Release APK (`gradlew assembleRelease`)](#method-b-gradle-release-apk-gradlew-assemblerelease)
   - [Method C: Gradle Debug APK (`gradlew assembleDebug`)](#method-c-gradle-debug-apk-gradlew-assembledebug)
5. [APK Output Locations](#5-apk-output-locations)
6. [Troubleshooting Common Build Errors](#6-troubleshooting-common-build-errors)

---

## 1. Prerequisites

Before compiling the Android app, ensure the following software is installed on your system:

| Software | Required Version | Recommended Source |
| :--- | :--- | :--- |
| **Node.js** | v18.x or v20.x+ LTS | [nodejs.org](https://nodejs.org/) |
| **Java JDK** | JDK 17 or JDK 21 | [Eclipse Temurin](https://adoptium.net/) or Azul Zulu |
| **Android Studio** | Koala / Ladybug (2024.2+) | [developer.android.com/studio](https://developer.android.com/studio) |
| **Android SDK** | API Level 34, 35, or 36 | Android Studio SDK Manager |

---

## 2. Configuring Environment Variables

Gradle and Capacitor require system environment variables to locate the Java compiler and Android SDK tools.

### Windows

#### 1. Locate Paths
- Default JDK Path: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot` (or `C:\Program Files\Android\Android Studio\jbr`)
- Default Android SDK Path: `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`

#### 2. Set System Variables
1. Press `Win + R`, type `sysdm.cpl`, press Enter, and open the **Advanced** tab.
2. Click **Environment Variables**.
3. Under **User Variables** (or System Variables), click **New**:
   - Variable Name: `JAVA_HOME`
   - Variable Value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot`
4. Click **New** again:
   - Variable Name: `ANDROID_HOME`
   - Variable Value: `C:\Users\<YourUsername>\AppData\Local\Android\Sdk`
5. Select `Path` under User Variables ➔ click **Edit** ➔ click **New** and add:
   - `%JAVA_HOME%\bin`
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\cmdline-tools\latest\bin`

---

### macOS / Linux

#### 1. Locate Paths
- macOS Default SDK: `/Users/<YourUsername>/Library/Android/sdk`
- Linux Default SDK: `/home/<YourUsername>/Android/Sdk`

#### 2. Configure Shell Profile
Add the following lines to your `~/.zshrc` (macOS default) or `~/.bashrc` (Linux default):

```bash
# Java Development Kit
export JAVA_HOME=$(/usr/libexec/java_home -v 17) # macOS
# For Linux: export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk # macOS
# For Linux: export ANDROID_HOME=$HOME/Android/Sdk

# Executable Paths
export PATH=$PATH:$JAVA_HOME/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/tools
```

Apply changes:
```bash
source ~/.zshrc # or source ~/.bashrc
```

---

## 3. VS Code Terminal Integration & Path Resolution

VS Code users often encounter path or permission issues when running `./gradlew` or `npm run build:apk`. Follow these steps to ensure smooth execution:

### ⚠️ Common Issue 1: Environment Variables Not Recognized in VS Code
- **Symptom**: `JAVA_HOME is not set` or `ANDROID_HOME is not set` inside VS Code terminal, even though set globally.
- **Fix**: VS Code caches terminal environment state when launched. After setting environment variables, **completely restart VS Code** (close all windows) or open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and choose `Developer: Reload Window`.

### ⚠️ Common Issue 2: Terminal Shell Choice on Windows (PowerShell vs Command Prompt vs Git Bash)
- In PowerShell, running `./gradlew` might fail if script execution policies are restricted.
- **Fix for PowerShell**:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- Or use `gradlew.bat` in PowerShell / CMD:
  ```cmd
  cd android
  .\gradlew.bat assembleRelease
  ```

### ⚠️ Common Issue 3: Permission Denied on macOS / Linux (`./gradlew: Permission denied`)
- **Symptom**: Running `./gradlew assembleRelease` throws `bash: ./gradlew: Permission denied`.
- **Fix**: Grant executable permission to the Gradle wrapper:
  ```bash
  chmod +x android/gradlew
  ```

---

## 4. Building the Android APK

Soil Mates provides automated scripts and direct Gradle commands for compiling APK binaries.

### Method A: Standalone Complete Package Script
Builds web assets and outputs `SoilMates.apk` in the root directory:
```bash
npm run build:apk
```
*Creates a ~32.4 MB standalone APK containing pre-cached web assets, uncompressed 16KB page-aligned 64-bit native libraries, and offline AI models.*

---

### Method B: Gradle Release APK (`gradlew assembleRelease`)
Generates a production release APK:

1. **Quick Single Command**:
   ```bash
   npm run build:apk:release
   ```

2. **Or Manual Commands**:
   ```bash
   npm run build
   npx cap sync android
   cd android
   ./gradlew assembleRelease # On Windows: .\gradlew.bat assembleRelease
   ```

---

### Method C: Gradle Debug APK (`gradlew assembleDebug`)
Generates a debug APK for rapid testing:

1. **Quick Single Command**:
   ```bash
   npm run build:apk:debug
   ```

2. **Or Manual Commands**:
   ```bash
   npm run build
   npx cap sync android
   cd android
   ./gradlew assembleDebug # On Windows: .\gradlew.bat assembleDebug
   ```

---

## 5. APK Output Locations

After compiling, your APK files will be available at:

| Build Type | Output File Location |
| :--- | :--- |
| **Root Downloadable APK** | `/SoilMates.apk` |
| **Web Asset Download** | `/public/SoilMates.apk` |
| **Gradle Release APK** | `android/app/build/outputs/apk/release/app-release.apk` |
| **Gradle Debug APK** | `android/app/build/outputs/apk/debug/app-debug.apk` |

---

## 6. Troubleshooting Common Build Errors

### Error: `SDK location not found`
- **Cause**: Android Gradle plugin cannot locate your SDK directory.
- **Fix**: Create a file named `local.properties` inside the `android/` folder with:
  ```properties
  # Windows
  sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk

  # macOS
  sdk.dir=/Users/YourUsername/Library/Android/sdk

  # Linux
  sdk.dir=/home/YourUsername/Android/Sdk
  ```

### Error: `Unsupported Java version` / `Unsupported class file major version`
- **Cause**: Your active Java version is older than Java 17 or newer than Java 21.
- **Fix**: Verify active Java version:
  ```bash
  java -version
  ```
  Ensure `JAVA_HOME` points to JDK 17 or JDK 21.

### Error: `Cleartext HTTP traffic not permitted`
- **Cause**: Device blocking HTTP requests to local dev server (`http://192.168.x.x:3000`).
- **Fix**: Soil Mates is pre-configured with `android:usesCleartextTraffic="true"` in `android/app/src/main/AndroidManifest.xml`. If connecting to local server, ensure mobile phone and dev computer are on the same Wi-Fi network.

---

*Soil Mates Open Agricultural Initiative — Built for seamless mobile deployment.*
