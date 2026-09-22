# 🌱 Soil Mates (सॉइल मेट्स)

**Your AI Crop Doctor & Direct Agri-Marketplace**

Soil Mates is a mobile-first React application that tackles two of Indian agriculture's biggest structural problems in one product: **crop disease losses** from delayed diagnosis, and **excessive middleman margins** that starve farmers of fair prices while consumers pay a premium for produce they can't trust. It combines an AI-powered crop doctor, a direct farmer-to-consumer marketplace, blockchain-backed provenance, and live mandi (market) price intelligence into a single, offline-friendly, multi-lingual experience built for both rural fields and urban kitchens.

> **Status:** In Production / Active Development · **Version:** 2.4.0
> **Initial focus markets:** Madhya Pradesh, Maharashtra, Uttar Pradesh (India)

---

## ✨ Key Features

### 🩺 AI Crop Doctor
- Live camera or photo-upload capture of leaf images for instant disease diagnosis.
- Pre-trained recognition for high-value staple crops (tomato early blight, wheat leaf rust, potato late blight, and more).
- Full diagnostic report: disease classification with confidence score, pathogen identification, urgency level, and a visual symptom checklist.
- Step-by-step treatment protocol — chemical remedy with exact dosage, organic/biological alternative, and preventive cultural practices.
- Bilingual (Hindi / Indian English) text-to-speech narration for hands-free, low-literacy-friendly field use.
- One-click "Add Medicine to Cart" straight from the diagnosis screen.

### 🛒 Direct Agri Marketplace
- Category-wise discovery: vegetables, fruits, grains & pulses, dairy & organic, herbs & spices.
- Real-time stock, per-kg/bunch pricing, farm provenance tags, and consumer reviews.
- Farmer listing wizard with an AI price recommendation engine (suggests min/optimal/max prices from live APMC rates), quality grading, and cold-chain vs. self-delivery logistics toggle.
- Transparent 5% platform facilitation fee — no hidden middleman markup.

### 📈 Live Mandi Intelligence
- Regional APMC mandi ticker integration (Karond Bhopal, Sehore, Vidisha, Indore, Berasia).
- Interactive 7-day price history chart (Recharts) comparing local mandi price vs. state APMC average.
- AI predictive forecast signals — "Hold for Peak," "Sell Now," "Stable Buy" — with a live demand index.

### 🔗 SoilChain Blockchain Provenance
- Cryptographic batch IDs (`#BATCH-MP-2026-TM89`) with SHA-256 block hashing.
- Three-tier traceability view: cold-chain transit history, farm origin (with Aadhaar verification badge), and lab/scientific quality (Brix index, moisture %, pesticide residue PPM).
- In-app QR scanner simulation for verifying crates in the field or at home.
- Downloadable cryptographic proof certificate for export/FPO compliance.

### 🚚 Cold-Chain Logistics
- 5-stage order pipeline: Confirmed → Farmer Notified → Pickup Completed → Out for Delivery → Delivered.
- Real-time tracking simulation with rider proximity indicator and one-tap call.

### 🌐 Multi-Lingual & Voice-First
- 8 supported Indian languages: Hindi, English, Marathi, Tamil, Telugu, Kannada, Punjabi, and Bengali.
- Interactive voice assistant modal with context-aware, simulated speech recognition.
- Floating "Soil Mate Bot" chat drawer with domain-specific agri intents.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite` |
| Charts | [Recharts](https://recharts.org/) |
| Animation | [Motion](https://motion.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| AI | [`@google/genai`](https://www.npmjs.com/package/@google/genai) (Gemini API) |
| QR Scanning | [jsQR](https://github.com/cozmo/jsQR) |
| Server (optional) | Express |

---

## 📂 Project Structure

```
Soil-Mates/
├── src/
│   ├── App.tsx                     # Root orchestrator & app-wide state store
│   ├── main.tsx                    # React entry point
│   ├── types.ts                    # Shared TypeScript types (ScreenId, ProduceItem, etc.)
│   ├── index.css                   # Design tokens (CSS variables) & global styles
│   ├── data/                       # Seed/mock data (products, orders, diagnoses, reviews)
│   └── components/
│       ├── PhoneContainer.tsx      # Responsive mobile shell
│       ├── SplashScreen.tsx        # Onboarding & trust metrics
│       ├── LoginScreen.tsx         # Role-based auth (Farmer / Consumer / Vendor)
│       ├── HomeScreen.tsx          # Produce discovery & category filters
│       ├── AiDoctorScreen.tsx      # Leaf camera viewfinder & upload
│       ├── DiagnosisResultScreen.tsx
│       ├── MarketScreen.tsx        # APMC rates & Recharts trend lines
│       ├── ProductDetailScreen.tsx # Batch provenance & farm card
│       ├── SellProduceScreen.tsx   # AI price suggestion & listing wizard
│       ├── CartScreen.tsx
│       ├── OrdersScreen.tsx
│       ├── TrackOrderScreen.tsx    # GPS route + 5-stage delivery stepper
│       ├── VendorHubScreen.tsx     # B2B bulk ordering
│       ├── ProfileScreen.tsx
│       ├── BottomNav.tsx
│       ├── ChatBotPanel.tsx        # Floating AI chat drawer
│       ├── ProduceOriginModal.tsx  # SoilChain provenance viewer
│       ├── CameraQRScannerModal.tsx
│       ├── VoiceQueryModal.tsx
│       ├── LanguageModal.tsx
│       └── SupportModal.tsx
├── PRD.md                          # Full product requirements document
├── architecture.md                 # System architecture & data flow
├── design.md                       # Design system & UI specification
├── rules.md                        # Engineering & design conventions
├── phases.doc.md                   # Delivery phases / roadmap
├── memory.md                       # Project working notes
├── metadata.json                   # App metadata & required permissions
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended) and npm, or [Bun](https://bun.sh/) (a `bun.lock` is included)
- A [Gemini API key](https://ai.google.dev/) for AI-powered features

### Installation

```bash
git clone https://github.com/abhinav2404-hub/Soil-Mates.git
cd Soil-Mates
npm install
```

### Environment Variables

Copy the example file and add your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Required for Gemini AI API calls (crop diagnosis, price recommendations, etc.) |
| `APP_URL` | The URL where the app is hosted (used for self-referential links) |

### Run the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Other Scripts

```bash
npm run build     # Production build via Vite
npm run preview   # Preview the production build locally
npm run lint       # Type-check the project with tsc
npm run clean      # Remove build artifacts
```

---

## 🎨 Design Philosophy

Soil Mates follows a **"Rooted in the Soil, Powered by Intelligence"** design language — earthy clay, sun-warmed cream, and chlorophyll green replace generic corporate blues and glossy AI-slop gradients. The interface is tuned for **sunlight legibility** (high contrast, non-glare backgrounds) so it stays usable for farmers reading their screens outdoors, while remaining polished enough for urban consumers. Full details live in [`design.md`](./design.md), and dark mode is supported out of the box.

---

## 📖 Documentation

This repository includes detailed product and engineering documentation:

- [`PRD.md`](./PRD.md) — Product requirements, personas, functional requirements, and KPIs
- [`architecture.md`](./architecture.md) — System architecture, component hierarchy, and data flow
- [`design.md`](./design.md) — Design tokens, color palette, and UI specification
- [`rules.md`](./rules.md) — Codebase and engineering conventions
- [`phases.doc.md`](./phases.doc.md) — Development phases and roadmap

---

## 👥 Target Users

- **Smallholder & marginal farmers** seeking rapid crop diagnostics and fair, transparent pricing
- **Urban consumers** who want traceable, farm-fresh produce delivered quickly
- **Bulk agri-vendors and FPOs** needing reliable procurement and grading at scale

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Please open an issue first to discuss what you'd like to change, and follow the conventions documented in [`rules.md`](./rules.md) (TypeScript strictness, immutable state updates, and the shared design token system).

---

## 📄 License

No license has been specified for this repository yet. Please add a `LICENSE` file to clarify usage terms, or contact the repository owner for details.
