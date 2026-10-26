import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/AssessIQ";

export const assessiq: Project = {
  slug: "assessiq",
  title: "AssessIQ",
  tagline: "A conversational agent that recommends hiring assessments, grounded so it can only suggest tests that exist in its catalog.",
  summary:
    "Guardrails, hybrid retrieval (BM25 + FAISS fused with reciprocal rank fusion), LLM generation and a validator that drops anything not in the catalog. Retrieval is evaluated in CI on a hand-labelled query set.",
  kind: "product",
  status: "prototype",
  statusNote: "Working prototype, live.",
  period: "2026",
  sortDate: "2026-09",
  featured: false,
  domains: ["Retrieval-augmented generation", "Conversational agents", "Guardrails", "Search evaluation"],
  stack: ["FastAPI", "BM25", "FAISS", "all-MiniLM-L6-v2", "Groq (gpt-oss-120b)", "Gemini 2.5 Flash (fallback)", "Docker", "GitHub Actions"],
  role: "Solo.",
  links: [
    { label: "Live app", href: "https://assessiq-drab.vercel.app", kind: "live" },
    { label: "Repository", href: REPO, kind: "repo" },
  ],

  overview: {
    problem:
      "Hiring managers choosing an assessment browse a large catalog by hand, and a chat model asked to recommend one will happily invent tests that do not exist.",
    solution:
      "A short conversation that asks for the one missing signal (role, seniority or skill focus), then hybrid retrieval over the catalog, LLM recommendations with reasons, and a validator that checks every recommendation against real catalog entries.",
    contribution: "Built the agent, retrieval, guardrails, validator, evaluation and deployment.",
    outcome: "Recall@10 0.99 and MRR 0.89 on 20 hand-labelled queries; retrieval p50 latency 21.4 ms cold and 0.9 ms with caching.",
  },

  keyMetrics: [
    {
      value: "0.87 / 0.99",
      label: "Recall@5 / Recall@10 on 20 labelled queries",
      measures: "Share of relevant assessments that appear in the top 5 and top 10 results.",
      method: "Binary relevance labels in evals/retrieval_set.json; a label naming a missing assessment fails the run.",
      source: "python scripts/evaluate.py; CI enforces Recall@5 ≥ 0.75.",
      kind: "measured",
      conclusion: "A small set labelled by the developer: good for catching regressions, not a measure of real-world quality. Generation is not evaluated.",
      sourceUrl: REPO,
    },
    {
      value: "21.4 → 0.9 ms",
      label: "retrieval p50, cold vs warm cache (23.8×)",
      measures: "Median retrieval latency per query.",
      method: "8 queries × 5 repeats on a local CPU; embeddings memoised on the exact query text.",
      source: "python scripts/benchmark.py",
      kind: "measured",
      conclusion: "End-to-end latency is dominated by the LLM provider, which is excluded on purpose.",
      sourceUrl: REPO,
    },
  ],

  plain: [
    {
      type: "p",
      text: "You describe who you are hiring, for example \"an intern who can code and solve problems\". The assistant asks one clarifying question if it needs to, then suggests a few assessments with a reason for each. It can only suggest assessments that really exist in its catalog.",
    },
  ],

  engineering: [
    {
      id: "pipeline",
      title: "Pipeline",
      blocks: [
        { type: "diagram", id: "assessiq-pipeline", caption: "Every response passes the validator last; invalid entries are dropped and results are capped at 10." },
        {
          type: "list",
          items: [
            "**Guardrails** classify each turn (clarify, recommend, refine, compare, refuse) and block prompt injection and off-topic requests.",
            "**Hybrid retrieval:** BM25 and FAISS results fused with reciprocal rank fusion, then boosted by seniority, skill and test-type match.",
            "**Validator:** every recommendation is checked against real catalog URLs; anything else is removed.",
            "**Per-stage timing** is returned with each response, which showed that query embedding dominated retrieval; embeddings and successful completions are now cached (failures are never cached).",
            "Prebuilt indexes are committed because building them in a 512 MiB instance runs out of memory.",
          ],
        },
        {
          type: "equation",
          tex: "\\mathrm{RRF}(d) = \\sum_{r \\in \\{\\text{BM25},\\,\\text{FAISS}\\}} \\frac{1}{k + \\operatorname{rank}_r(d)}",
          caption: "Reciprocal rank fusion of the lexical and dense rankings (k is a smoothing constant).",
        },
      ],
    },
  ],

  research: [
    {
      id: "evaluation",
      title: "Evaluation",
      blocks: [
        {
          type: "table",
          caption: "Retrieval on 20 hand-labelled queries",
          columns: ["Metric", "Value"],
          numeric: [1],
          rows: [
            ["Recall@5", "0.87"],
            ["Recall@10", "0.99"],
            ["MRR", "0.89"],
            ["nDCG@10", "0.88"],
            ["Precision@5", "0.41"],
          ],
          note: "Precision@5 is low by construction: most queries have two or three relevant assessments, so five slots cannot all be correct.",
        },
        {
          type: "p",
          text: "Only retrieval is evaluated, on purpose: generation is non-deterministic and needs API keys, which would make the numbers unrepeatable and keep them out of CI.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: ["Built the FastAPI agent, retrieval and guardrails", "Wrote the retrieval evaluation and CI floor", "Measured and cut retrieval latency"],
    contributions: ["Grounding: a validator that makes invented recommendations impossible to return", "Per-stage timing that located the latency"],
    skills: ["RAG", "Hybrid search", "Guardrails", "FastAPI", "Evaluation in CI"],
    ownership: "Solo.",
    impact: ["Live deployment with a CI-enforced retrieval floor."],
  },

  implemented: ["Guardrails, hybrid retrieval, generation, validator", "Retrieval evaluation and benchmark", "Docker deployment"],
  planned: [],
  limitations: ["31-entry catalog and a 20-query evaluation set labelled by the developer.", "Generation quality is not measured."],
  lessons: ["Make grounding a code check, not a prompt request."],
  evidence: [{ label: "Repository README", href: REPO, note: "Architecture, evaluation and latency benchmark." }],
  related: ["feelfit", "amazon-ml-entity-resolution"],
};
