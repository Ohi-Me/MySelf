import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/DataSentry";

export const datasentry: Project = {
  slug: "datasentry",
  title: "DataSentry",
  tagline: "A lakehouse reliability control plane: statistics detect, an evidence-bound reasoner explains, deterministic code acts.",
  summary:
    "Finds silent data regressions with conformally calibrated detectors, traces them through column-level lineage parsed from SQL, and proposes the fix as a pull request, with every root-cause claim required to cite stored evidence. Four of its own quality gates are not met, and the README says so.",
  kind: "system",
  status: "prototype",
  statusNote: "Portfolio system built to production standards; runs locally or in Docker. No public deployment.",
  period: "Sep 2026",
  sortDate: "2026-09",
  featured: true,
  domains: ["Data reliability", "Conformal prediction", "Lineage", "LLM agents", "Evaluation"],
  stack: ["Python 3.11", "FastAPI", "SQLite", "Split conformal prediction", "t-digest, HyperLogLog, Count-Min", "Groq / Gemini / Anthropic APIs", "Docker", "GitHub Actions"],
  role: "Solo.",
  links: [{ label: "Repository", href: REPO, kind: "repo" }],

  overview: {
    problem:
      "The expensive data failures are not crashes but silent semantic regressions: a currency column changes unit, a join turns from INNER to LEFT, a dedup key changes and rows fan out. Pipelines stay green while dashboards are wrong, and root cause takes hours of tracing lineage by hand.",
    solution:
      "Seven detector families share one split-conformal calibration framework; a purpose-built SQL reader produces column-level lineage; a semantic diff turns code changes into structured evidence; a reasoner may only make claims that cite stored evidence; a policy gate decides what executes.",
    contribution: "Designed and implemented the detectors, calibration, SQL lineage, reasoner guardrails, fault harness, evaluation gates and console.",
    outcome:
      "Observed false-positive rate 0.0104 against a 0.01 target, 98.2% column-map coverage, hallucination rate 0.000 over three seeded worlds. Detection recall 0.556 and incident precision 0.523 are below their targets and documented as such.",
  },

  keyMetrics: [
    {
      value: "0.0104",
      label: "observed false-positive rate at α = 0.01",
      measures: "How often a calibrated detector fires on data with no fault.",
      method: "Split conformal thresholds from each column's own calibration set; measured on 4,000 samples of Gaussian noise (≤ 0.03 on lognormal).",
      source: "Detection-primitive tests in the repository.",
      kind: "measured",
      conclusion: "The calibration does what it promises on synthetic noise; it says nothing yet about real lakehouse columns.",
      sourceUrl: REPO,
    },
    {
      value: "0.000",
      label: "hallucination rate, 3 seeded worlds",
      measures: "Share of root-cause claims that cite evidence which does not exist for that incident.",
      method: "Fault harness records ground truth at injection; claims checked against the incident's evidence table.",
      source: "Three independent worlds of 60 tables, 6 faults and 2 decoys each.",
      kind: "measured",
      sourceUrl: REPO,
    },
    {
      value: "0.556 ± 0.08",
      label: "detection recall (target ≥ 0.90): not met",
      measures: "Share of injected faults that were detected.",
      method: "Mean over three seeded worlds with the spread across seeds.",
      source: "Same fault harness.",
      kind: "measured",
      conclusion: "Limited by cadence tiering: a cold table is profiled every eighth cycle, so a two-breach rule needs sixteen cycles to fire. Never claimed as strong detection.",
      sourceUrl: REPO,
    },
  ],

  plain: [
    {
      type: "p",
      text: "Companies keep thousands of data tables that feed reports and models. Sometimes a table goes subtly wrong, for example amounts switch from dollars to rupees, and nothing crashes, so nobody notices for days.",
    },
    {
      type: "p",
      text: "DataSentry watches the tables statistically, raises an alert only when a change is unlikely to be normal noise, works out which upstream change caused it and which downstream reports are affected, and drafts the fix for a person to approve. The AI part may only state causes it can back with stored evidence.",
    },
  ],

  engineering: [
    {
      id: "loop",
      title: "The loop",
      blocks: [
        { type: "diagram", id: "datasentry-loop", caption: "Statistics detect, the reasoner explains with cited evidence, deterministic code acts. Nothing auto-closes on a timer." },
      ],
    },
    {
      id: "conformal",
      title: "Calibrated detection, not tuned thresholds",
      blocks: [
        {
          type: "p",
          text: "A raw score threshold gives an unknown false-positive rate that varies by column; at 200,000 columns even 0.1% is 200 alerts per cycle. Split conformal prediction sets each column's threshold from the order statistics of its own calibration scores, which bounds the marginal false-positive rate under exchangeability without assuming normality.",
        },
        {
          type: "equation",
          tex: "\\hat{q}_{1-\\alpha} = s_{(\\lceil (n+1)(1-\\alpha) \\rceil)}, \\qquad \\Pr\\big(s_{\\text{new}} > \\hat{q}_{1-\\alpha}\\big) \\le \\alpha",
          caption: "The standard (unweighted) split conformal threshold from n calibration scores of the same column; DataSentry uses a time-weighted variant of it.",
          where: [
            ["s_{(k)}", "k-th smallest calibration score"],
            ["\\alpha", "target false-positive rate"],
          ],
        },
        {
          type: "list",
          items: [
            "A weighted calibration set with a 14-day half-life.",
            "A cohort threshold for cold-start columns, marked provisional.",
            "A two-consecutive-breach rule that takes the effective rate to roughly α² for independent noise.",
            "Seven detector families: seasonal residual, beta-binomial for rates, Wasserstein-1 over t-digests, chi-square for categories, distinctness ratio, isolation forest, deterministic schema check.",
          ],
        },
      ],
    },
    {
      id: "lineage",
      title: "Column-level lineage from real SQL",
      blocks: [
        {
          type: "p",
          text: "A purpose-built SQL reader resolves nested CTEs, subqueries, every join kind, `SELECT *` expansion against a catalog snapshot, window functions and set operations into column-level edges with a transform type. Join keys become table-level edges because a join key changes row multiplicity. Coverage is reported, never assumed: 98.2% on the fixture DAG, with unhandled SQL shown as a gap. Blast radius at depth 8 takes 0.2 to 0.4 ms against a 300 ms budget.",
        },
      ],
    },
    {
      id: "evidence-or-nothing",
      title: "Evidence or it did not happen",
      blocks: [
        {
          type: "table",
          columns: ["Layer", "Mechanism"],
          rows: [
            ["Type system", "A claim's evidence list has a minimum length of 1; a claim without evidence cannot be constructed"],
            ["Post-parse validation", "Every cited id must resolve against this incident's evidence table, or the claim is stripped"],
            ["Adversarial verifier", "Default position is rejection; evidence must entail the claim, not merely co-occur"],
            ["Closed action enum", "Whatever survives still cannot name an action the executor does not implement"],
          ],
        },
        {
          type: "p",
          text: "The reasoning identity is read-only by construction: there is no write tool, and a test runs every tool against a store that raises on anything but a SELECT. No action type is irreversible, quarantine never auto-executes, and profiles store mergeable sketches and salted digests rather than raw values.",
        },
      ],
    },
  ],

  research: [
    {
      id: "gates",
      title: "Measured, not asserted",
      blocks: [
        {
          type: "table",
          caption: "End-to-end gates: three worlds of 60 tables, 6 faults and 2 decoys each",
          columns: ["Gate", "Measured", "Spread", "Target", "Met"],
          rows: [
            ["Hallucination rate", "0.000", "—", "≤ 0.02", "yes"],
            ["Decoy false-positive rate", "0.000", "—", "≤ 0.10", "yes"],
            ["Root-asset accuracy", "1.000", "1.00 – 1.00", "≥ 0.85", "yes"],
            ["Root-cause accuracy", "0.611", "± 0.08", "≥ 0.80", "no"],
            ["Detection recall", "0.556", "± 0.08", "≥ 0.90", "no"],
            ["Incident precision", "0.523", "± 0.16", "≥ 0.75", "no"],
            ["Blast-radius recall", "0.729", "± 0.23", "≥ 0.95", "no"],
          ],
        },
        {
          type: "list",
          items: [
            "**Recall** is limited by cadence tiering; the metric needs a per-tier deadline.",
            "**Precision** is the weakest: minimum-effect thresholds are still hand-set per signal instead of derived from each cohort's spread.",
            "**Root-cause accuracy** is 1.00 on every fault that lands a commit; misses are source-side faults where the deterministic reasoner has no code change to point at.",
            "**Blast-radius recall** misses aggregate renames and, at ±0.23, is the noisiest number.",
          ],
        },
        {
          type: "callout",
          tone: "note",
          title: "Why the spread column matters",
          text: "An earlier single-seed run showed root-asset accuracy at 0.75 and root-cause at 0.33, which looked like a regression and was noise. With six faults per world, one fault moves a metric by 0.17, so only means over seeds are quoted.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: [
      "Built seven detector families on one conformal calibration framework.",
      "Wrote a SQL reader for column-level lineage and a semantic diff of code changes.",
      "Designed the evidence-bound reasoner and its security invariants.",
      "Built the fault harness, CI gates and the console.",
    ],
    contributions: ["Distribution-free alert thresholds per column.", "Root-cause claims that cannot exist without evidence.", "Honest gate reporting, including the four gates not met."],
    skills: ["Conformal prediction", "SQL parsing", "LLM guardrails", "FastAPI", "Testing (115 tests)", "CI"],
    ownership: "Solo, from an eight-document design spec to implementation.",
    impact: ["115 tests in CI; the evaluation exits non-zero when a blocking gate regresses."],
  },

  implemented: ["D1–D7 detectors with conformal calibration", "Column-level SQL lineage and semantic diff", "Four reasoners behind one interface, including a deterministic one", "Policy gate, approval tray, verification worker", "Fault harness and CI gates"],
  planned: ["Per-tier detection deadlines", "Cohort-derived minimum-effect thresholds", "A frozen gold set", "Authentication (there is none)"],
  limitations: [
    "Four end-to-end gates below target.",
    "Substitutes for production parts: an event table for Kafka, SQLite for Postgres, a custom SQL reader for sqlglot.",
    "The referential-integrity detector is implemented but inert in the local harness.",
    "Terraform and observability are design only.",
  ],
  lessons: ["A gate that only ever reports success is not a gate.", "Report the mean over seeds with its spread; a single run is an anecdote."],
  evidence: [{ label: "Repository README and BENCHMARKS.md", href: REPO, note: "Every number above, with run-by-run history." }],
  related: ["orbit", "caringu"],
};
