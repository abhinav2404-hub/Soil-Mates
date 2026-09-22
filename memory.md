# Project Memory & Architectural Decision Records (ADR)
## Project: Soil Mates (सॉइल मेट्स)
**Last Updated:** 2026-09-22  
**Active Lead Engineer:** Google AI Studio Coding Engine

---

## 1. Project Context & Evolution
The Soil Mates application was conceived as an end-to-end agritech solution uniting crop health diagnostics with fair-trade agricultural commerce.

- **Initial State:** The repository contained static styling tokens and fragmented component mockups.
- **Iteration 1:** Built and wired the central orchestrator (`src/App.tsx`), full state management (cart, orders, diagnoses, products), and responsive mobile container (`PhoneContainer`).
- **Iteration 2:** Integrated **Recharts** for historical APMC mandi rate trend visualization and created the **Produce Origin Modal** providing multi-checkpoint blockchain provenance.
- **Iteration 3 (Current):** Documented comprehensive engineering specifications (`PRD.md`, `architecture.md`, `rules.md`, `phases.doc.md`, `design.md`, `memory.md`) and verified system stability.

---

## 2. Architectural Decision Records (ADRs)

### ADR-001: Adoption of Recharts for Mobile Trend Graphs
- **Context:** The application required responsive, visually clear 7-day price trend lines inside constrained mobile viewport cards.
- **Decision:** Selected `recharts` (`LineChart`, `Line`, `ResponsiveContainer`, `XAxis`, `YAxis`, `Tooltip`).
- **Rationale:** 
  - Declarative React-first API that seamlessly respects dynamic state changes.
  - Native SVG rendering scales crisply on high-DPI smartphone screens without raster pixelation.
  - Support for `ResponsiveContainer` allows clean resizing between 360px mobile frames and wide-screen desktop views.
- **Consequences:** Tooltips must be custom-rendered (`CustomTooltip`) to prevent default SVG clipping on small viewports.

### ADR-002: Deterministic Union-Typed Single-Page State Routing
- **Context:** AI Studio preview environments run inside embedded sandboxed iframes where standard browser History API URL pushes can cause parent window synchronization friction or unwanted reloads.
- **Decision:** Implemented deterministic screen routing governed by `ScreenId` union type (`'s-splash' | 's-home' | 's-ai' | 's-result' | 's-market' | 's-buy' | 's-sell' | 's-cart' | 's-orders' | 's-track' | 's-vendor' | 's-profile'`).
- **Rationale:** 
  - 100% immune to 404 route errors on hard refresh.
  - Instant zero-latency transitions between views.
  - Strict type checking ensures no broken links can be introduced.

### ADR-003: Client-Side Web Speech API for Agronomy Audio
- **Context:** Rural Indian farmers frequently encounter visual text barriers in English/Hindi and need spoken audio dosage instructions in the field.
- **Decision:** Leveraged native `window.speechSynthesis` with `SpeechSynthesisUtterance` configured with `lang = 'hi-IN'`.
- **Rationale:**
  - Zero external API costs and zero server roundtrip latency.
  - Operates completely client-side.
  - Gracefully falls back if unsupported without breaking UI interactions.

### ADR-004: SoilChain Simulated Cryptographic Provenance Model
- **Context:** Real-world blockchain transactions on public EVM networks incur gas fees and latency unacceptable for quick consumer produce checks.
- **Decision:** Built a structured provenance database (`PRODUCE_TRACEABILITY_DATABASE` in `src/data/agriData.ts`) matching Ethereum smart contract event logs (batch number, block hash, sensor temperature, handler address, ISO lab certificate).
- **Rationale:** Delivers full cryptographic fidelity and realistic verification UX while remaining fast, lightweight, and offline-compatible.

### ADR-005: CSS Design Tokens & Anti-AI Slop Constitution
- **Context:** Agritech applications often suffer from either cold, sterile corporate styling or illegible chaotic interfaces.
- **Decision:** Mandated warm earth tones (`--soil`, `--leaf`, `--cream`, `--amber`) paired with `Fraunces` serif and `DM Sans`.
- **Rationale:** Establishes strong brand authenticity, high outdoor sunlight contrast, and an empathetic visual language rooted in Indian agricultural soil.

---

## 3. Key Domain Constants & Seed References

### 3.1 Traceability Batches
| Crop | Produce ID | Batch Number | Block Hash | Key Farmer |
|---|---|---|---|---|
| **Desi Tomatoes** | `prod-1` | `#BATCH-MP-2026-TM89` | `0x7f9a2b84c1e90d...` | Ramesh Patel (Vidisha) |
| **Palak Spinach** | `prod-2` | `#BATCH-MP-2026-PL42` | `0x3c990a41d8e7b1...` | Sunita Devi (Berasia) |
| **Aloo Potatoes** | `prod-3` | `#BATCH-MP-2026-AL10` | `0x1d449a02fcb881...` | Vijay Kumar (Sehore) |
| **Red Onions** | `prod-4` | `#BATCH-MP-2026-ON33` | `0x5e221b04fcb881...` | Lakshmi Farms (Hoshangabad) |
| **Sharbati Wheat** | `prod-6` | `#BATCH-MP-2026-WH90` | `0x88d90a02fcb881...` | Kailash Chouhan (Sehore) |

### 3.2 APMC Mandi Identifiers
- `Karond Mandi, Bhopal` (Primary urban wholesale benchmark)
- `Sehore Krishi Upaj Mandi` (Grain & Wheat benchmark)
- `Vidisha Mandi` (Vegetable & Pulse benchmark)
- `Indore Mandi` (State commercial hub)

---

## 4. Developer Onboarding & Quick Notes
1. **Running Linter:** Run `npm run lint` or call `lint_applet` before pushing changes.
2. **Adding a New Screen:**
   - Add new screen ID to `ScreenId` union in `src/types.ts`.
   - Create screen component in `src/components/MyNewScreen.tsx`.
   - Wire route rendering in `src/App.tsx`.
   - Update `BottomNav.tsx` if it requires a persistent tab icon.
3. **Modifying Color Themes:** Update `:root` tokens in `src/index.css` to ensure universal propagation across all components.
