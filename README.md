# 🌱 Soil Mates

**A mobile-first agri-tech prototype for Indian farmers, consumers, and vendors.**

Soil Mates brings crop-care guidance and farm-to-market journeys into one React app concept. The current repository contains an interactive frontend prototype built with sample data. It is useful for exploring product flows and UI; it is **not a production farming, diagnosis, marketplace, payments, logistics, or traceability service**.

> **Project status:** Early-stage prototype · First preview: v0.1.0
>
> Disease results, prices, listings, orders, delivery tracking, voice interactions, and provenance shown in the prototype may be illustrative or simulated. Do not use them to make crop-treatment, safety, or financial decisions.

## What you can explore

- **Crop-care journey:** a crop doctor interface for selecting or capturing a leaf image and viewing a diagnosis-style result.
- **Farm-to-market shopping:** produce discovery, product details, cart, and order screens.
- **Farmer and vendor workflows:** produce listing, mandi price views, and bulk procurement screens.
- **Traceability and delivery concepts:** batch-origin details, QR scanning interface, and order progress views.
- **Regional-first experience:** Hindi and English content, additional language choices, and voice/chat interface concepts.

These describe prototype screens and intended user journeys. Real-time data sources, AI accuracy, identity checks, payments, and delivery services are not guaranteed to be connected.

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Recharts, Motion, and Lucide React
- Google GenAI SDK dependency for Gemini-powered experiments

## Run locally

### Requirements

- Node.js and npm (or Bun)
- A Gemini API key only if you are working on Gemini-backed functionality

### Install and start

```bash
git clone https://github.com/abhinav2404-hub/Soil-Mates.git
cd Soil-Mates
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To install with the included Bun lockfile instead, run `bun install` and then `bun run dev`.

### Environment configuration

The repository includes [.env.example](.env.example) as a reference. Copy it to a local `.env` file and replace placeholders only when your development setup needs these values:

```bash
cp .env.example .env
```

- `GEMINI_API_KEY`: key for Gemini API experiments. Keep real keys private; never commit your `.env` file.
- `APP_URL`: host URL used by the AI Studio deployment environment.

Local UI flows may use sample data and can be explored without configuring live integrations.

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create a production bundle in `dist/` |
| `npm run preview` | Preview the built bundle locally |
| `npm run lint` | Run the TypeScript check (`tsc --noEmit`) |
| `npm run clean` | Remove build output and `server.js` |

## Project layout

```
Soil-Mates/
├── src/
│   ├── components/   # Screens and reusable interface components
│   ├── data/         # Example content used by the prototype
│   ├── App.tsx       # App shell and navigation/state
│   ├── main.tsx      # React entry point
│   └── types.ts      # Shared TypeScript types
├── PRD.md            # Product requirements and future direction
├── architecture.md   # Architecture notes
├── design.md         # Visual design specification
├── .env.example      # Environment variable template
└── package.json      # Dependencies and scripts
```

## Documentation

- [Product requirements](PRD.md)
- [Architecture](architecture.md)
- [Design system](design.md)
- [Engineering conventions](rules.md)
- [Development phases](phases.doc.md)

The requirements and roadmap include intended capabilities that may go beyond what is currently implemented in the prototype.

## Contributing

Issues, ideas, and pull requests are welcome. Please open an issue to discuss a substantial change, and follow the conventions in [rules.md](rules.md).

## License

No license is currently included. Until the repository owner adds one, all rights are reserved by default; ask the owner before reusing or redistributing this code.
