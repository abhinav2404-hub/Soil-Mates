# 🌱 Soil Mates - AI Crop Doctor & Direct Agri-Marketplace

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Soil Mates** connects smallholder farmers directly to urban consumers and vendors with AI-powered crop diagnosis, live Mandi price intelligence, blockchain-verified produce traceability, and physical QR code scanning.

---

## 🚀 Key Features

### 1. 🔬 AI Crop Doctor & Leaf Scanner
- **Instant Plant Disease Diagnosis**: Capture or upload crop leaf images to identify pests, leaf blights, powdery mildew, and nutrient deficiencies.
- **Multilingual Prescription**: Delivers actionable remediation steps, organic alternatives (Neem oil, Trichoderma), chemical sprays, and recovery timelines in Hindi, English, Punjabi, Marathi, and Telugu.
- **Voice Diagnostic Assistant**: Integrated voice prompt modal supporting localized voice queries.

### 2. 📊 Live Mandi Rates & Historical Price Trends
- **APMC Market Intelligence**: Real-time mandi rates from Azadpur, Vashi, Bhopal Karond, and Lasalgaon.
- **Interactive Recharts Trends**: 7-day to 30-day historical wholesale price charts comparing spot mandi prices against state APMC averages.
- **AI Price Forecast**: Predictive 7-day price forecasting advising farmers whether to sell immediately or hold inventory.

### 3. 🔗 Blockchain Produce Origin & Traceability (SoilChain V2)
- **Immutable Provenance**: Complete farm-to-table audit trail recording GPS coordinates, harvest time, temperature-controlled cold-chain transit, and lab pesticide tests (0.00 PPM chemical residue).
- **Cryptographic Hash Verification**: SHA-256 block ledger hashes with one-click copy and block explorer verification.

### 4. 📷 Device Camera QR Scanner
- **Physical Tag Scanning**: Built-in camera scanner powered by `jsqr` to scan QR codes on physical produce crates and packaging.
- **Hardware Controls**: Real-time laser reticle, flashlight/torch toggle, front/rear camera switcher, and demo barcode tags.

### 5. ⭐ Vendor Trust & Rating System
- **Verified Farmer Profiles**: Displays Aadhaar-verified status, customer trust score index (e.g. 98%), total batches sold, and repeat buyer rates.
- **Star Reviews & Feedback**: Star rating distribution (5★ to 1★), verified buyer badges, upvoting helpful reviews, and review submission with quality tags (*"Super Fresh"*, *"Zero Pesticide"*, *"On-Time Delivery"*).
- **Top-Rated Filter**: One-tap filter on the marketplace to view top-rated farmers (≥ 4.8★).

### 6. 🌾 Farm-Direct Marketplace & Logistics
- **Direct Buying & Selling**: Frictionless produce ordering with real-time subtotal calculation, delivery ETA, and quantity selector.
- **Live Order Tracking**: Interactive step-by-step delivery progress from harvest dispatch to doorstep.
- **Farmer Direct Chat**: In-app chatbot & direct messaging drawer to negotiate and inquire with local growers.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 (SPA) with TypeScript
- **Styling**: Tailwind CSS v4 & Lucide React icons
- **Charts**: Recharts for historical price trend analysis
- **Computer Vision & QR**: `jsqr` client-side canvas barcode scanning + HTML5 Video MediaStream API
- **AI Integration**: Google GenAI SDK ready for server-side / edge crop diagnostics
- **Build Tool**: Vite 6

---

## 📦 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── AiDoctorScreen.tsx       # AI Leaf scanner and crop doctor
│   │   ├── CameraQRScannerModal.tsx # Live camera QR code scanner
│   │   ├── VendorReviewsModal.tsx   # Star ratings & vendor reviews modal
│   │   ├── MarketScreen.tsx         # Mandi prices & Recharts price trends
│   │   ├── ProduceOriginModal.tsx   # SoilChain blockchain traceability modal
│   │   ├── ProductDetailScreen.tsx  # Product details, ratings & checkout
│   │   ├── HomeScreen.tsx           # Produce grid with ratings & scan button
│   │   ├── VendorHubScreen.tsx      # B2B bulk crate procurement hub
│   │   ├── OrdersScreen.tsx         # User order history
│   │   ├── TrackOrderScreen.tsx     # Real-time delivery tracker
│   │   ├── CartScreen.tsx           # Cart & checkout workflow
│   │   ├── VoiceQueryModal.tsx      # Multilingual voice query assistant
│   │   └── ChatBotPanel.tsx         # Direct farmer/agri chatbot
│   ├── data/
│   │   └── agriData.ts              # Seed data for crops, mandis, blockchain & reviews
│   ├── types.ts                     # TypeScript definitions
│   ├── App.tsx                      # Root application & screen routing
│   └── main.tsx                     # React DOM entrypoint
├── architecture.md                  # System architecture & component tree
├── PRD.md                           # Product Requirements Document
├── rules.md                         # Business logic & operational rules
├── design.md                        # Design guidelines & color palette
├── phases.doc.md                    # Roadmap & deployment phases
├── memory.md                        # Project state & technical memory
├── package.json
└── vite.config.ts
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/soil-mates.git
   cd soil-mates
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key if you want to enable live cloud model analysis:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:3000`.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🚢 Publishing to GitHub

To publish this project to your own GitHub account:

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `soil-mates`).
2. Run the following commands in your terminal:

```bash
git init
git add .
git commit -m "feat: initial release of Soil Mates - Crop Doctor & Agri Marketplace"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## 📄 Documentation

- [PRD.md](./PRD.md) - Product Requirements & User Personas
- [architecture.md](./architecture.md) - System Architecture & Data Flow
- [rules.md](./rules.md) - Marketplace & Blockchain Validation Rules
- [design.md](./design.md) - Design Constitution & Tokens
- [phases.doc.md](./phases.doc.md) - Milestone Phases

---

## 📜 License

This project is licensed under the MIT License.
