# Operational & Engineering Rules
## Project: Soil Mates (सॉइल मेट्स)
**Rulebook Version:** 2.4.0  
**Enforcement Level:** Mandatory across all code, designs, and agronomic recommendations.

---

## 1. Codebase & Engineering Standards

### 1.1 TypeScript Strictness
- **Rule 1.1.1 (No `any` Escapes):** All interfaces must be explicitly declared in `src/types.ts`. Do not use `any` unless interacting with untyped legacy third-party APIs, and even then, narrow it immediately with type guards.
- **Rule 1.1.2 (Union Discriminators for Navigation):** All screens must belong to the `ScreenId` union type (`'s-splash' | 's-home' | 's-market' | ...`). Never pass unconstrained string literals to `onNavigate`.
- **Rule 1.1.3 (Immutable State Updates):** State setters in `App.tsx` and child screens must use immutable array/object updates (`[...prev, newItem]` or `prev.map(...)`). Never mutate state arrays in-place.

### 1.2 Component Design
- **Rule 1.2.1 (Self-Contained Functional Components):** Components must be functional and declare strict typed props interfaces (`interface ComponentProps { ... }`).
- **Rule 1.2.2 (Single Responsibility):** Keep screen components focused on view presentation and delegate shared workflows (order creation, cart mutations, toast triggers) to handlers passed down from `App.tsx`.
- **Rule 1.2.3 (DOM Safety & SSR Readiness):** Always guard browser-only APIs (`window.speechSynthesis`, `navigator.mediaDevices`, `navigator.clipboard`) with `typeof window !== 'undefined'` checks before invoking.

---

## 2. Design System & UI Discipline

### 2.1 Color Palette & CSS Variables
All styling must strictly leverage the defined CSS design tokens in `src/index.css`:
- **Soil Brown (`--soil` / `#2C1810`):** Reserved for primary navigation bars, dark hero headers, and authority cards.
- **Leaf Green (`--leaf` / `#2D6A2D` & `--leaf2` / `#1E4D1E`):** Used for primary CTAs, success states, verified badges, and biological indicators.
- **Cream Warmth (`--cream` / `#F7F2EA` & `--cream2` / `#EFE7D8`):** Base canvas background across all screens to ensure zero harsh-white glare in outdoor sunlight.
- **Amber Gold (`--amber` / `#D97706`):** Reserved for active in-transit delivery states, price alerts, and high-demand indicators.
- **Coral Warning (`--coral` / `#C84B31`):** Strictly reserved for urgent crop disease alerts and high chemical residue warnings.

### 2.2 Typography Rules
- **Display & Headings:** `font-serif-soil` (`Fraunces`, serif) for all screen titles, crop names, and financial totals.
- **Body & UI Elements:** `DM Sans`, sans-serif for body copy, buttons, labels, and forms.
- **Code & Blockchain Hashes:** Standard monospace (`font-mono`) with truncation (`...`) and click-to-copy functionality.

### 2.3 Mobile Viewport Discipline
- The application must always remain fully operational within the simulated mobile container (`PhoneContainer`) on desktop screens, while scaling cleanly to full mobile devices without horizontal scrolling (`overflow-x-hidden`).
- All scrollable lists must utilize `.no-scrollbar` to maximize usable screen real estate.

---

## 3. Agronomic Safety & Dosage Compliance

### 3.1 Medical & Chemical Advisory Rules
- **Rule 3.1.1 (Pre-Harvest Interval - PHI):** Any chemical recommendation must explicitly state the minimum days between spraying and harvest (e.g., *Mancozeb requires a minimum 3-day withholding period before picking*).
- **Rule 3.1.2 (Organic-First Prioritization):** The AI Crop Doctor must always display the biological / organic alternative alongside any chemical fungicide.
- **Rule 3.1.3 (Dilution Accuracy):** Chemical dosages must always be specified in exact units (e.g., `2.5 grams per 1 Liter of clean water` or `5 ml Neem Oil per 1 Liter with mild soap emulsion`). Never use vague terms like "a few spoonfuls".
- **Rule 3.1.4 (Toxicity Warnings):** Recommendations for Class II or Class III agrochemicals must include standard protective equipment warnings (mask, gloves, spray in downwind direction).

---

## 4. Blockchain & SoilChain Provenance Rules

### 4.1 Ledger Integrity
- **Rule 4.1.1 (Batch Format Standardization):** All batch identifiers must adhere to `#BATCH-[STATE]-[YEAR]-[CROP_CODE][RANDOM_ID]` (e.g., `#BATCH-MP-2026-TM89`).
- **Rule 4.1.2 (Hash Authenticity):** Hashes must be simulated 40-character hexadecimal strings prefixed with `0x`.
- **Rule 4.1.3 (Temperature Thresholds):** 
  - Standard fresh vegetables (Tomatoes, Palak, Gourds): Optimal range is **8.0°C to 12.5°C**.
  - Warning threshold: Any reading above **14.0°C** must flag a cold-chain deviation.
- **Rule 4.1.4 (Pesticide Residue Limits):** Products labeled "100% Bio-Organic" must have an independently tested chemical residue of **0.00 PPM**. Products with residue > 0.05 PPM cannot be listed under the Organic filter.

---

## 5. Marketplace & Financial Rules

### 5.1 Fair Pricing & Commission
- **Platform Fee:** Capped strictly at **5.0%** of gross order value. No hidden listing fees or commission deductions for farmers.
- **Payout Settlement SLA:** Direct bank / UPI transfer to farmer account within **24 hours** of successful OTP delivery.
- **Consumer Free Delivery:** Automatically unlocked on all retail baskets above **₹120 / ₹199**.

### 5.2 Produce Listing Validation
- Minimum produce quantity for retail listing: **1 unit** (1 kg, 1 bunch, or 1 liter).
- Mandatory harvest timestamp: Produce listed as "Fresh Morning Harvest" must have been plucked within the last **12 hours**.

---

## 6. Language & Accessibility Rules

- **Audio Playback:** Every diagnostic report must offer one-tap bilingual audio narration.
- **Voice Queries:** Voice search modals must support spoken queries in both formal and colloquial Indian dialects (e.g., Hindi, Hinglish, Marathi).
- **Offline Resilience:** Previously loaded mandi rates and diagnostic history must remain readable from local memory when data connectivity drops in rural field zones.
