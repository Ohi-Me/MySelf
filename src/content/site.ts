/**
 * Profile facts shown across the site. Every value here is taken from the
 * author's master record (checked 2026-10-24/25), the academic CV, or the
 * public repositories. Ratings are dated because they change.
 */
import type { ExternalLink, Story } from "./types";

export const profile = {
  name: "Rohit Kumar",
  role: "Machine learning researcher and engineer",
  affiliation: "M.Tech, Artificial Intelligence · NIT Jalandhar",
  location: "Jalandhar, Punjab, India",
  email: "therohitkumar.build@gmail.com",
  orcid: "0009-0004-7936-9683",
  /** One sentence used for the default page description. */
  description:
    "Rohit Kumar is an M.Tech AI student at NIT Jalandhar who builds machine-learning systems for forecasting, decisions and retrieval, and evaluates them with pre-registered, held-out tests.",
  statement:
    "I build machine-learning systems that have to keep working when data arrive late, noisy or shifted, and I test them the way experiments are tested: choices frozen first, scored once, failures reported.",
  availability:
    "Open to research and AI/ML engineering roles. Internships from November 2026, full time after the M.Tech ends (May to June 2027).",
};

export const profileLinks: ExternalLink[] = [
  { label: "GitHub", href: "https://github.com/Ohi-Me", kind: "profile" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rohit-kumar-02686a284/", kind: "profile" },
  { label: "ORCID", href: "https://orcid.org/0009-0004-7936-9683", kind: "profile" },
  { label: "Kaggle", href: "https://www.kaggle.com/spicyohi13", kind: "profile" },
  { label: "Zenodo dataset", href: "https://doi.org/10.5281/zenodo.23301898", kind: "dataset" },
];

export const codingProfiles: { label: string; href: string; best: string; current?: string; note: string }[] = [
  {
    label: "Codeforces",
    href: "https://codeforces.com/profile/Ohi-Me",
    best: "1388",
    current: "1128",
    note: "Best rating (Pupil), 26 contests",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/Ohi-me/",
    best: "1663",
    current: "1616",
    note: "668 problems solved, 27 contests",
  },
  {
    label: "CodeChef",
    href: "https://www.codechef.com/users/ohi_me",
    best: "1703",
    current: "1681",
    note: "3-star",
  },
  {
    label: "TensorTonic",
    href: "https://www.tensortonic.com/profile/rohitaryan0613",
    best: "#249",
    note: "Rank on an ML-implementation problem set; 51 solved",
  },
];

export const ratingsCheckedOn = "26 October 2026";

export interface MlCompetition {
  name: string;
  host: string;
  result: string;
  detail: string;
  status: "Completed" | "Ongoing";
  href?: string;
  /**
   * Pipeline, problems resolved and where it applies, for a competition with
   * no project page of its own. A competition with `href` takes these from its
   * project instead.
   */
  story?: Story;
}

/** Machine-learning competitions, shown on /competitions and /experience. */
export const mlCompetitions: MlCompetition[] = [
  {
    name: "RSNA Knee Abnormality Detection",
    host: "Kaggle",
    result: "Rank 542 of 6,425 (top 9%), private AUC 0.943",
    detail: "Solo. The final blend includes credited public models; own models alone scored 0.927 to 0.929 private. No medal is shown on the profile.",
    status: "Completed",
    href: "/projects/rsna-knee",
  },
  {
    name: "Amazon ML Challenge 2026",
    host: "Amazon",
    result: "Team rank 206, final leaderboard, macro F0.5 0.988285",
    detail: "Business entity resolution, 1.73M entities against about 10M records. Team of four.",
    status: "Completed",
    href: "/projects/amazon-ml-entity-resolution",
  },
  {
    name: "ARC Prize 2026, ARC-AGI-2",
    host: "Kaggle",
    result: "Best public leaderboard score 29.44 so far",
    detail: "Faster decoding within a fixed GPU budget. Final results after 2 November 2026.",
    status: "Ongoing",
    href: "/projects/arc-agi-inference",
  },
  {
    name: "Google Gemma 4 Developer Agent",
    host: "Kaggle",
    result: "No final result yet",
    detail: "A coding agent on Gemma 4 served with vLLM. The competition ends on 2 December 2026.",
    status: "Ongoing",
    story: {
      pipeline: [
        { title: "Issue", detail: "A bug report on a private repository, about 5 minutes per task" },
        { title: "Locate", detail: "AST-symbol BM25 over the repository finds the files to change" },
        { title: "Scout", detail: "Reads the code and the related tests, read-only" },
        { title: "Solve ×3", detail: "Three solvers in separate git worktrees, different styles" },
        { title: "Judge", detail: "Runs the tests, checks for regressions, picks one patch" },
        { title: "Submit", detail: "The patch is graded against hidden tests" },
      ],
      resolved: [
        {
          issue: "The competition's graph and embedding tools found the right file in only 34% of tasks (top 10).",
          resolution: "A symbol-level BM25 locator with directory priors: the right file in the top 10 for 89% of 129 local tasks, from the issue text alone.",
        },
        {
          issue: "The local grader passed 0 of 129 reference patches, so no local score could be trusted.",
          resolution: "Rebuilt the scorer's environment with per-task dependency pinning: 105 of 129 reference patches now pass, and those form the evaluation set.",
        },
        {
          issue: "One task at a time left about three quarters of the GPUs' batch capacity idle.",
          resolution: "Measured decoding on 4 × L4, then ran three solvers in parallel for almost no extra wall time.",
        },
      ],
      impact: [
        { area: "Software maintenance", text: "An agent that proposes a tested patch for a reported bug, within a fixed time and tool budget." },
        { area: "Open-source maintainers", text: "Triage help: locating the code an issue is about, even when the report names no function." },
        { area: "On-premise AI", text: "Runs on an open model served locally, so private code never leaves the machine." },
      ],
    },
  },
];

export interface EducationItem {
  degree: string;
  school: string;
  period: string;
  grade: string;
  detail: string;
}

export const education: EducationItem[] = [
  {
    degree: "M.Tech, Artificial Intelligence",
    school: "Dr B R Ambedkar National Institute of Technology Jalandhar (Centre for AI)",
    period: "2025 – 2027",
    grade: "CGPA 8.36 / 10",
    detail:
      "Research on forecasting and decision making for India's power system from public data, advised by Dr Urvashi Bansal.",
  },
  {
    degree: "B.Tech, Electrical and Electronics Engineering",
    school: "International Institute of Information Technology (IIIT) Bhubaneswar",
    period: "2020 – 2024",
    grade: "CGPA 7.56 / 10",
    detail:
      "Co-authored an embedded C++ arc-fault detector (IEEE APSIT 2023) and the analysis code of a renewable-energy study (IJ-ICT 2026).",
  },
];

export interface ExperienceItem {
  title: string;
  org: string;
  period: string;
  points: string[];
  href?: string;
}

export const researchExperience: ExperienceItem[] = [
  {
    title: "M.Tech research: forecasting and scheduling for India's power system (RE-FUSED)",
    org: "Centre for AI, NIT Jalandhar · advisor Dr Urvashi Bansal",
    period: "2025 – present",
    href: "/projects/re-fused",
    points: [
      "Built a State-day panel of India's power system from official reports only (104,550 State-days × 107 columns, 28 States and 6 Union Territories), rebuilt by script and published on Zenodo.",
      "Froze a pre-registration (52 checks, hash recorded) before opening a 17-month evaluation period; 35 checks were supported and the rest are reported.",
      "Final forecasters beat the seasonal naive baseline on all five targets; no adaptive or reinforcement-learning scheduling rule beat a well-tuned fixed rule.",
      "All experiments ran as scheduled jobs on the institute's GPU cluster.",
    ],
  },
  {
    title: "Research proposal, Research Scheme on Power",
    org: "Central Power Research Institute (CPRI), Ministry of Power",
    period: "2026",
    points: [
      "Co-wrote a 36-month, Rs 82.64 lakh proposal on weather-aware forecasting, uncertainty quantification and decision support for Indian power systems, and handled its technical work. Submitted; decision pending. This is a proposal, not a funded project or an appointment.",
    ],
  },
];

export const positions: ExperienceItem[] = [
  {
    title: "Internship Representative",
    org: "Institute Relations, NIT Jalandhar",
    period: "2026 – present",
    points: ["Coordinate internship and placement activity for the cohort."],
  },
  {
    title: "Core member, Photogeeks",
    org: "Advaita tech fest, IIIT Bhubaneswar",
    period: "March 2023",
    points: ["Ran photography, guest coordination and logistics for the annual tech fest (1,500+ attendees)."],
  },
];

export interface Achievement {
  title: string;
  detail: string;
  kind: "leaderboard" | "reported" | "held-out" | "measured";
  href?: string;
  date: string;
}

export const achievements: Achievement[] = [
  {
    title: "Amazon ML Challenge 2026 · team rank 206",
    detail:
      "Final leaderboard, macro F0.5 0.988285, team of four (Team Enigma). Entity resolution of 1.73 million reference businesses against about 10 million noisy records.",
    kind: "leaderboard",
    href: "/projects/amazon-ml-entity-resolution",
    date: "Sep 2026",
  },
  {
    title: "RSNA Knee Abnormality Detection · rank 542 of 6,425",
    detail:
      "Kaggle, completed 22 October 2026, solo, top 9%. Private AUC 0.943. The final blend included public models; no medal is shown on the profile.",
    kind: "leaderboard",
    href: "/projects/rsna-knee",
    date: "Oct 2026",
  },
  {
    title: "Open dataset on Zenodo · sole creator",
    detail:
      "RE-FUSED State-day panel of India's power system with code and frozen results, DOI 10.5281/zenodo.23301898.",
    kind: "measured",
    href: "https://doi.org/10.5281/zenodo.23301898",
    date: "Oct 2026",
  },
  {
    title: "35 of 52 pre-registered checks supported",
    detail:
      "RE-FUSED India programme, scored once on 1 April 2025 to 31 August 2026 after the pre-registration hash was recorded. The unsupported checks are reported.",
    kind: "held-out",
    href: "/projects/re-fused",
    date: "Sep 2026",
  },
  {
    title: "2nd place, Swing 'n' Code",
    detail: "Programming contest, IIIT Bhubaneswar.",
    kind: "reported",
    date: "B.Tech",
  },
];

export interface SkillGroup {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  /** Slugs of projects or papers that show the skill in use. */
  evidence: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "forecasting",
    title: "Probabilistic forecasting and evaluation",
    summary:
      "Day-ahead forecasts with calibrated intervals, judged against honest baselines on data the model never saw.",
    skills: [
      "Gradient-boosted trees (XGBoost, LightGBM)",
      "Deep forecasters (BiLSTM, TFT, PatchTST, N-HiTS)",
      "Pretrained time-series models (Chronos)",
      "Quantile forecasts and split-conformal calibration",
      "MASE, CRPS, pinball loss, interval coverage",
      "Diebold–Mariano tests, block bootstrap, Holm correction",
      "Pre-registration and blinded evaluation",
    ],
    evidence: ["re-fused", "publication-delay-forecasting"],
  },
  {
    id: "decisions",
    title: "Decisions under uncertainty",
    summary: "Turning a forecast distribution into a decision whose cost is measured, not assumed.",
    skills: [
      "Quantile (newsvendor-style) scheduling rules",
      "CVaR and tail-risk objectives",
      "Reinforcement learning (PPO) as a tested baseline",
      "Settlement and cost modelling from regulations",
    ],
    evidence: ["adaptive-risk-aversion-scheduling", "re-fused"],
  },
  {
    id: "retrieval",
    title: "Entity resolution and retrieval at scale",
    summary: "Matching millions of noisy, multilingual records with recall-first blocking and calibrated scoring.",
    skills: [
      "Blocking with sparse TF-IDF and learned n-gram bi-encoders",
      "Cross-encoders (XLM-RoBERTa, bge-reranker) on uncertain pairs",
      "Graph neural networks on candidate graphs",
      "Isotonic calibration and expected-F decoding",
      "Polars and GPU sparse matrix search",
    ],
    evidence: ["amazon-ml-entity-resolution", "assessiq"],
  },
  {
    id: "llm-systems",
    title: "LLM systems, agents and guardrails",
    summary: "Agents whose risky decisions stay in deterministic code, with retrieval, grounding checks and evaluation.",
    skills: [
      "LangGraph state machines with bounded revision loops",
      "MCP servers (JSON-RPC, Streamable HTTP, elicitation)",
      "Hybrid retrieval (BM25 + dense, RRF, reranking)",
      "Schema validation, banned-phrase and grounding checks",
      "Prompt-injection guards and read-only tool design",
      "Scripted and held-out agent evaluation",
    ],
    evidence: ["orbit", "caringu", "feelfit", "datasentry", "assessiq"],
  },
  {
    id: "vision",
    title: "Computer vision and medical imaging",
    summary: "Classical vision pipelines where they are enough, deep models where they are not.",
    skills: [
      "OpenCV (QR decoding ladders, SIFT + homography, Hough)",
      "ConvNeXt classifiers on MRI series",
      "Weak labels from radiology reports with an open LLM",
      "Out-of-core data pipelines (HTTP range reads, zstd caches)",
    ],
    evidence: ["caringu", "rsna-knee"],
  },
  {
    id: "gpu",
    title: "GPU inference and ML systems",
    summary: "Making large models fit and run faster on the hardware actually available.",
    skills: [
      "vLLM serving, batched decoding, tensor parallelism",
      "GPU memory budgeting on shared and partitioned GPUs",
      "Scheduled batch jobs on a shared GPU cluster (PBS)",
      "Stage timing to find bottlenecks",
    ],
    evidence: ["arc-agi-inference", "rsna-knee", "amazon-ml-entity-resolution"],
  },
  {
    id: "data",
    title: "Data engineering and provenance",
    summary: "Datasets that can be rebuilt byte for byte and audited back to their sources.",
    skills: [
      "Parsing official reports whose layouts change over time",
      "SHA-256 manifests and deterministic rebuilds",
      "Leakage tests that respect publication delay",
      "Column-level lineage from SQL",
    ],
    evidence: ["re-fused", "india-state-day-panel", "datasentry"],
  },
  {
    id: "backend",
    title: "Backend and production engineering",
    summary: "Services that degrade gracefully and are covered by tests and CI.",
    skills: [
      "Python, C++, SQL; Node.js",
      "FastAPI, Pydantic, PostgreSQL, pgvector, SQLite",
      "Redis + Arq job queues, Docker, GitHub Actions",
      "pytest and integration tests",
      "Next.js frontends",
    ],
    evidence: ["orbit", "datasentry", "feelfit", "caringu"],
  },
  {
    id: "embedded",
    title: "Embedded and electrical engineering",
    summary: "The B.Tech foundation: signals, protection and real-time code on small hardware.",
    skills: [
      "C++ on Raspberry Pi",
      "ADC sampling over SPI, GPIO relay control",
      "RMS, peak and phase-gap thresholds with hysteresis",
      "Power-system operations and settlement",
    ],
    evidence: ["arc-fault-detection", "renewable-energy-optimization"],
  },
];

export const researchThemes: { title: string; text: string; href: string }[] = [
  {
    title: "Forecasting with data as it is actually published",
    text: "Official data arrive one to fourteen days late. Treating that delay as part of the problem raised forecast error by 15% to 138%, a cost most benchmarks never see.",
    href: "/research/publication-delay-forecasting",
  },
  {
    title: "Does a better forecast reach the decision?",
    text: "Under India's deviation settlement, a better forecaster lowered system regret by 0.29 Rs crore per day in the paper's stylised model, while adaptive risk rules did not beat one fixed quantile.",
    href: "/research/adaptive-risk-aversion-scheduling",
  },
  {
    title: "When does adaptivity pay?",
    text: "Finer, more adaptive forecast corrections help only when the structure they exploit is large, persists and can be estimated. Usually one simple gate is enough.",
    href: "/research/adaptive-forecast-correction",
  },
];

export const principles: { title: string; text: string }[] = [
  {
    title: "Freeze the choices before looking at the test",
    text: "Both finished RE-FUSED programmes were scored once, against a pre-registration whose hash was recorded first. The same habit shows up in competitions as fixed choice rules written before the numbers.",
  },
  {
    title: "Simple baselines must be beaten",
    text: "Three months of model additions were beaten by giving the model yesterday's value. A seasonal naive forecast, a fixed risk level and a rule-based reasoner are the bars every result here clears or fails against.",
  },
  {
    title: "A number smaller than the seed spread is not a finding",
    text: "Re-seeding removed two headline claims from the early RE-FUSED releases. DataSentry reports means over seeds with their spread for the same reason.",
  },
  {
    title: "Audit how the labels were made",
    text: "98.2% of test-period prices in an early panel were carried forward from earlier days. The price claims built on it were withdrawn and the data rebuilt from official sources.",
  },
  {
    title: "Keep risky decisions out of the model",
    text: "In CaringU, FeelFit and DataSentry the language model explains and drafts, while fixed, tested code decides what is safe, what is approved and what runs.",
  },
  {
    title: "Negative results are results",
    text: "No adaptive scheduling rule beat a fixed one; a consequence-aware deviation measure did not beat energy alone; validation-only gate selection did not transfer to India. All three are published as findings.",
  },
];
