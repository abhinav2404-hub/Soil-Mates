# 🌱 Soil Mates - Complete Full-Stack Agricultural Marketplace & AI Crop Doctor

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js Express](https://img.shields.io/badge/Node.js-Express_4.21-339933.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_&_Mongoose-47A248.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_GenAI_SDK-4285F4.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **"Empowering farmers with AI, transparent markets, direct selling, digital trust, and intelligent agricultural decision support."**

Soil Mates is a modern, production-grade direct farmer-to-consumer agricultural platform. It connects smallholder farmers, retail consumers, bulk vendors, and platform administrators with server-side Google Gemini crop diagnosis, real-time APMC mandi market intelligence, agricultural weather & irrigation advisory, blockchain-inspired traceability (SoilChain), and end-to-end order fulfillment with farmgate UPI escrow protection.

---

## 🌟 Supported User Roles

1. **👨‍🌾 Farmers**:
   - Manage produce listings (add, edit, toggle availability)
   - Real-time farmgate order fulfillment & dispatch tracking
   - AI Crop Doctor with camera/file upload & structured remediation
   - Mandi market rates & price forecasts across Indian APMCs
   - Farm revenue analytics & yield calculation

2. **🛒 Consumers (Buyers)**:
   - Direct-from-farm produce catalog with category and price filters
   - Add to cart with server-side stock & price validation
   - Farmgate escrow order checkout & live rider tracking
   - Star ratings and verified buyer reviews

3. **🏪 Vendors (Bulk Buyers & Retail Marts)**:
   - Bulk procurement and institutional trade requests
   - High-volume lot contracting and mandi benchmarking
   - Vendor review management and farm inspection audit trails

4. **🛡️ Administrators**:
   - Platform governance dashboard with revenue analytics and Recharts charts
   - Directory management for farmers, vendors, consumers, and listings
   - System health diagnostics (MongoDB connection, RSS memory, uptime, AI readiness)

---

## 🚀 Key Features

### 1. 🔬 Server-Side AI Crop Doctor (Gemini 2.5 / 3.8 Flash)
- **Secure Server-Side Architecture**: Camera snapshots and image uploads are securely sent to Express backend endpoints (`/api/diagnosis`). API keys are never exposed to the client.
- **Structured Agronomic Output**: Evaluates leaf pathology and returns structured JSON:
  - Botanical/pathogen name, confidence score, and severity indicator (High / Medium / Low)
  - Observable symptoms and primary causes
  - Step-by-step treatment protocol, cultural prevention practices
  - Organic alternatives (bio-fungicides, Neem oil, Trichoderma) and chemical sprays
  - Agricultural decision-support disclaimer advising local Krishi Vigyan Kendra (KVK) consultation

### 2. ☀️ Real-Time Agri Weather & Irrigation Advisory
- Displays local temperature, relative humidity, wind speed, and rain probability.
- Real-time advisory guidance advising farmers on optimal evening/morning drip irrigation windows and harvest safety.

### 3. 📊 Mandi Market Intelligence & Price Forecasting
- Benchmark APMC mandi rates for major Indian agricultural commodities (Sharbati wheat, yellow soybean, desi tomatoes, Nashik red onions, mustard).
- Interactive Recharts 7-day to 30-day historical wholesale price charts comparing spot mandi prices against state APMC averages.
- Provider abstraction architecture ready for direct integration with Agmarknet or e-NAM feeds.

### 4. 🔗 SoilChain Provenance & QR Scanning
- Farm-to-kitchen audit trail capturing farm GPS, harvest timestamps, cold-chain temperature readings, and 0.00 PPM chemical residue lab tests.
- Camera QR scanner using device video stream to scan physical crate tags.

### 5. 🛡️ Enterprise Security & Validation
- Helmet security headers and CORS protection
- JWT-based role authorization middleware
- Server-side inventory and price re-verification preventing cart price tampering
- Resilient hybrid database layer: routes to MongoDB via Mongoose when available, while providing seamless zero-downtime in-memory persistence in development containers

---

## 🛠️ Architecture & Tech Stack

```text
Browser / Client (React 19 + TypeScript + Tailwind CSS)
            │
            ▼
Vite + Express Unified Full-Stack Gateway (Port 3000)
            │
            ├─► /api/auth       (JWT authentication & role authorization)
            ├─► /api/products   (Search, categories, inventory management)
            ├─► /api/orders     (Escrow checkout & order lifecycle)
            ├─► /api/diagnosis  (Secure multipart image upload)
            ├─► /api/market     (APMC mandi rates & trend history)
            └─► /api/admin      (Platform metrics & system diagnostics)
            │
            ├─► Google Gemini API (@google/genai TypeScript SDK)
            └─► MongoDB / Mongoose (with fallback in-memory store)
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js >= 20.x
- npm or bun
- (Optional) MongoDB 7.x (or use the built-in resilient in-memory store)

### 1. Unified Full-Stack Mode (Recommended)
Runs Express on port 3000 serving both API routes and Vite dev middleware:

```bash
# Install dependencies
npm install

# Start unified dev server
npm run dev
```

Visit: **http://localhost:3000**  
API Health Check: **http://localhost:3000/api/health**

### 2. Standalone Server Mode
To run the backend independently on port 4000:

```bash
npm run server
```

### 3. Running Backend Tests
Execute the automated test suite testing health, product creation, order validation, stock controls, and admin role authorization:

```bash
npm test
```

---

## 🐳 Docker Setup

Run frontend, backend, and MongoDB simultaneously using Docker Compose:

```bash
# Build and start services
docker-compose up --build

# Run in background
docker-compose up -d
```

Services exposed:
- **Soil Mates Application**: `http://localhost:3000`
- **Standalone Backend**: `http://localhost:4000`
- **MongoDB**: `localhost:27017`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Unified application port | `3000` |
| `BACKEND_PORT` | Standalone backend port | `4000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/soilmates` |
| `MONGODB_DB` | Database name | `soilmates` |
| `GEMINI_API_KEY` | Google Gemini API Key | *(Injected by environment or secrets)* |
| `AUTH_SECRET` | JWT signing secret | `soil-mates-super-secret-jwt-key-2026` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `VITE_API_BASE_URL` | API base URL for client | *(Empty for same-origin proxy)* |

---

## 📄 Documentation Index

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full-stack system architecture & data flows
- [API.md](./API.md) - Complete REST API specification
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guidelines
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment configuration reference
- [SECURITY.md](./SECURITY.md) - Security policies and practices

---

## 📜 License
MIT License. Built for modern agricultural ecosystems.
