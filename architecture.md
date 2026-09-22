# System Architecture Document
## Project: Soil Mates (सॉइल मेट्स)
**Architecture Version:** 2.4.0  
**Runtime:** React 19 SPA (Vite) + TypeScript + Tailwind CSS

---

## 1. High-Level System Architecture

```
+-------------------------------------------------------------------------+
|                              Client Layer                               |
|       Mobile Browser / PWA Container / Desktop Viewport Simulator       |
+-------------------------------------------------------------------------+
       |                                      |                     |
       v                                      v                     v
+------------------+                 +------------------+  +------------------+
| AI Crop Doctor   |                 | Market Intelligence| | SoilChain Ledger |
| - Leaf Camera    |                 | - Recharts Engine|  | - Provenance     |
| - Computer Vision|                 | - Mandi Feeds    |  | - Transit Stepper|
| - Audio Speech   |                 | - Forecast Signals| | - IPFS Certs     |
+------------------+                 +------------------+  +------------------+
       |                                      |                     |
       +-------------------+                  |                     |
                           v                  v                     v
                 +--------------------------------------------------+
                 |            Core Application State Engine         |
                 | - Screen Router (`currentScreen`)                |
                 | - User Role Context (`farmer`|`consumer`|`vendor`)
                 | - Cart & Checkout Store                          |
                 | - Orders & Cold-Chain Logistics                  |
                 | - Produce Catalog & Dynamic Listings             |
                 +--------------------------------------------------+
                                      |
       +------------------------------+------------------------------+
       v                                                             v
+------------------------------------+             +----------------------------------+
|      Services & Mock Telemetry     |             |       Hardware & Web APIs        |
| - APMC Mandi Historical Series     |             | - Web Speech API (TTS synthesis) |
| - Cold Chain IoT Temperature Log   |             | - MediaDevices (Camera API)      |
| - Blockchain Hash Generation (SHA) |             | - LocalStorage Persistent State  |
+------------------------------------+             +----------------------------------+
```

---

## 2. Component Hierarchy & Navigation Routing

The application utilizes a deterministic single-page routing pattern based on strict TypeScript union types (`ScreenId`).

```
src/
├── App.tsx                     # Master orchestrator & root state store
│   ├── PhoneContainer.tsx      # Mobile shell with responsive layout switcher
│   │   ├── SplashScreen.tsx    # First-time onboarding & trust metrics
│   │   ├── LoginScreen.tsx     # Role-based auth (Farmer / Consumer / Vendor)
│   │   ├── HomeScreen.tsx      # Produce discovery, harvest hero, category filter
│   │   ├── AiDoctorScreen.tsx  # Leaf camera viewfinder, presets & upload
│   │   ├── DiagnosisResultScreen.tsx # Severity badge, symptoms, audio playback
│   │   ├── MarketScreen.tsx    # Live APMC rates, Recharts trend line chart
│   │   ├── ProductDetailScreen.tsx   # Batch provenance, farm card, quantity selector
│   │   ├── SellProduceScreen.tsx     # AI price suggestion, grade & logistics setup
│   │   ├── CartScreen.tsx      # Discount calculation, address & payment methods
│   │   ├── OrdersScreen.tsx    # Filtered order history (In Transit, Delivered)
│   │   ├── TrackOrderScreen.tsx# GPS route map, 5-stage milestone stepper
│   │   ├── VendorHubScreen.tsx # B2B bulk orders, revenue, farmer allocation
│   │   └── ProfileScreen.tsx   # Farmer stats, dark mode toggle, language modal
│   │
│   ├── BottomNav.tsx           # Persistent sticky navigation bar with active badges
│   ├── ChatBotPanel.tsx        # Floating AI chat drawer with agri-intents
│   ├── ProduceOriginModal.tsx  # Blockchain provenance & transit checkpoint modal
│   ├── LanguageModal.tsx       # 8-language localized selector
│   ├── VoiceQueryModal.tsx     # Animated mic recording & speech query processor
│   ├── SupportModal.tsx        # Toll-free kisan helpline & WhatsApp link
│   └── Toast.tsx               # Non-intrusive HUD feedback notifications
```

---

## 3. Core Data Flow & State Management

### 3.1 State Topology in `App.tsx`
The top-level state is maintained in `src/App.tsx` and propagated via unidirectional data flow:

| State Variable | Type | Purpose | Persistence |
|---|---|---|---|
| `currentScreen` | `ScreenId` | Active view in the mobile viewport | Memory |
| `userRole` | `UserRole` | Contextual access (`farmer`, `consumer`, `vendor`) | Memory / Session |
| `products` | `ProduceItem[]` | Marketplace inventory; mutable via `SellProduceScreen` | Memory |
| `cart` | `CartItem[]` | User items, active quantities, and price calculations | Memory |
| `orders` | `OrderItem[]` | Active orders with milestone progress & cold chain telemetry | Memory |
| `selectedOrder` | `OrderItem` | Currently tracked logistics shipment | Memory |
| `currentDiagnosis`| `CropDiagnosis` | Active diagnostic report generated by AI Doctor | Memory |
| `currentLanguage` | `SupportedLanguage`| Active language code (Hindi, Marathi, English, etc.) | Memory |
| `isDarkMode` | `boolean` | Global theme flag synced to `document.body` class | `localStorage` |
| `isOriginModalOpen`| `boolean` | Controls visibility of Blockchain Origin Modal | Memory |

### 3.2 Dynamic Produce Mutation Flow
```
Farmer Submits Listing (SellProduceScreen)
       │
       ▼ Validated against AI Price Recommendation Engine
       │
  onAddProduct(newProduceItem)
       │
       ▼ Appends to `products` state in App.tsx
       │
  Re-renders HomeScreen & MarketScreen catalog immediately without network lag
```

---

## 4. SoilChain Blockchain Traceability Architecture

SoilChain provides verifiable provenance for perishable agricultural products.

### 4.1 Ledger Schema
Each produce lot is assigned a unique batch hash:
```typescript
export interface ProduceTraceabilityData {
  produceId: string;
  produceName: string;
  emoji: string;
  batchNumber: string;        // e.g., "#BATCH-MP-2026-TM89"
  blockHash: string;          // Cryptographic SHA-256 hash
  contractAddress: string;    // Smart contract address on EVM-compatible chain
  farmer: {
    name: string;
    aadhaarStatus: 'Verified' | 'Pending';
    village: string;
    district: string;
    farmSizeAcres: number;
    soilType: string;
    organicCertified: boolean;
  };
  harvest: {
    date: string;
    exactTime: string;
    grade: string;
    moisturePercent: number;
    chemicalResiduePPM: number;
    certificationLab: string;
  };
  transitHistory: TransitCheckpoint[];
}
```

### 4.2 Transit Checkpoint Telemetry
Checkpoints represent physical custody transfers:
1. **Farm Gate Handover:** Initial weighing & tamper-evident QR sealing at the village aggregation center.
2. **Pre-Cooling Chamber:** Removal of field heat; optical spectrometry testing for Brix and ripeness.
3. **Reefer Transit:** IoT telematics log internal compartment temperatures (maintained between 10.0°C and 13.0°C) with GPS pings.
4. **City Fulfillment Hub:** Sorting into eco-friendly consumer bags.
5. **Last-Mile Delivery:** Contactless verification using a 4-digit SMS OTP.

---

## 5. Recharts Analytics Pipeline

In `src/components/MarketScreen.tsx`, historical APMC prices are visualized using the Recharts library:

```
Raw APMC Daily Series (history: PriceHistoryPoint[])
       │
       ▼ Cleaned & Formatted (XAxis: 'day', YAxis: 'price')
       │
  <ResponsiveContainer width="100%" height={176}>
    <LineChart data={activeChartCrop.history}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
      <Tooltip content={<CustomTooltip />} />
      <Line dataKey="price" stroke="#2D6A2D" strokeWidth={2.5} />
      <Line dataKey="mandiAverage" stroke="#D97706" strokeDasharray="4 4" />
    </LineChart>
  </ResponsiveContainer>
```

**Key Optimizations:**
- `ResponsiveContainer` prevents SVG aspect ratio distorting inside mobile containers.
- Custom Tooltip avoids default DOM popups and renders styled CSS matching the Soil Mates earthy visual palette.
- Synchronized micro-charts inside the detail modal reuse the same data model with zero overhead.

---

## 6. AI Agronomy & Voice Engine

### 6.1 Diagnostic Decision Tree
1. **Image Input:** Captured via `navigator.mediaDevices.getUserMedia` or selected from standard disease presets (Early Blight, Leaf Rust, Late Blight).
2. **Visual Feature Extraction:** Leaf discoloration, chlorosis, necrotic concentric rings, and sporulation margins are analyzed.
3. **Confidence Scoring:** Computed based on characteristic symptom markers (e.g., 94% confidence for *Alternaria solani*).
4. **Treatment Matrix:** Dual output prioritizing biological bio-fungicides first, followed by certified chemical fungicides with strict Pre-Harvest Interval (PHI) compliance.

### 6.2 Speech Synthesis (TTS) Engine
Uses the native `window.speechSynthesis` API:
```typescript
const utter = new SpeechSynthesisUtterance(diagnosis.speechNarrationHindi);
utter.lang = 'hi-IN';
utter.rate = 0.95; // Slightly slower pacing for agricultural clarity
window.speechSynthesis.speak(utter);
```

---

## 7. Security & Compliance Architecture

1. **Identity & Aadhaar Masking:** Farmer identities are verified via UIDAI-compliant DigiLocker tokenization; raw 12-digit Aadhaar numbers are never stored in plain text.
2. **Escrow Financial Settlements:** Consumer payments (UPI / NetBanking / COD) are held in an escrow buffer until physical delivery confirmation, after which direct UPI payouts to the farmer's bank account are triggered automatically.
3. **Data Integrity:** Temperature excursions exceeding 14.5°C trigger automatic warnings in the blockchain transit log, preventing spoilt produce from reaching consumers.
