# Project Roadmap & Implementation Phases
## Project: Soil Mates (सॉइल मेट्स)
**Document Version:** 2.4.0  
**Target Release Cycle:** 2026 Q1 – Q4

---

## 1. Overview & Phasing Strategy
Soil Mates is deployed across progressive, iterative development phases. The rollout balances immediate value for smallholder farmers (crop loss prevention and fair price discovery) with long-term infrastructure (blockchain traceability, cold-chain logistics, and automated B2B procurement).

```
+--------------------------------------------------------------------------+
| Phase 1: AI Agronomy Core (Completed)                                   |
| - Leaf photography, disease detection, bilingual voice narration        |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| Phase 2: Direct Marketplace & Mandi Recharts Engine (Completed)          |
| - Farmer-to-consumer store, AI price suggestions, interactive trends     |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| Phase 3: SoilChain Traceability & Live Cold-Chain (Completed)            |
| - QR provenance scan, GPS courier simulation, 5-stage milestones         |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| Phase 4: Voice Multi-Modal & WhatsApp Bot Ecosystem (In Progress)        |
| - 8-language voice query, WhatsApp photo diagnosis, SMS fallback alerts  |
+--------------------------------------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------+
| Phase 5: FPO Bulk Contracting & Kisan Micro-Credit (Upcoming)            |
| - Institutional procurement, pre-harvest credit, satellite NDVI health   |
+--------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Breakdown

### Phase 1: AI Agronomy Core & Foundation
**Status:** Completed  
**Objective:** Deliver an accurate, zero-cost crop doctor to farmers' smartphones to stop leaf blight epidemics before harvest loss occurs.

- **Milestone 1.1:** Implementation of `AiDoctorScreen` with camera viewfinder, media upload, and disease presets for Tomato, Potato, and Wheat.
- **Milestone 1.2:** Diagnostic result generation with severity indicators, pathogen classification, and biological/chemical dosage protocols.
- **Milestone 1.3:** Integration of Web Speech Synthesis for hands-free audio playback in Hindi and Indian English.
- **Milestone 1.4:** One-tap remedy ordering allowing farmers to buy exact fungicides directly.

### Phase 2: Direct Marketplace & Mandi Price Engine
**Status:** Completed  
**Objective:** Eliminate exploitative APMC intermediaries by enabling farmers to list produce directly for urban consumers and local restaurants.

- **Milestone 2.1:** Development of `HomeScreen` with responsive produce catalogs, category filters, and immediate cart management.
- **Milestone 2.2:** `SellProduceScreen` equipped with an AI Price Suggestion algorithm (Min, Optimal, Max) comparing historical APMC trends.
- **Milestone 2.3:** Implementation of `MarketScreen` with interactive **Recharts** line charts plotting 7-day closing rates against state benchmarks.
- **Milestone 2.4:** 7-Day AI forecast banners signaling whether farmers should hold or sell harvest immediately.

### Phase 3: SoilChain Blockchain Traceability & Cold-Chain Logistics
**Status:** Completed  
**Objective:** Restore consumer trust in food safety and ensure perishable produce stays below 14°C from farm to kitchen.

- **Milestone 3.1:** Development of `ProduceOriginModal` with multi-lot QR simulation, SHA-256 block hash verification, and lab residue testing (0.00 PPM).
- **Milestone 3.2:** End-to-end checkout with flexible payments (UPI, Cards, Cash on Delivery) and 5% direct farm discount logic.
- **Milestone 3.3:** Real-time logistics tracking in `TrackOrderScreen` with interactive rider calling, distance calculation, and 5-stage milestone stepper.
- **Milestone 3.4:** Comprehensive B2B `VendorHubScreen` for institutional buyers procuring 100kg+ farmer lots.

### Phase 4: Voice Multi-Modal & Omnichannel Integration
**Status:** In Progress (Current Cycle)  
**Objective:** Broaden rural adoption by eliminating typing requirements and providing zero-data fallback channels.

- **Milestone 4.1:** Multi-dialect voice assistant modal with real-time waveform animation and speech-to-intent parsing.
- **Milestone 4.2:** Complete 8-language localization covering North, West, and South Indian regional belts.
- **Milestone 4.3:** Interactive "Soil Mate Bot" chat drawer with context-aware agricultural suggestions.
- **Milestone 4.4:** WhatsApp Agronomy Gateway: enabling farmers to send leaf photos to a verified WhatsApp Business number to receive identical diagnostic reports.

### Phase 5: FPO Bulk Contracting, Weather Telematics & Micro-Financing
**Status:** Planned / Architecture Stage  
**Objective:** Scale platform throughput to regional Farmer Producer Organizations (FPOs) and institutional exporters.

- **Milestone 5.1:** Contract Farming Smart Contracts with automated escrow payouts based on quality inspection metrics.
- **Milestone 5.2:** Sentinel-2 Satellite NDVI integration to monitor crop canopy vigor and predict yield 3 weeks in advance.
- **Milestone 5.3:** Instant Kisan Micro-Credit: Working capital loans (₹15,000 – ₹50,000) sanctioned against verified future harvest listings.
- **Milestone 5.4:** Multi-mandi arbitrage logistics: Automated aggregation trucks rerouting harvest to the highest-bidding regional market.

---

## 3. Risk Assessment & Mitigation Matrix

| Risk Factor | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **Intermittent Rural Connectivity** | High | High | Offline-first Service Worker caching; local state storage of diagnostic guides and mandi prices. |
| **Pesticide Misapplication** | Critical | Low | Strict Pre-Harvest Interval (PHI) warnings and mandatory organic alternative display on every diagnosis. |
| **Cold-Chain Sensor Drift** | Medium | Medium | Redundant dual IoT probes per reefer container; auto-rejection of lots exceeding 14.5°C threshold. |
| **Price Volatility Rejection** | Medium | High | Algorithmic price bands with daily circuit limits (±15%) to prevent speculative distress dumping. |
| **Language Literacy Barriers** | High | Medium | Primary emphasis on voice input, bilingual audio narration, and iconographic UI design. |

---

## 4. Verification & QA Gateways
Every release undergoes testing against three mandatory quality gates:
1. **Linter & Type Soundness:** `npm run lint` (`tsc --noEmit`) must exit with 0 errors.
2. **Build Optimization:** `npm run build` must produce a production-ready bundle with zero unresolved dependencies.
3. **Cross-Resolution Audit:** Verification across simulated 375px mobile viewports, tablet screens, and desktop wide-screen configurations.
