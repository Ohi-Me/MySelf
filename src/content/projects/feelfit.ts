import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/FeelFit";
const SCHEMA = `${REPO}/blob/main/backend/schemas/analysis.py`;
const LAYERS = `${REPO}/blob/main/backend/rag/layers.py`;

export const feelfit: Project = {
  slug: "feelfit",
  title: "FeelFit",
  tagline: "Lab-report understanding with OCR, LOINC mapping and evidence-grounded answers, written so it can never read like a diagnosis.",
  summary:
    "A 10-stage pipeline turns a lab report (PDF, photo or CSV) into structured, LOINC-coded results with plain-language context, and a five-layer retrieval engine grounds every answer in cited evidence. One Next.js codebase targets web, Android and iOS.",
  kind: "product",
  status: "prototype",
  statusNote: "Working prototype, live on the web. Not a medical device and not clinically validated.",
  period: "2026",
  sortDate: "2026-08",
  featured: true,
  domains: ["Health informatics", "Document AI", "Retrieval-augmented generation", "LLM safety"],
  stack: [
    "FastAPI",
    "Pydantic v2",
    "pdfplumber",
    "Tesseract OCR",
    "Groq API (Llama 3.3 70B, Llama 4 vision)",
    "LOINC",
    "OpenFDA / RxNorm / DailyMed",
    "OpenStreetMap (Nominatim, Overpass)",
    "Next.js 14",
    "Capacitor 6",
  ],
  role: "Solo.",
  links: [
    { label: "Live app", href: "https://feelfit.vercel.app", kind: "live" },
    { label: "Repository", href: REPO, kind: "repo" },
  ],

  overview: {
    problem:
      "Lab reports arrive as PDFs, phone photos or CSVs, with the same test written under different names. People want to understand them, but an AI answer must never come from model memory alone or read like a diagnosis or a prescription.",
    solution:
      "A 10-stage pipeline (validation, content-hash cache, text extraction or OCR, LOINC mapping, enrichment, LLM interpretation, schema and banned-phrase validation) plus a retrieval engine over five evidence layers that returns a confidence score and citations with every answer.",
    contribution:
      "Designed and built the backend pipeline, the safety schema, the retrieval engine and the shared web and mobile frontend.",
    outcome:
      "Live web app; Android and iOS projects generated from the same source. Safety rules are enforced in code by the response schema, not left to the prompt.",
  },

  keyMetrics: [
    {
      value: "10",
      label: "pipeline stages from upload to stored result",
      measures: "Distinct stages a report passes through.",
      method: "Upload, validate, cache, extract, LOINC mapping, enrich, LLM, validate, respond, persist.",
      source: "Repository README and backend code.",
      kind: "measured",
      sourceUrl: REPO,
    },
    {
      value: "5",
      label: "retrieval layers behind every answer",
      measures: "Evidence families searched for each question.",
      method: "LOINC; medication (RxNorm, drug data); disease (SNOMED, ICD); specialist (knowledge graph); research.",
      source: "backend/rag/layers.py",
      kind: "measured",
      sourceUrl: LAYERS,
    },
    {
      value: "10",
      label: "blocked clinical phrases rejected by the schema",
      measures: "Phrases such as \"diagnosed with\" or \"you need to take\" that make a response invalid.",
      method: "Pydantic field validators on the summary and on every abnormal-test note.",
      source: "backend/schemas/analysis.py",
      kind: "measured",
      sourceUrl: SCHEMA,
    },
  ],

  plain: [
    {
      type: "p",
      text: "A blood-test report is a page of abbreviations and numbers. FeelFit reads the report, whether it is a PDF, a photo or a spreadsheet, finds each test and its value, and explains in plain language which values are outside the usual range and what is worth discussing with a doctor.",
    },
    {
      type: "p",
      text: "It is careful about what it says. It gives health information, never a diagnosis or a prescription, and every answer to a follow-up question comes with the sources it relied on and how confident it is. If the evidence is not there, it says so instead of guessing.",
    },
    {
      type: "callout",
      tone: "caution",
      text: "FeelFit is a software prototype. It has not been clinically validated or approved and is not a substitute for a doctor.",
    },
  ],

  engineering: [
    {
      id: "pipeline",
      title: "The analysis pipeline",
      blocks: [
        { type: "diagram", id: "feelfit-pipeline", caption: "From upload to response. The two validation stages are where unsafe output is rejected." },
        {
          type: "list",
          items: [
            "**Extraction:** pdfplumber for PDF text, Tesseract OCR for images, a CSV path for exports.",
            "**Normalisation:** extracted test names mapped to standard LOINC codes against a curated local knowledge base, so \"Hb\" and \"Haemoglobin\" become one test.",
            "**Enrichment:** reference ranges and context per test, adjusted by the profile (age, sex, conditions).",
            "**Interpretation:** an LLM served through the Groq API (Llama 3.3 for text, Llama 4 vision for image reports). The models are used as provided; none were trained here.",
            "**Content-hash cache:** an identical upload is answered from the cache instead of re-running the model.",
            "**No client-side keys:** the browser never calls an LLM provider; every AI call goes through the backend.",
          ],
        },
      ],
    },
    {
      id: "safety-schema",
      title: "Safety enforced by the schema",
      blocks: [
        {
          type: "p",
          text: "The response is a strict Pydantic model. If the model's output contains clinical language or an unsupported risk level, validation fails and the response is not returned as is. The rules are code that can be read and tested.",
        },
        {
          type: "code",
          lang: "python",
          caption: "Blocked phrases and two consistency rules, abridged.",
          source: SCHEMA,
          code: `_BLOCKED_PHRASES = [
    "diagnosed with", "you have", "prescribe", "take medication",
    "disease confirmed", "i diagnose", "you are suffering", "treatment is",
    "you need to take", "medication required",
]

class AnalysisOutput(BaseModel):
    summary: str = Field(..., min_length=20, max_length=1000)
    risk_level: RiskLevel
    confidence: float = Field(..., ge=0.0, le=1.0)
    ...
    @model_validator(mode="after")
    def high_risk_needs_evidence(self):
        if self.risk_level == RiskLevel.HIGH and not self.abnormal_tests and not self.alerts:
            raise ValueError("High risk must be backed by abnormal tests or alerts")
        return self

    @model_validator(mode="after")
    def urgent_needs_high_or_moderate_risk(self):
        if self.urgency == Urgency.URGENT and self.risk_level == RiskLevel.LOW:
            object.__setattr__(self, "risk_level", RiskLevel.MODERATE)
        return self`,
        },
        {
          type: "p",
          text: "Two design choices are visible here: a high-risk label must be backed by abnormal tests or alerts, and an urgent recommendation can never sit next to a low risk level. The second is corrected rather than rejected, so the safer reading wins.",
        },
      ],
    },
    {
      id: "rag",
      title: "Medical retrieval: five layers, one retriever",
      blocks: [
        {
          type: "p",
          text: "Each layer is the same hybrid retriever scoped to different source families, so adding a real data source lights up the matching layer without orchestration changes. The engine indexes the local LOINC knowledge base, seed knowledge and knowledge-graph paths at startup with a dependency-free hashing embedder, so it works offline; the embedder and vector store are swappable for production scale. Live drug data from OpenFDA, RxNorm and DailyMed can be switched on with a flag.",
        },
        {
          type: "table",
          columns: ["Layer", "Sources", "Purpose"],
          rows: [
            ["LOINC", "LOINC", "What a laboratory test means"],
            ["Medication", "RxNorm, drug data", "Drug information, interactions, warnings"],
            ["Disease", "SNOMED, ICD", "Condition context and risks"],
            ["Specialist", "Knowledge graph", "Which specialist a finding maps to"],
            ["Research", "Research, Indian guidance", "Recent evidence and guidelines"],
          ],
        },
        {
          type: "p",
          text: "The answer is an evidence bundle with a confidence score and citations; when evidence is insufficient the copilot is instructed to refuse rather than answer from memory.",
        },
      ],
    },
    {
      id: "platforms",
      title: "One codebase, three platforms",
      blocks: [
        {
          type: "p",
          text: "There is exactly one copy of the Next.js app. A static export is wrapped by Capacitor 6 into Android and iOS projects. Every native concern goes through one typed bridge module, mobile CSS is scoped under a single class so the web build is provably unaffected, and the Capacitor configuration disables cleartext HTTP. The doctor finder uses OpenStreetMap (Nominatim geocoding and Overpass search), which needs no API key.",
        },
      ],
    },
  ],

  research: [
    {
      id: "evaluation-status",
      title: "What has and has not been evaluated",
      blocks: [
        {
          type: "callout",
          tone: "caution",
          title: "No accuracy or latency claims",
          text: "The repository lists performance targets (for example, AI analysis under 3 seconds) but no measurements, and there is no labelled benchmark of extraction or LOINC-mapping accuracy yet. This page therefore reports design and safety mechanisms only. Earlier descriptions that cited coverage figures such as \"2,000+ lab tests\" are not used here because the repository does not support them.",
        },
        {
          type: "list",
          items: [
            "Next step: a labelled set of real-format reports to measure extraction and LOINC-mapping accuracy per format (PDF, photo, CSV).",
            "Next step: a red-team set of prompts that try to elicit diagnoses, to measure how often the schema blocks them.",
            "Next step: latency measured per pipeline stage instead of targets.",
          ],
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: [
      "Built the FastAPI backend, extraction and OCR, LOINC mapping and the LLM pipeline.",
      "Designed the safety schema and the five-layer retrieval engine.",
      "Built the shared Next.js frontend and the Capacitor mobile builds.",
    ],
    contributions: [
      "Safety rules enforced as schema validation rather than prompt instructions.",
      "Retrieval that works offline and upgrades layer by layer as real sources are added.",
    ],
    skills: ["FastAPI", "OCR", "RAG", "Pydantic", "LLM APIs", "Next.js", "Capacitor"],
    ownership: "Solo, end to end.",
    impact: ["Live web deployment; mobile projects built from the same source."],
  },

  implemented: [
    "Upload, extraction and OCR for PDF, image and CSV",
    "LOINC mapping against a curated knowledge base",
    "Schema validation with blocked phrases",
    "Five-layer retrieval with confidence and citations",
    "Doctor finder on OpenStreetMap",
    "Capacitor Android and iOS projects",
  ],
  planned: [
    "User authentication",
    "Multi-language support (Hindi, Tamil, Bengali, Marathi)",
    "Wearable and health-app integrations",
    "A clinician review portal",
  ],
  limitations: [
    "No measured accuracy for extraction or mapping yet.",
    "Interpretation quality depends on third-party models served through an API.",
    "Not clinically validated; health information only.",
  ],
  lessons: ["Put safety where it can be tested: in the schema and in code paths, not in the prompt."],
  evidence: [
    { label: "Response schema", href: SCHEMA, note: "Blocked phrases and consistency validators." },
    { label: "Retrieval layers", href: LAYERS, note: "The five layers and their sources." },
    { label: "Live app", href: "https://feelfit.vercel.app", note: "Checked responding on 25 Oct 2026." },
  ],
  related: ["caringu", "orbit", "assessiq"],
};
