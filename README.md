<!-- Project badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Version-v0.1.0-2f855a" alt="Version 0.1.0 preview" />
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-149eca" alt="React 19 and TypeScript" />
  <img src="https://img.shields.io/badge/Build-Vite-646cff" alt="Vite" />
  <img src="https://img.shields.io/badge/Status-Prototype-f6ad55" alt="Prototype" />
</p>

<h1 align="center">🌱 Soil Mates</h1>

<p align="center"><strong>Your crop-care companion and farm-to-market prototype.</strong></p>

<p align="center">A mobile-first app concept for Indian farmers, consumers, and agri-vendors to explore crop-care, produce discovery, market information, and food traceability in one place.</p>

<p align="center">
  <a href="#what-is-soil-mates">Overview</a> ·
  <a href="#how-the-app-flows">App flow</a> ·
  <a href="#try-a-demo-flow">Usage example</a> ·
  <a href="#run-locally">Run locally</a>
</p>

> **Project status:** early-stage interactive frontend prototype. The current UI uses sample data and simulated journeys. Live diagnosis, market feeds, payments, logistics, and provenance services are not guaranteed to be connected. Treat all displayed advice and figures as illustrative.

## What is Soil Mates?

Soil Mates explores how one simple mobile experience could support people across the food journey. Farmers can explore crop-care and selling concepts, consumers can browse produce, and vendors can review bulk procurement flows. The project focuses on making these journeys understandable and accessible on mobile devices.

This repository contains a React web prototype, not a production mobile app or a live marketplace.

## At a glance

| 🌿 Crop care | 🧺 Farm to market | 📊 Market tools | 🔎 Traceability |
| --- | --- | --- | --- |
| Diagnosis-style photo flow and treatment screen concepts | Produce discovery, details, cart, and orders | Mandi trend and farmer listing interfaces | Batch-origin, QR, and delivery-tracking concepts |

These are prototype screens. Some actions and data are demonstrations rather than connected services.

## How the app flows

The diagram shows the main journeys a visitor can explore in the prototype:

~~~mermaid
flowchart LR
    A[Open app] --> B{Choose a role}
    B --> F[Farmer]
    B --> C[Consumer]
    B --> V[Vendor]
    F --> D[Crop doctor demo]
    F --> M[Mandi and selling screens]
    D --> R[View sample result]
    C --> P[Browse produce]
    P --> O[Cart and sample order]
    V --> W[Bulk order screens]
    R --> T[Traceability screens]
    O --> T
~~~

### Prototype data flow

~~~mermaid
flowchart LR
    USER[User] --> APP[React app]
    APP --> SCREENS[App screens]
    SCREENS --> DATA[Sample data]
    SCREENS --> AI[Optional Gemini API]
    DATA --> RESULT[Demo result]
    AI --> RESULT
~~~

The Gemini SDK is included as a dependency for AI experiments. Availability and behavior depend on the configured key and implementation; the demo should not be treated as a validated agronomy service.

## Features you can explore

- **Crop doctor interface:** select or capture a plant image and view a diagnosis-style result.
- **Produce marketplace:** browse categories, open product details, add items to a cart, and view order screens.
- **Farmer selling flow:** explore produce listing and suggested price interfaces.
- **Mandi intelligence:** view sample price cards and trend charts.
- **Vendor hub:** explore bulk procurement screens.
- **Traceability concepts:** inspect batch-origin details, QR scanning, and delivery progress interfaces.
- **Regional interface concepts:** Hindi and English content, additional language selection, and voice/chat screens.

## Try a demo flow

After starting the development server, try this example to understand the interface:

1. Open the app in your browser and enter the consumer experience.
2. Browse a produce category, open a product card, and review its detail and origin information.
3. Add a product to the cart, then open the cart and order screens to follow the sample checkout journey.
4. Return to the main navigation and explore the mandi, crop doctor, farmer selling, or vendor screens.
5. In the crop doctor screen, choose a demo image or use the image picker and inspect the diagnosis-style result.

The values and results in this walkthrough may be seeded demo data. Do not use diagnosis text or price suggestions to make real farming or purchasing decisions.

## Tech stack

| Layer | Technology | Role |
| --- | --- | --- |
| UI | React 19, TypeScript | Component-based, typed web interface |
| Development and build | Vite 8 | Local server and production bundle |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Charts | Recharts | Mandi price visualizations |
| Motion | Motion | Interface transitions and animation |
| Icons | Lucide React | Interface icon set |
| AI experiments | Google GenAI SDK | Gemini integration experiments |
| Optional server dependency | Express | Server-side integration work |

## Run locally

### Requirements

- Node.js and npm, or Bun
- A Gemini API key only if you are developing or trying Gemini-backed functionality

### Install and start

~~~bash
git clone https://github.com/abhinav2404-hub/Soil-Mates.git
cd Soil-Mates
npm install
npm run dev
~~~

Open [http://localhost:3000](http://localhost:3000). To use the included Bun lockfile instead, run:

~~~bash
bun install
bun run dev
~~~

### Environment variables

The repository includes [.env.example](.env.example). Copy it to a local .env file and add values only when your local setup needs them:

~~~bash
cp .env.example .env
~~~

- GEMINI_API_KEY: used by Gemini API experiments. Keep your key private and never commit .env.
- APP_URL: the app URL used by the AI Studio deployment environment.

Local screens that use sample data can be explored without live integrations.

### Available commands

| Command | Purpose |
| --- | --- |
| npm run dev | Start the development server on port 3000 |
| npm run build | Build the app with Vite |
| npm run preview | Preview the production build locally |
| npm run lint | Run the TypeScript check |
| npm run clean | Remove generated build artifacts and server.js |

## Project structure

~~~text
Soil-Mates/
├── src/
│   ├── components/       # App screens and reusable UI components
│   ├── data/             # Sample products, orders, and demo content
│   ├── App.tsx           # Application shell and shared state
│   ├── main.tsx          # React entry point
│   ├── types.ts          # Shared TypeScript types
│   └── index.css         # Global styles and design tokens
├── .env.example          # Environment variable template
├── PRD.md                # Product requirements and future direction
├── architecture.md       # Architecture and data-flow notes
├── design.md             # Visual design system
├── rules.md              # Engineering conventions
└── package.json          # Dependencies and scripts
~~~

## Project documents

- [Product requirements](PRD.md)
- [Architecture](architecture.md)
- [Design system](design.md)
- [Engineering conventions](rules.md)
- [Development phases](phases.doc.md)

The roadmap may describe capabilities beyond what is currently implemented in the prototype.

## License

This repository does not currently include a LICENSE file. **No open-source license has been granted.** Until the owner adds one, the default copyright applies; contact the repository owner before copying, modifying, or redistributing the code.

## Contributing

Bug reports, ideas, and pull requests are welcome. Please open an issue to discuss larger changes and follow the conventions in [rules.md](rules.md).

## Release

The first preview is [v0.1.0](https://github.com/abhinav2404-hub/Soil-Mates/releases/tag/v0.1.0). It is a source-code preview; no separate installer is provided.
