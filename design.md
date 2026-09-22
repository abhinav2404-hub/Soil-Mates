# Design System & UI Specification
## Project: Soil Mates (सॉइल मेट्स)
**Design System Version:** 2.4.0  
**Design Philosophy:** "Rooted in the Soil, Powered by Intelligence"  
**Target Environment:** High-sunlight outdoor field usage + clean urban commerce.

---

## 1. Brand Identity & Visual Language
Soil Mates balances the warmth of rural Indian agriculture with the precision of modern agricultural technology. 

- **Organic Warmth:** Earthy clay, sun-warmed cream, rich loam soil, and fresh chlorophyll green replace harsh corporate blues and clinical greys.
- **Anti-AI Slop:** Zero generic glossy gradients, zero floating pills without purpose, and no sterile tech clichés. Every UI element reflects agricultural utility and human craftsmanship.
- **Sunlight Legibility:** High-contrast text, clear borders, and non-glare cream backgrounds engineered specifically for farmers reading screens under bright outdoor sunlight.

---

## 2. Color Palette & Token Architecture

The design system is governed by CSS variables defined in `src/index.css`:

### 2.1 Core Palette Tokens
```css
:root {
  /* Loam & Earth */
  --soil: #2C1810;          /* Deep rich earth; primary headers, prominent buttons */
  --soil2: #3E2419;         /* Secondary warm earth */
  --soil3: #5C3828;         /* Border accents, secondary text */

  /* Chlorophyll & Growth */
  --leaf: #2D6A2D;          /* Primary vibrant green; CTAs, success states, verified badges */
  --leaf2: #1E4D1E;         /* Deep forest green; text headings on pale backgrounds */
  --leaf-pale: #EAF4EA;     /* Gentle leaf tint; card fills, badge backgrounds */

  /* Clay & Sunlight */
  --cream: #F7F2EA;         /* Main viewport canvas; soft, anti-glare backdrop */
  --cream2: #EFE7D8;        /* Input backgrounds, card wells, secondary buttons */
  --border: #DDD0BC;        /* Warm tactile divider lines */

  /* Semantic Alerts */
  --amber: #D97706;         /* Harvest gold; active delivery, peak price warnings */
  --amber-pale: #FEF3C7;    /* Warning container fill */
  --coral: #C84B31;         /* Emergency red/orange; severe crop disease, toxic pests */
  --coral-pale: #FEE2E2;    /* Disease alert banner background */

  /* Neutral Base */
  --white: #FFFFFF;
  --text: #1C1510;          /* Primary high-contrast text */
  --text2: #3D2E24;         /* Subheadings, secondary copy */
  --text3: #665D4F;         /* Timestamps, metadata, unit labels */
}
```

### 2.2 Dark Mode System
When dark mode is activated (`document.body.classList.contains('dark-mode')`):
- `--cream` transitions to `#14100C` (charcoal humus).
- `--cream2` transitions to `#1E1813`.
- `--white` transitions to `#251E17`.
- Text tokens invert to soft parchment tints (`#EDD9B8` and `#C9BEB0`), minimizing battery drain on OLED mobile displays while preventing eye fatigue during night farming shifts.

---

## 3. Typography Hierarchy

The design system pairs an expressive, organic serif with a clean, modern sans-serif:

```
+-------------------------------------------------------------------------+
| Display & Hero Headers: Fraunces (Google Fonts Serif)                    |
| - Optical weights: 700 (Bold) / 800 (Extra Bold) / 900 (Black)          |
| - Used for: App branding, screen titles, produce names, financial sums  |
+-------------------------------------------------------------------------+
| Body, UI Controls & Numbers: DM Sans (Google Fonts Sans-Serif)          |
| - Weights: 400 (Regular) / 500 (Medium) / 700 (Bold)                    |
| - Used for: Paragraphs, buttons, pricing units, form fields             |
+-------------------------------------------------------------------------+
| Technical & Cryptographic: Standard Monospace (font-mono)                |
| - Used for: Blockchain transaction hashes, batch IDs, IoT temperature   |
+-------------------------------------------------------------------------+
```

### Typographic Scale
- **H1 Display:** `font-serif-soil text-2xl font-black` (24px, 1.2 line-height)
- **H2 Section:** `font-serif-soil text-lg font-extrabold` (18px)
- **H3 Card Title:** `font-serif-soil text-sm font-bold` (14px)
- **Body Standard:** `text-xs font-medium` (12px, 1.5 line-height)
- **Meta / Microcopy:** `text-[10px] font-semibold` (10px)

---

## 4. Component Anatomy & UI Patterns

### 4.1 PhoneContainer Anatomy
- **Mobile Simulated Frame:** Constrained to `max-w-[420px]` with rounded bezels (`rounded-[36px]`), drop shadow (`shadow-2xl`), and internal overflow containment.
- **Top Header Bar:** 48px height with deep earth background (`--soil`), gold typography (`#EDD9B8`), back arrow navigation, and right-hand contextual action.
- **Scrollable Viewport:** `flex-1 overflow-y-auto no-scrollbar` to deliver a fluid native mobile application feel without intrusive desktop scrollbars.
- **Sticky Bottom Navigation:** 5-tab layout (`Home`, `Doctor`, `Market`, `Orders`, `Profile`) with active tab indicators, icons from `lucide-react`, and badge counters.

### 4.2 Produce Marketplace Card
- **Iconography:** Large, friendly produce emoji on a subtle circular background.
- **Verified Origin Tag:** `🌱 Ramesh Patel · Sonpur` to foster emotional farmer-buyer connection.
- **Price Tag:** Prominent green figure (`₹32/kg`) with crossed-out retail supermarket comparison.
- **Quick Action:** Prominent green `+ Add` button with immediate tactile scale feedback (`active:scale-95`).

### 4.3 Recharts Historical Chart Styling
- **Canvas Container:** Rounded card with subtle warm border and soft background well (`--cream2`).
- **Data Series 1:** Forest Green line (`#2D6A2D`, strokeWidth: 2.5) with white-ringed circular node markers.
- **Data Series 2:** Amber Dashed line (`#D97706`, strokeDasharray: "4 4") representing the APMC benchmark.
- **Custom Tooltip:** Deep earth card (`--soil`), golden dates, white rates, and zero default SVG clipping.

### 4.4 Produce Origin & Blockchain Modal
- **Lot Quick Chips:** Horizontal carousel allowing instant inspection of different harvest lots (Tomato, Palak, Potato, Onion, Wheat).
- **Scanner Viewfinder:** Dark HUD simulating a camera sensor with laser alignment bar and pulsating target reticle.
- **Milestone Stepper:** Vertical connecting rod with green checkmark circles for completed waypoints, pulsing amber for active transit, and grey for pending delivery.

---

## 5. Micro-Interactions & Animation Standards

1. **Pulsing Voice Microphone:** Animated radial aura ring (`@keyframes pulse`) when voice query recording is active.
2. **Tactile Button Press:** Every interactive button includes `transition-transform active:scale-95` to provide immediate feedback on touchscreens.
3. **Animated Live GPS Truck:** Simulated moving transit vehicle with subtle bounce on the order tracking map.
4. **Toast Feedback:** Slide-up floating pill with backdrop blur and auto-dismiss timer (2200ms).
