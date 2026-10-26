import type { DiagramId } from "@/content/types";

/**
 * Diagram specs. Diagrams are data, rendered by `Diagram.tsx` as accessible
 * HTML (real text, readable at any width). Encodings, never colour:
 *   solid   a normal stage           filled  a key output or gate
 *   dashed  optional / degradable    muted   input or context
 */
export type NodeStyle = "solid" | "dashed" | "filled" | "muted";

export interface FlowNode {
  title: string;
  detail?: string;
  style?: NodeStyle;
}

export interface FlowRow {
  nodes: FlowNode[];
  /** Nodes in this row run one after another rather than side by side. */
  seq?: boolean;
  /** Label on the connector leading into this row. */
  via?: string;
  /** Rows sharing a group name are boxed together with this label. */
  group?: string;
  /** Render this row as a loop-back note instead of nodes. */
  loop?: string;
}

export type DiagramSpec =
  | { kind: "flow"; rows: FlowRow[] }
  | {
      kind: "segments";
      /** Proportional bar, e.g. a timeline or a time budget. */
      unit: string;
      segments: { label: string; value: number; detail: string; style: NodeStyle }[];
      footnote?: string;
    };

const PREREG = "Pre-registered: frozen and hashed before the evaluation period was opened";
const IMAGES = "Images, without downloading the archive";

export const diagrams: Record<DiagramId, DiagramSpec> = {
  "refused-chain": {
    kind: "flow",
    rows: [
      {
        nodes: [
          { title: "Grid-India", detail: "Daily PSP reports, deviation and price files", style: "muted" },
          { title: "CEA", detail: "Conventional and renewable generation, CO₂ factors", style: "muted" },
          { title: "IMD", detail: "Gridded rainfall and temperature", style: "muted" },
        ],
      },
      { nodes: [{ title: "Acquisition", detail: "18,233 files, each with URL, time, size and SHA-256" }] },
      { nodes: [{ title: "State-day panel", detail: "104,550 × 107, rebuilt and hash-checked", style: "filled" }] },
      { nodes: [{ title: "Information set", detail: "Each source enters only after its measured publication delay" }], via: "lagged" },
      {
        group: PREREG,
        nodes: [
          { title: "Forecasters", detail: "Trees, deep nets, Chronos; combined per target" },
          { title: "Calibration", detail: "Quantiles and split-conformal intervals" },
        ],
      },
      { group: PREREG, nodes: [{ title: "Scheduling rules", detail: "Median, fixed risk, coupled risk, copula scenarios, PPO" }] },
      { group: PREREG, nodes: [{ title: "Settlement regret", detail: "516 held-out days, 34 control areas", style: "filled" }] },
      { nodes: [{ title: "Integrity audit", detail: "Hashes match; re-scoring reproduces 35 of 52", style: "dashed" }] },
    ],
  },
  "refused-splits": {
    kind: "segments",
    unit: "months",
    segments: [
      { label: "Train", value: 60, detail: "Apr 2018 – Mar 2023", style: "solid" },
      { label: "Validation", value: 12, detail: "FY 2023–24", style: "muted" },
      { label: "Dev test", value: 12, detail: "FY 2024–25", style: "dashed" },
      { label: "Reserved", value: 17, detail: "Apr 2025 – Aug 2026, locked", style: "filled" },
    ],
    footnote: "Widths are proportional to time. The reserved period was opened once, after the pre-registration hash was recorded.",
  },
  "refused-correction": {
    kind: "flow",
    rows: [
      {
        nodes: [
          { title: "Base forecast B", detail: "Any forecaster: naive, LightGBM, N-HiTS, Chronos" },
          { title: "Correction r", detail: "Learned from B's own recent errors", style: "dashed" },
        ],
      },
      { nodes: [{ title: "Gate g", detail: "One number, or one per series, hour, instance or day" }], via: "scale" },
      { nodes: [{ title: "Corrected forecast", detail: "B + g · r", style: "filled" }] },
    ],
  },
  "er-pipeline": {
    kind: "flow",
    rows: [
      {
        nodes: [
          { title: "Source 1", detail: "1.73M reference businesses", style: "muted" },
          { title: "Sources 2 and 3", detail: "About 10M noisy records", style: "muted" },
        ],
      },
      { nodes: [{ title: "Normalisation", detail: "Learned transliteration, legal forms, OCR fixes, states" }] },
      {
        nodes: [
          { title: "TF-IDF sparse search", detail: "Name and address n-grams, GPU top-k" },
          { title: "n-gram bi-encoder", detail: "InfoNCE, 256-d, GPU top-k" },
        ],
        via: "blocking per country",
      },
      { nodes: [{ title: "Candidate pairs", detail: "About 85M, recall 0.988", style: "filled" }] },
      { nodes: [{ title: "Stage 1: XGBoost", detail: "About 100 pair features, cross-fitted, blended" }] },
      {
        nodes: [
          { title: "XLM-RoBERTa", detail: "Cross-encoder on raw text", style: "dashed" },
          { title: "bge-reranker", detail: "Cross-encoder", style: "dashed" },
        ],
        via: "uncertain pairs only",
      },
      { nodes: [{ title: "Collective rounds", detail: "An entity's other records vote" }] },
      { nodes: [{ title: "Decoder", detail: "Isotonic calibration, expected F0.5, source caps", style: "filled" }] },
    ],
  },
  "orbit-graph": {
    kind: "flow",
    rows: [
      { nodes: [{ title: "Research planner", detail: "Question to a structured plan" }] },
      { nodes: [{ title: "Market data", detail: "Prices; validated universe" }] },
      {
        seq: true,
        nodes: [
          { title: "Macro", style: "dashed" },
          { title: "Fundamentals", detail: "Point-in-time filings", style: "dashed" },
          { title: "Sentiment", style: "dashed" },
          { title: "Documents", detail: "Hybrid RAG", style: "dashed" },
        ],
        via: "enrichment, may degrade",
      },
      { nodes: [{ title: "Quant research", detail: "Factor panel, IC, Fama–MacBeth" }] },
      { nodes: [{ title: "ML research", detail: "Purged walk-forward; out-of-sample predictions" }] },
      { nodes: [{ title: "Backtest", detail: "Model predictions, with costs" }] },
      {
        seq: true,
        nodes: [
          { title: "Risk", style: "dashed" },
          { title: "Portfolio", style: "dashed" },
        ],
      },
      { nodes: [{ title: "Critic", detail: "Leakage, purge and coverage checks" }] },
      { nodes: [], loop: "On reject with revisions and budget left: revise the plan and re-enter at market data (at most once)" },
      { nodes: [{ title: "Report", detail: "Methods, results, limitations" }] },
      { nodes: [{ title: "Human approval", detail: "Nothing is decision-ready without it", style: "filled" }] },
    ],
  },
  "feelfit-pipeline": {
    kind: "flow",
    rows: [
      { nodes: [{ title: "Upload", detail: "PDF, image or CSV", style: "muted" }] },
      {
        seq: true,
        nodes: [
          { title: "Validate", detail: "Type, size, integrity" },
          { title: "Cache", detail: "Content hash" },
          { title: "Extract", detail: "pdfplumber or Tesseract OCR" },
        ],
      },
      {
        seq: true,
        nodes: [
          { title: "LOINC mapping", detail: "Test names to standard codes" },
          { title: "Enrich", detail: "Ranges and profile" },
        ],
      },
      { nodes: [{ title: "LLM interpretation", detail: "Llama 3.3 / Llama 4 vision via Groq" }] },
      { nodes: [{ title: "Schema validation", detail: "Blocked phrases, risk needs evidence", style: "filled" }] },
      {
        seq: true,
        nodes: [
          { title: "Respond", detail: "Structured JSON" },
          { title: "Persist", detail: "Optional history", style: "dashed" },
        ],
      },
    ],
  },
  "caringu-architecture": {
    kind: "flow",
    rows: [
      {
        nodes: [
          { title: "Her speaker", detail: "Voice in, natural voice out", style: "muted" },
          { title: "Family app", detail: "A second MCP client, in the browser", style: "muted" },
        ],
      },
      { nodes: [{ title: "Agent", detail: "1 safety screen (fixed rules) · 2 model (Bedrock or Nemotron) · 3 guards on every tool call" }] },
      { nodes: [{ title: "MCP server", detail: "29 tools, Streamable HTTP, elicitation for approvals", style: "filled" }], via: "JSON-RPC" },
      {
        nodes: [
          { title: "Fixed rules", detail: "Doses, scams, payments, alerts" },
          { title: "OpenCV 5 service", detail: "Scam Lens, strip check" },
          { title: "PayPal sandbox", detail: "Bills", style: "dashed" },
        ],
      },
      { nodes: [{ title: "SQLite", detail: "State, audit log", style: "muted" }] },
    ],
  },
  "datasentry-loop": {
    kind: "flow",
    rows: [
      { nodes: [{ title: "Events", detail: "Warehouse writes, query history, dbt, GitHub", style: "muted" }] },
      {
        nodes: [
          { title: "Profiler", detail: "Sketches only, never raw values" },
          { title: "Lineage", detail: "Column-level graph from SQL" },
        ],
      },
      { nodes: [{ title: "Detectors D1–D7", detail: "Split-conformal calibration per column" }] },
      { nodes: [{ title: "Correlator", detail: "About one incident per event" }] },
      { nodes: [{ title: "Reasoner", detail: "Every claim must cite stored evidence; read-only tools" }] },
      { nodes: [{ title: "Policy gate", detail: "Closed action set", style: "filled" }] },
      {
        nodes: [
          { title: "Auto-execute", detail: "Low risk only", style: "dashed" },
          { title: "Approval tray", detail: "A person decides" },
        ],
      },
      { nodes: [{ title: "Verification", detail: "Close or escalate, never on a timer" }] },
    ],
  },
  "knee-pipeline": {
    kind: "flow",
    rows: [
      { group: IMAGES, nodes: [{ title: "Remote zip", detail: "570 GB behind a signed URL", style: "muted" }] },
      { group: IMAGES, nodes: [{ title: "Central directory", detail: "Read once for byte ranges" }] },
      { group: IMAGES, nodes: [{ title: "Range read per series", detail: "Decoded in memory, resized, zstd" }] },
      { group: IMAGES, nodes: [{ title: "Cache", detail: "65 GB, 4,407 studies, 0 failures", style: "filled" }] },
      {
        group: "Labels",
        seq: true,
        nodes: [
          { title: "Radiology reports", style: "muted" },
          { title: "Qwen3-32B", detail: "12 findings per report" },
          { title: "58 expert labels", detail: "Every label set checked here", style: "dashed" },
        ],
      },
      { nodes: [{ title: "ConvNeXt models", detail: "GPU batch jobs, then a Kaggle notebook", style: "filled" }] },
    ],
  },
  "assessiq-pipeline": {
    kind: "flow",
    rows: [
      { nodes: [{ title: "Hiring need", detail: "Plain English", style: "muted" }] },
      { nodes: [{ title: "Guardrails", detail: "Intent; blocks injection and off-topic" }] },
      { nodes: [{ title: "Hybrid retrieval", detail: "BM25 + FAISS, reciprocal rank fusion, boosts" }] },
      { nodes: [{ title: "LLM recommendation", detail: "Reasons per item; fallback model" }] },
      { nodes: [{ title: "Validator", detail: "Catalog URLs, schema, at most 10", style: "filled" }] },
    ],
  },
  "arc-inference": {
    kind: "segments",
    unit: "s per task (mean)",
    segments: [
      { label: "Training", value: 69, detail: "Per-task LoRA, 69 s", style: "muted" },
      { label: "Decoding + re-scoring", value: 205, detail: "About 75% of 274 s", style: "filled" },
    ],
    footnote: "Baseline on 40 development tasks. Decoding was the lever, so it is where the changes went.",
  },
};
