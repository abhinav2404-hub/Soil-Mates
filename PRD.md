# Product Requirements Document (PRD)
## Project Name: Soil Mates (सॉइल मेट्स)
**Tagline:** Your AI Crop Doctor & Direct Agri-Marketplace  
**Status:** In Production / Active Development  
**Version:** 2.4.0  
**Target Market:** Smallholder & Marginal Farmers, Urban Consumers, Agri-Vendors, and FPOs across India (Initial focus: Madhya Pradesh, Maharashtra, Uttar Pradesh).

---

## 1. Executive Summary
Indian agriculture suffers from two primary structural inefficiencies:
1. **Severe crop disease losses** (~25-30% harvest destruction annually) due to delayed diagnosis and incorrect over-the-counter pesticide usage.
2. **Excessive middleman margins** (traditional APMC supply chains take 40-60% of consumer spend), while farmers receive depressed farmgate prices and consumers receive non-fresh, chemically exposed produce.

**Soil Mates** bridges these gaps by combining:
- **Instant AI Crop Doctor:** Computer-vision based diagnosis from a single leaf photo with immediate bilingual audio remedies and chemical dosage recommendations.
- **Direct Farmgate Marketplace:** Elimination of redundant intermediaries, connecting verified farmers directly to retail consumers and bulk food vendors.
- **SoilChain Provenance:** Cryptographically anchored blockchain traceability from farm plot to kitchen doorstep, certifying harvest time, pesticide residue (PPM), and cold-chain temperature compliance.
- **Predictive Mandi Pricing:** Real-time APMC price boards paired with 7-day AI demand forecasting to maximize farmer income.

---

## 2. Target Personas

### Persona 1: Farmer Ramesh Patel (42)
- **Location:** Sonpur Village, Vidisha, Madhya Pradesh
- **Land Holding:** 8.5 Acres (Tomatoes, Wheat, Gram)
- **Pain Points:** 
  - Suffers recurring leaf curl and early blight on tomatoes; local agrochemical stores sell expensive, generic formulations.
  - Sells to local commission agents at ₹14–18/kg while retail in Bhopal sells at ₹40/kg.
  - Low English literacy; prefers Hindi voice instructions and WhatsApp updates.
- **Needs:** Rapid diagnostic scans, spoken dosage instructions in Hindi, guaranteed 24h bank payouts, transparent mandi forecasts.

### Persona 2: Urban Consumer Priya Sharma (31)
- **Location:** Arera Colony, Bhopal, MP
- **Profile:** Health-conscious professional, parent of a young toddler.
- **Pain Points:** 
  - Skeptical about chemical pesticide residues on supermarket vegetables.
  - Disconnected from food origin; wants truly farm-fresh produce harvested the same morning.
- **Needs:** Verified organic certifications, farm origin transparency (farmer name, harvest hour), fast 2-hour doorstep delivery.

### Persona 3: Bulk Agri-Vendor Mukesh Kumar (48)
- **Location:** Karond Mandi, Bhopal
- **Profile:** Restaurant supplier & retail chain procurer (300-500 kg daily demand).
- **Pain Points:** 
  - Highly volatile procurement prices; inconsistent produce grades and rejection rates.
  - Inefficient manual truck booking and lack of temperature traceability.
- **Needs:** Bulk lot reservations, Grade A sorting guarantees, automated GST billing, verified FPO partnerships.

---

## 3. Core Functional Requirements

### 3.1 AI Crop Doctor & Field Agronomy
- **FR-1.1:** Live Camera & Photo Upload capture with support for high-resolution leaf photography.
- **FR-1.2:** Pre-trained disease recognition models for high-value staple crops (Tomato Early Blight, Wheat Leaf Rust, Potato Late Blight, etc.).
- **FR-1.3:** Diagnostic Report Output:
  - Disease classification with percentage confidence score.
  - Pathogen identification (e.g., *Alternaria solani*).
  - Urgency categorization (Immediate Action Needed, Moderate, Monitoring).
  - Detected visual symptoms checklist.
- **FR-1.4:** Step-by-Step Treatment Protocol:
  - Immediate chemical remedy (e.g., Mancozeb 75% WP @ 2.5g/L).
  - Organic/Biological remedy (e.g., Trichoderma viride, Neem oil spray @ 5ml/L).
  - Preventive cultural practices (drip sanitation, crop rotation).
- **FR-1.5:** Multi-Lingual Speech Narration:
  - Native text-to-speech audio playback in Hindi and Indian English.
  - Hands-free field advisory capability for low-literacy users.
- **FR-1.6:** Direct Agrochemical Procurement:
  - One-click "Add Medicine to Cart" directly from the diagnosis screen.

### 3.2 Direct Agri Marketplace & Seller Portal
- **FR-2.1:** Category-wise discovery (Vegetables, Fruits, Grains & Pulses, Dairy & Organic, Herbs & Spices).
- **FR-2.2:** Real-time stock, pricing per kg/bunch, farm provenance tags, and consumer reviews.
- **FR-2.3:** Farmer Listing Wizard:
  - Produce name, category, quantity, unit, harvest date.
  - AI Price Recommendation Engine (suggests Min, Optimal, and Max prices based on live APMC rates).
  - Quality grading (Grade A Export, Grade B Domestic).
  - Logistics toggle (Soil Mates Cold-Chain pickup vs. Self delivery).
  - Transparent fee breakdown (5% platform facilitation fee).
- **FR-2.4:** Instant addition to live marketplace catalog without page reload.

### 3.3 Live Mandi Intelligence & Recharts Trend Analysis
- **FR-3.1:** Integration with regional APMC mandi tickers (Karond Bhopal, Sehore, Vidisha, Indore, Berasia).
- **FR-3.2:** Interactive 7-Day Price History Line Chart powered by Recharts:
  - Dual line series: Local Mandi Closing Price vs. State APMC Average.
  - Responsive, touch-friendly interactive tooltips with verified price timestamps.
  - 7-Day High, 7-Day Low, and volatility calculations.
- **FR-3.3:** AI Predictive Forecast Signals:
  - Actionable triggers ("Hold for Peak", "Sell Now", "Stable Buy").
  - Demand index (High, Stable, Oversupply).

### 3.4 SoilChain Blockchain Provenance & Traceability
- **FR-4.1:** Cryptographic batch generation (`#BATCH-MP-2026-TM89`) with SHA-256 block hash.
- **FR-4.2:** Three-tier immutable verification view:
  1. **Transit History:** Cold-chain checkpoints with timestamps, geolocation, handler IDs, and temperature telemetry (10°C–13°C).
  2. **Farm Origin:** Farmer identity, Aadhaar verification badge, village coordinates, farm acreage, and soil classification.
  3. **Lab & Scientific Quality:** Harvest time, Brix sugar index, moisture percentage, and chemical pesticide residue PPM (0.00 PPM Jaivik Bharat benchmark).
- **FR-4.3:** QR Code Scanner Simulation:
  - Integrated camera viewfinder interface to simulate crate scanning in the field or at home.
- **FR-4.4:** Downloadable cryptographic proof certificate for export/FPO compliance.

### 3.5 Cold-Chain Logistics & Order Lifecycle
- **FR-5.1:** 5-Stage Order Pipeline:
  - Stage 1: Order Confirmed (Escrow payment verified).
  - Stage 2: Farmer Notified (Harvest packing in progress).
  - Stage 3: Pickup Completed (Reefer van aggregation).
  - Stage 4: Out for Delivery (Rider assigned with GPS simulation).
  - Stage 5: Delivered (Contactless OTP verification).
- **FR-5.2:** Real-time live tracking with rider proximity indicator and one-tap direct call trigger.

### 3.6 Multi-Modal Voice & Regional Language Localization
- **FR-6.1:** 8 Supported Indian Languages: Hindi (हिन्दी), English, Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Punjabi (ਪੰਜਾਬੀ), Bengali (বাংলা).
- **FR-6.2:** Interactive Voice Assistant modal with context-aware prompts and simulated recognition.
- **FR-6.3:** Floating "Soil Mate Bot" chat drawer with domain-specific intent recognition.

---

## 4. Non-Functional Requirements (NFRs)

| Metric | Target | Verification Method |
|---|---|---|
| **App Bundle Size** | < 450 KB gzipped | Vite production build analyzer |
| **Initial Screen Render** | < 1.2s on 4G / 3G mobile connections | Chrome Lighthouse Mobile |
| **Chart Interaction Latency** | < 16ms (60 FPS rendering) | Recharts canvas/SVG profiling |
| **Accessibility (a11y)** | WCAG 2.1 AA Compliance, high contrast ratios | Axe accessibility audit |
| **Device Support** | Responsive mobile container (360px - 480px) + full desktop toggle | Cross-device emulation |
| **Data Privacy** | Aadhaar numbers tokenized, phone numbers masked | SOC2 / DPDP Act 2023 guidelines |

---

## 5. Success Metrics & Key Performance Indicators (KPIs)
1. **Farmer Income Uplift:** +32% average net realization compared to traditional local mandi agents.
2. **Post-Harvest Loss Reduction:** Reduced to < 4% via pre-booked cold-chain pickup.
3. **Diagnosis Accuracy:** > 94% concordance with agricultural university agronomists.
4. **App Engagement:** > 4.5 average weekly sessions per farmer during active harvest season.
5. **Consumer Retention:** > 65% repeat monthly order rate for fresh bio-organic produce.
