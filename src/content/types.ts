/**
 * Content model for the portfolio.
 *
 * Every project and paper is a plain TypeScript object that satisfies these
 * types, so the compiler checks the content and the page components never
 * change when an entry is added. Long-form text is written as `Block[]`, a
 * small vocabulary of typed blocks (paragraph, table, equation, diagram, ...)
 * that the renderer in `components/content/Blocks.tsx` understands.
 *
 * Inline text in any string field may use a tiny markup:
 *   **bold**   `code`   [label](https://url)   $inline math$
 */

/* ------------------------------------------------------------------ */
/* Evidence: where a number comes from                                  */
/* ------------------------------------------------------------------ */

/**
 * The kind of evidence behind a reported number. Shown on every metric so
 * that a held-out result is never read as a validation result, and a
 * leaderboard score is never compared with an offline score.
 */
export type EvidenceKind =
  | "held-out" // scored once on data not used during development (pre-registered or final test)
  | "validation" // development / validation data, used to make choices
  | "leaderboard" // a competition leaderboard score
  | "exploratory" // analysis run after scoring; not pre-registered
  | "simulation" // produced by a stylised model or simulation
  | "measured" // a direct engineering measurement (tests, latency, counts)
  | "reported"; // a fact recorded by the author (e.g. a rank), not re-derived here

export interface Metric {
  /** Display value, exactly as in the source (no re-rounding). */
  value: string;
  /** Short label shown under the value. */
  label: string;
  /** What the number measures, in one sentence. */
  measures: string;
  /** How it was calculated. */
  method: string;
  /** Which dataset, run or experiment produced it. */
  source: string;
  kind: EvidenceKind;
  /** What can reasonably be concluded, and what cannot. */
  conclusion?: string;
  /** Public file or page that holds the number, when one exists. */
  sourceUrl?: string;
}

/* ------------------------------------------------------------------ */
/* Blocks                                                               */
/* ------------------------------------------------------------------ */

export type DiagramId =
  | "refused-chain"
  | "refused-splits"
  | "refused-correction"
  | "er-pipeline"
  | "orbit-graph"
  | "feelfit-pipeline"
  | "caringu-architecture"
  | "datasentry-loop"
  | "knee-pipeline"
  | "assessiq-pipeline"
  | "arc-inference";

export type ChartSpec =
  | {
      type: "dumbbell";
      /** Each row compares a model value with a baseline value. */
      rows: { label: string; value: number; baseline: number }[];
      valueLabel: string;
      baselineLabel: string;
      /** Optional vertical reference line, e.g. 1.0 for MASE. */
      reference?: { at: number; label: string };
      domain: [number, number];
      lowerIsBetter?: boolean;
    }
  | {
      type: "bars";
      rows: { label: string; value: number; display?: string; emphasis?: boolean }[];
      unit?: string;
      domain: [number, number];
      lowerIsBetter?: boolean;
    };

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "table";
      caption?: string;
      columns: string[];
      rows: string[][];
      /** Columns aligned right (numeric). Indexes into `columns`. */
      numeric?: number[];
      note?: string;
    }
  | {
      type: "equation";
      tex: string;
      caption?: string;
      /** Symbol legend: [tex symbol, meaning]. */
      where?: [string, string][];
    }
  | { type: "code"; lang: string; code: string; caption?: string; source?: string }
  | { type: "metrics"; items: Metric[] }
  | {
      type: "callout";
      tone: "note" | "caution" | "negative" | "result";
      title?: string;
      text: string;
    }
  | { type: "diagram"; id: DiagramId; caption: string }
  | { type: "chart"; chart: ChartSpec; caption: string; note?: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "kv"; items: [string, string][] }
  | { type: "h3"; text: string };

export interface Section {
  /** Anchor id, unique within the page. */
  id: string;
  title: string;
  blocks: Block[];
}

/* ------------------------------------------------------------------ */
/* Pipeline, problems solved and where the work applies                 */
/* ------------------------------------------------------------------ */

/** One stage of the animated pipeline shown at the top of every project and paper. */
export interface PipelineStage {
  title: string;
  /** One short line: what happens at this stage. */
  detail: string;
}

/** A concrete problem the work ran into or set out to fix, and how it was fixed. */
export interface ResolvedIssue {
  issue: string;
  resolution: string;
}

/**
 * Where the work could matter outside the project: an industry, an operator or
 * a person. Written as potential use, never as a deployment that did not happen.
 */
export interface ImpactArea {
  area: string;
  text: string;
}

/** The parts every project and paper shares beyond its own content. */
export interface Story {
  pipeline: PipelineStage[];
  resolved: ResolvedIssue[];
  impact: ImpactArea[];
}

/* ------------------------------------------------------------------ */
/* Links                                                                */
/* ------------------------------------------------------------------ */

export type LinkKind = "live" | "repo" | "dataset" | "paper" | "doc" | "profile";

export interface ExternalLink {
  label: string;
  href: string;
  kind: LinkKind;
  /** Extra context, e.g. "sample data", "sandbox payments". */
  note?: string;
}

/* ------------------------------------------------------------------ */
/* Projects                                                             */
/* ------------------------------------------------------------------ */

export type ProjectStatus =
  | "completed"
  | "ongoing"
  | "prototype"
  | "research"
  | "competition";

export type ProjectKind = "research" | "competition" | "system" | "product";

export interface Project extends Story {
  slug: string;
  title: string;
  /** One line under the title. */
  tagline: string;
  /** Two sentences for cards and search. */
  summary: string;
  kind: ProjectKind;
  status: ProjectStatus;
  /** Plain words about the status, e.g. "Contest results pending". */
  statusNote: string;
  period: string;
  /** Sort key for "latest first" ordering, ISO month. */
  sortDate: string;
  featured: boolean;
  domains: string[];
  stack: string[];
  /** Who did the work: "Solo", or the team and my part in it. */
  role: string;
  links: ExternalLink[];

  /** The 30-second reading. */
  overview: {
    problem: string;
    solution: string;
    contribution: string;
    outcome: string;
  };
  /** Headline numbers, each with its provenance. */
  keyMetrics: Metric[];

  /** Nontechnical explanation. */
  plain: Block[];
  /** Engineering deep dive. */
  engineering: Section[];
  /** Research and evaluation view. */
  research: Section[];
  /** Recruiter summary. */
  recruiter: {
    responsibilities: string[];
    contributions: string[];
    skills: string[];
    ownership: string;
    impact: string[];
  };

  implemented: string[];
  planned: string[];
  limitations: string[];
  lessons: string[];
  evidence: { label: string; href?: string; note: string }[];
  /** Slugs of related projects or papers. */
  related: string[];
}

/* ------------------------------------------------------------------ */
/* Papers                                                               */
/* ------------------------------------------------------------------ */

export type PaperStatus =
  | "published"
  | "accepted"
  | "submitted"
  | "under-review"
  | "preprint"
  | "manuscript" // complete manuscript, not yet submitted
  | "in-progress"
  | "dataset"; // a published dataset release

export interface Author {
  name: string;
  me?: boolean;
  affiliation?: string;
}

/** One entry in a paper's version history: what changed in the manuscript, and when. */
export interface Revision {
  /** Short label, e.g. "Submitted", "v1.1 prepared". */
  version: string;
  date: string;
  summary: string;
  changes: string[];
}

/** The full manuscript, served from `public/` and read page by page on the site. */
export interface FullText {
  /** Path under `public/`, e.g. "/papers/slug.pdf". */
  pdf: string;
  /** Which version this is, e.g. "Submitted version", "Preprint". */
  version: string;
  /** When this version was finalised. */
  date: string;
  /** One line on what this copy is and what it is not (e.g. not the version of record). */
  note: string;
}

export interface Paper extends Story {
  slug: string;
  title: string;
  /** Short name for cards and breadcrumbs. */
  shortTitle: string;
  status: PaperStatus;
  /** What the status means here, in plain words with dates. */
  statusNote: string;
  venue: string;
  year: string;
  sortDate: string;
  authors: Author[];
  /** My position and role, e.g. "First and corresponding author". */
  authorship: string;
  contribution: string[];
  links: ExternalLink[];
  doi?: string;
  /** Verbatim abstract, when it may be shown. */
  abstract?: string;
  /** Why the abstract or full text is not shown, when it is not. */
  disclosure?: string;
  /** The full manuscript, when it may be shown. */
  fullText?: FullText;
  /** Highlights as the manuscript states them, when it has them. */
  highlights?: string[];
  plain: string;
  keyMetrics: Metric[];
  sections: Section[];
  /** Version history of the manuscript, newest first. */
  revisions: Revision[];
  /** BibTeX for published items only. */
  bibtex?: string;
  related: string[];
  topics: string[];
}
