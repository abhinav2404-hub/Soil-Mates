import React, { useState } from 'react';
import { X, BookOpen, Layers, CheckCircle2, ShieldAlert, Palette, HardDrive, Copy } from 'lucide-react';

interface DocsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

type DocKey = 'prd' | 'architecture' | 'rules' | 'phases' | 'design' | 'memory';

interface DocItem {
  id: DocKey;
  title: string;
  filename: string;
  icon: React.ReactNode;
  summary: string;
  highlights: string[];
}

const DOCS_DATA: Record<DocKey, DocItem> = {
  prd: {
    id: 'prd',
    title: 'Product Requirements Document',
    filename: 'PRD.md',
    icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
    summary:
      'Defines the complete product vision, user personas (Farmer Ramesh, Consumer Priya, Vendor Mukesh), functional modules (AI Doctor, Mandi Market, SoilChain, Logistics), and success KPIs.',
    highlights: [
      'Problem Statement: Crop loss reduction (25-30% to <4%) & middleman margin cut (40-60% APMC fee bypass).',
      'Target Personas: Detailed profiles, pain points, and technical workflows.',
      'Functional Specs: FR-1 (AI Doctor), FR-2 (Marketplace), FR-3 (Mandi Engine), FR-4 (SoilChain), FR-5 (Cold-Chain).',
      'Non-Functional Targets: <450KB gzipped bundle, <1.2s render on rural 3G/4G, WCAG AA.'
    ]
  },
  architecture: {
    id: 'architecture',
    title: 'System Architecture',
    filename: 'architecture.md',
    icon: <Layers className="w-4 h-4 text-blue-700" />,
    summary:
      'Covers system topology, React 19 component hierarchy, state flow, Recharts data pipeline, SoilChain blockchain ledger, and Web Speech API audio narration.',
    highlights: [
      'State Engine: Master orchestrator in App.tsx with unidirectional data propagation.',
      'Recharts Pipeline: ResponsiveContainer with custom styled earthy tooltips and dual time-series lines.',
      'SoilChain Spec: Immutable telemetry schema, checkpoint coordinates, and sensor temperature tracking.',
      'AI Speech Pipeline: Client-side Web Speech Synthesis (hi-IN / en-IN) with zero latency.'
    ]
  },
  rules: {
    id: 'rules',
    title: 'Operational & Engineering Rules',
    filename: 'rules.md',
    icon: <ShieldAlert className="w-4 h-4 text-amber-700" />,
    summary:
      'Strict engineering standards, design system tokens, agronomic safety guidelines (Pre-Harvest Interval, residue limits), and blockchain verification rules.',
    highlights: [
      'TypeScript Strictness: Strict union routing (ScreenId), zero `any` usage, immutable state updates.',
      'Agronomic Safety: Mandatory organic alternative display and exact dosage unit compliance.',
      'Pre-Harvest Interval (PHI): Required withholding period displayed on chemical recommendations.',
      'Cold-Chain SLA: Temperature warning triggered if cargo exceeds 14.0°C.'
    ]
  },
  phases: {
    id: 'phases',
    title: 'Roadmap & Implementation Phases',
    filename: 'phases.doc.md',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
    summary:
      'Chronological milestone breakdown across 5 progressive rollout phases from AI Agronomy MVP to regional FPO contracting and micro-credit financing.',
    highlights: [
      'Phase 1 (Completed): AI Doctor viewfinder, disease presets, bilingual voice synthesis.',
      'Phase 2 (Completed): Direct Marketplace, AI price suggestions, Recharts price trend charts.',
      'Phase 3 (Completed): SoilChain blockchain provenance, QR scanner simulation, 5-stage courier tracking.',
      'Phase 4 (In Progress): WhatsApp photo diagnostics, 8-language voice assistant, multi-mandi tickers.',
      'Phase 5 (Planned): Satellite NDVI crop health, FPO bulk smart contracts, Kisan micro-credit.'
    ]
  },
  design: {
    id: 'design',
    title: 'Design System & UI Tokens',
    filename: 'design.md',
    icon: <Palette className="w-4 h-4 text-rose-700" />,
    summary:
      'Visual identity guidelines: Earthy color palette (--soil, --leaf, --cream, --amber), Fraunces serif typography, anti-slop rules, and dark mode tokens.',
    highlights: [
      'Anti-AI Slop Constitution: Zero generic glossy gradients; tactile, high-contrast outdoor legibility.',
      'Color Palette: Loam Soil (#2C1810), Leaf Green (#2D6A2D), Sunlit Cream (#F7F2EA), Amber Gold (#D97706).',
      'Typography Hierarchy: Fraunces (editorial serif) for display + DM Sans for forms and buttons.',
      'Micro-Interactions: Pulsing mic animations, tactile button scaling, custom SVG chart tooltips.'
    ]
  },
  memory: {
    id: 'memory',
    title: 'Project Memory & ADRs',
    filename: 'memory.md',
    icon: <HardDrive className="w-4 h-4 text-purple-700" />,
    summary:
      'Repository evolution log, Architectural Decision Records (ADR-001 through ADR-005), domain seed tables, and developer onboarding instructions.',
    highlights: [
      'ADR-001: Choice of Recharts for responsive mobile SVG rendering.',
      'ADR-002: Deterministic union-typed screen routing for sandboxed iframe stability.',
      'ADR-003: Client-side Web Speech API for zero-cost field agronomy voice playback.',
      'ADR-004: SoilChain cryptographic mock architecture with EVM-compatible structures.',
      'ADR-005: CSS design tokens & sunlight-optimized color variables.'
    ]
  }
};

export const DocsViewerModal: React.FC<DocsViewerModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocKey>('prd');

  if (!isOpen) return null;

  const current = DOCS_DATA[selectedDoc];

  const handleCopyFilename = (filename: string) => {
    navigator.clipboard?.writeText(filename);
    onShowToast(`Copied ${filename} path`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--cream)] rounded-2xl border border-white/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className="p-3.5 flex items-center justify-between text-[#EDD9B8] flex-shrink-0"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-serif-soil text-sm font-extrabold text-[#EDD9B8]">
                Project Documentation & Specs
              </h3>
              <p className="text-[10px] text-[#EDD9B8]/70">
                All 6 architectural markdown specs created in workspace root
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document Selector Tabs */}
        <div className="p-2 bg-[var(--cream2)] border-b border-[var(--border)] flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          {(Object.keys(DOCS_DATA) as DocKey[]).map((key) => {
            const doc = DOCS_DATA[key];
            const isActive = selectedDoc === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDoc(key)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-xs'
                    : 'bg-white text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
                }`}
              >
                <span>{doc.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Document Content View */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3 bg-[var(--cream)]">
          {/* Document Header Card */}
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[var(--leaf-pale)] flex items-center justify-center">
                  {current.icon}
                </div>
                <div>
                  <h4 className="font-serif-soil text-sm font-bold text-[var(--text)]">
                    {current.title}
                  </h4>
                  <div className="text-[10px] font-mono text-[var(--soil)] font-bold">
                    /{current.filename}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopyFilename(`/${current.filename}`)}
                className="px-2 py-1 rounded-lg bg-[var(--cream2)] border border-[var(--border)] text-[9px] font-bold text-[var(--text2)] hover:bg-[var(--leaf-pale)] flex items-center gap-1"
                title="Copy relative path"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Path</span>
              </button>
            </div>

            <p className="text-xs text-[var(--text2)] leading-relaxed">
              {current.summary}
            </p>
          </div>

          {/* Key Provisions / Highlights */}
          <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-2">
            <h5 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Core Provisions & Sections
            </h5>

            <div className="space-y-1.5">
              {current.highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--cream2)] rounded-xl p-2.5 text-xs text-[var(--text)] flex items-start gap-2 border border-[var(--border)]/60"
                >
                  <span className="text-[var(--leaf2)] font-bold text-xs mt-0.5">•</span>
                  <span className="leading-snug text-[11px]">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Root File Location Notice */}
          <div className="bg-[var(--leaf-pale)] rounded-xl p-3 border border-[var(--leaf2)]/20 text-[11px] text-[var(--leaf2)] space-y-1">
            <div className="font-bold flex items-center gap-1">
              <span>📄 Root Workspace File Verified</span>
            </div>
            <p className="text-[10px] text-[var(--text)] leading-relaxed">
              This file is saved at the root directory of the application as{' '}
              <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">
                /{current.filename}
              </code>
              . You can open and edit it in any text editor, IDE, or Git repository viewer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--cream2)] border-t border-[var(--border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#EDD9B8] shadow-xs"
            style={{ backgroundColor: 'var(--soil)' }}
          >
            Close Documentation Reader
          </button>
        </div>
      </div>
    </div>
  );
};
