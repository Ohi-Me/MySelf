import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/Orbit";
const GRAPH = `${REPO}/blob/main/backend/app/orchestration/graph.py`;
const LEAK = `${REPO}/blob/main/backend/tests/test_leakage.py`;

export const orbit: Project = {
  slug: "orbit",
  title: "Orbit",
  tagline: "An evidence-driven quantitative research platform: a multi-agent pipeline that ends at a human approval gate, not at a trade.",
  summary:
    "A LangGraph state machine of 14 steps that turns a research question into point-in-time features, out-of-sample model signals, a cost-aware backtest and a critic's verdict, with leakage tests and graceful degradation built in.",
  kind: "system",
  status: "prototype",
  statusNote: "Working research prototype, deployed (frontend on Vercel). Not a trading system; no broker integration.",
  period: "Aug 2026",
  sortDate: "2026-08",
  featured: true,
  domains: ["Agentic systems", "Quantitative finance", "Time-series validation", "Retrieval-augmented generation", "MLOps"],
  stack: [
    "Python 3.11",
    "FastAPI",
    "LangGraph",
    "PostgreSQL + pgvector",
    "Redis + Arq",
    "XGBoost",
    "PyTorch (LSTM, Transformer)",
    "BM25 + reranker",
    "MLflow",
    "Docker",
    "GitHub Actions",
    "Next.js",
  ],
  role: "Solo.",
  links: [
    { label: "Live app", href: "https://orbit-web-jet.vercel.app", kind: "live" },
    { label: "Repository", href: REPO, kind: "repo" },
  ],

  overview: {
    problem:
      "Financial machine learning fools its authors easily: future information leaks into features, folds overlap the label horizon, and a model is validated but a different hand-built strategy is backtested. A long multi-agent pipeline adds its own failure: one unreachable data source can stop the whole run.",
    solution:
      "A LangGraph state machine whose every step runs through one wrapper that records timing and classifies the outcome as ok, degraded or failed. Purged and embargoed walk-forward validation feeds model predictions straight into the backtest, a critic can send the run back for one revision, and the run ends at a human approval gate.",
    contribution:
      "Designed and built the backend, orchestration, validation framework, tests and deployment configuration.",
    outcome:
      "A running platform with 14 named pipeline steps, 14 leakage tests, CI on GitHub Actions, and a lean deployment mode that keeps the full pipeline running when heavy libraries are absent.",
  },

  keyMetrics: [
    {
      value: "14",
      label: "named steps in the research graph",
      measures: "Distinct nodes in the LangGraph state machine, including the critic, the plan revision and the report.",
      method: "Counted from `build_graph()` in the orchestration module.",
      source: "backend/app/orchestration/graph.py",
      kind: "measured",
      sourceUrl: GRAPH,
    },
    {
      value: "14",
      label: "leakage tests",
      measures: "Tests that fail if training overlaps testing, the purge gap is shorter than the label horizon, folds move backwards, labels are not future shifts, or the critic misses a planted leak.",
      method: "pytest; run in CI.",
      source: "backend/tests/test_leakage.py",
      kind: "measured",
      sourceUrl: LEAK,
    },
    {
      value: "1",
      label: "bounded critic revision",
      measures: "Maximum number of times the critic can send a run back through planning.",
      method: "`MAX_REVISIONS = 1` with a conditional edge from the critic.",
      source: "backend/app/orchestration/graph.py",
      kind: "measured",
      conclusion: "An unbounded critic loop is a way to burn money; one revision keeps cost predictable.",
      sourceUrl: GRAPH,
    },
  ],

  plain: [
    {
      type: "p",
      text: "Orbit is a research assistant for testing investment ideas, not a stock picker. You ask a question such as \"does adding news sentiment to momentum help after costs?\" and it gathers price, company-filing, macro and news data, builds features using only information that was public at each date, trains several models, and tests their predictions as a portfolio with realistic trading costs.",
    },
    {
      type: "p",
      text: "A built-in critic checks the work for the classic mistakes, such as accidentally using tomorrow's data, and can send the run back once to fix its plan. Nothing is marked as usable until a person approves it. The language model helps plan and write; it never decides whether a result is significant or worth money.",
    },
    {
      type: "callout",
      tone: "caution",
      text: "Orbit is research software. It is not investment advice, not a broker and not a trading system.",
    },
  ],

  engineering: [
    {
      id: "graph",
      title: "The orchestration graph",
      blocks: [
        {
          type: "p",
          text: "The first version was a plain sequential function, and the repository's own notes say why that was right at the time: a straight-line pipeline gains nothing from a graph framework. It stopped being true once the critic could reject a run and send it back through planning. That is a cycle with a conditional edge and bounded iteration, which a hand-rolled pipeline expresses badly, so the orchestration moved to LangGraph.",
        },
        {
          type: "diagram",
          id: "orbit-graph",
          caption: "Orbit's research graph. Solid borders are critical steps (a failure aborts the run); dashed borders are enrichment steps (a failure degrades it). The revision edge re-enters at market data because a revised plan can change the universe.",
        },
      ],
    },
    {
      id: "failure-handling",
      title: "Failure handling: ok, degraded or failed",
      blocks: [
        {
          type: "p",
          text: "Every node runs through one wrapper that times it, catches exceptions and records a structured step. A failure in a critical node (planner, market data, factors, models, backtest, critic, report) aborts the run; a failure anywhere else (macro, fundamentals, sentiment, documents, risk, portfolio) is recorded and the downstream agents see reduced inputs.",
        },
        {
          type: "code",
          lang: "python",
          caption: "The node wrapper, abridged.",
          source: GRAPH,
          code: `def _node(name, fn, state, critical=False):
    start = time.time()
    try:
        result = fn(state)
        step = {"agent": name,
                "status": result.pop("_status", "ok"),
                "seconds": round(time.time() - start, 3),
                "degraded_reason": result.pop("_degraded_reason", None)}
        return {**result, "steps": [step]}
    except Exception as e:
        step = {"agent": name, "status": "failed",
                "error": f"{type(e).__name__}: {e}"}
        if critical:
            return {"steps": [step], "status": "failed"}
        return {"steps": [step]}`,
        },
        {
          type: "code",
          lang: "python",
          caption: "The critic's verdict changes what happens next, with a bounded loop.",
          source: GRAPH,
          code: `def route_after_critic(state):
    critic = state.get("critic_result") or {}
    if state.get("status") == "failed":
        return "report"
    if (critic.get("recommended_action") == "revise_and_rerun"
            and critic.get("recommended_revisions")
            and state.get("revision_count", 0) < MAX_REVISIONS):
        return "revise"
    return "report"`,
        },
      ],
    },
    {
      id: "validation",
      title: "Point-in-time data and leakage prevention",
      blocks: [
        {
          type: "list",
          items: [
            "**Point-in-time fundamentals:** company-filing facts enter on the date they were filed, not the fiscal period they describe. Macro and document features respect publication timing.",
            "**Purged and embargoed walk-forward validation:** expanding folds that move forward in time, with a purge gap at least as long as the label horizon.",
            "**Labels are future shifts:** a test checks that the forward-return label is a shift of future prices and is missing at the end of the series.",
            "**The critic catches planted leaks:** a test adds a factor that is 0.9 × the forward return and asserts the critic flags it.",
            "**Honest comparison:** model out-of-sample predictions flow directly into the backtest, so the strategy tested is the one the model produced.",
            "**Dependent observations:** HAC (Newey–West) inference and multiple-testing controls when Sharpe ratios are compared.",
          ],
        },
        {
          type: "code",
          lang: "python",
          caption: "One of the leakage tests: a blatant leak must be caught.",
          source: LEAK,
          code: `def test_critic_catches_a_leaking_factor(self, price_frames):
    ...
    panel["momentum_3m"] = panel["fwd_return_21d"] * 0.9  # blatant leak
    ...`,
        },
      ],
    },
    {
      id: "rag",
      title: "Financial document retrieval",
      blocks: [
        {
          type: "p",
          text: "Filings are parsed, chunked with metadata and indexed for both dense (pgvector) and lexical (BM25) search. Hybrid retrieval is reranked, the answer cites its evidence, and unsupported numerical claims are flagged. The documents step is skipped when the plan does not ask for filing text.",
        },
      ],
    },
    {
      id: "deployment",
      title: "Deployment and graceful degradation",
      blocks: [
        {
          type: "p",
          text: "Small hosting instances cannot install PyTorch, Transformers, sentence-transformers and MLflow together. Instead of failing, each heavy package is probed at runtime and replaced by a labelled substitute, and the health endpoint reports `fidelity: degraded` naming exactly what is missing.",
        },
        {
          type: "table",
          columns: ["Absent", "Consequence", "Still works"],
          rows: [
            ["PyTorch", "LSTM and Transformer skipped", "Logistic regression and XGBoost still train and compete"],
            ["sentence-transformers", "No dense retrieval or reranking", "BM25 lexical retrieval"],
            ["Transformers", "No FinBERT", "Labelled keyword sentiment baseline"],
            ["MLflow", "No experiment tracking", "Metrics persisted to the database"],
          ],
        },
        {
          type: "p",
          text: "The full factor → model → backtest path was verified with every heavy package blocked. Two deployment pitfalls are documented in the README: the host defaulted to a Python version with no pandas wheels (pinned to 3.11), and SQLite on ephemeral disk is wiped on every deploy (a database URL is required).",
        },
      ],
    },
  ],

  research: [
    {
      id: "question",
      title: "The research question Orbit is built to answer",
      blocks: [
        {
          type: "p",
          text: "Does additional information or model complexity provide incremental predictive and portfolio value after costs and risk? Logistic regression, XGBoost, an LSTM and a Transformer are compared against baseline factor models across technical, value, quality, growth, momentum, volatility, sentiment and macro features. Complexity earns its place only if it improves out-of-sample performance.",
        },
      ],
    },
    {
      id: "evaluation",
      title: "How results are evaluated",
      blocks: [
        {
          type: "list",
          items: [
            "Expanding walk-forward folds with purging and embargo, never random splits.",
            "Out-of-sample signals turned into portfolios with transaction costs, slippage, market impact and borrow.",
            "Risk: Sharpe, Sortino, drawdown, beta, turnover, factor exposure; Cornish–Fisher value at risk.",
            "Statistics: HAC/Newey–West inference and multiple-strategy selection controls.",
            "The critic reports errors and warnings and can request one revision before the report.",
          ],
        },
        {
          type: "callout",
          tone: "note",
          title: "No performance claims",
          text: "This page reports the platform's design and tests, not trading performance. The repository documents survivorship bias in the current universe, modelled rather than observed costs, simplified borrow and limited historical news, so no Sharpe ratio from it is presented as evidence here.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: [
      "Designed the multi-agent architecture and its failure semantics.",
      "Implemented the FastAPI backend, LangGraph orchestration, validation and backtest path.",
      "Wrote the leakage test suite and CI, and the deployment configuration.",
    ],
    contributions: [
      "Ok / degraded / failed step semantics so optional sources never abort a run.",
      "A bounded critic loop and a human approval gate.",
      "A lean deployment mode that keeps the full statistical pipeline running without heavy ML packages.",
    ],
    skills: ["LangGraph", "FastAPI", "PostgreSQL / pgvector", "Redis queues", "Walk-forward validation", "Testing and CI"],
    ownership: "Solo, end to end.",
    impact: ["Deployed prototype with CI passing on the main branch at the time of the last check (25 Oct 2026)."],
  },

  implemented: [
    "14-step LangGraph pipeline with critic and approval gate",
    "Purged, embargoed walk-forward validation with 14 leakage tests",
    "Hybrid retrieval over filings with citations",
    "Async jobs (Redis + Arq), PostgreSQL + pgvector, MLflow, Docker, CI",
  ],
  planned: ["Broker or order-management integration is explicitly out of scope"],
  limitations: [
    "Survivorship bias in the current universe construction.",
    "Modelled rather than observed transaction costs; simplified short borrow.",
    "Limited historical news coverage; single-node execution in development.",
  ],
  lessons: [
    "Adopt a framework when the control flow needs it, not before: the graph came with the critic's loop.",
    "Decide per step what failure means; most steps should degrade, a few must abort.",
  ],
  evidence: [
    { label: "Orchestration graph", href: GRAPH, note: "Nodes, wrapper, routing and the bounded revision loop." },
    { label: "Leakage tests", href: LEAK, note: "The 14 tests described above." },
    { label: "Live app", href: "https://orbit-web-jet.vercel.app", note: "Checked responding on 25 Oct 2026." },
  ],
  pipeline: [
    { title: "Plan", detail: "A question becomes a structured research plan" },
    { title: "Data", detail: "Prices, point-in-time filings, macro, news, documents" },
    { title: "Research", detail: "Factor panel and purged walk-forward ML" },
    { title: "Backtest", detail: "The model's own predictions, with costs" },
    { title: "Critic", detail: "Leakage, purge and coverage checks; one revision" },
    { title: "Approve", detail: "A person signs off; nothing trades" },
  ],
  resolved: [
    {
      issue: "Future information leaks into features and makes a model look better than it is.",
      resolution: "Point-in-time fundamentals and 14 leakage tests in CI.",
    },
    {
      issue: "Cross-validation folds that overlap the label horizon.",
      resolution: "Purged and embargoed walk-forward validation.",
    },
    {
      issue: "A model is validated, but a different hand-built strategy is backtested.",
      resolution: "Out-of-sample model predictions feed the backtest directly.",
    },
    {
      issue: "One unreachable data source stops a long multi-agent run.",
      resolution: "Every step runs through one wrapper that records ok, degraded or failed, and enrichment steps may degrade instead of failing.",
    },
  ],
  impact: [
    { area: "Asset managers and research desks", text: "A research loop that rejects leaky results before anyone acts on them." },
    { area: "Risk and compliance", text: "Each run leaves a record of data, checks and the human decision, which a reviewer can audit." },
    { area: "Fintech teams", text: "A template for keeping multi-agent pipelines running when a data provider fails." },
    { area: "Teaching quantitative finance", text: "Shows the common ways financial ML fools its authors, with tests for each." },
  ],
  related: ["datasentry", "feelfit", "caringu"],
};
