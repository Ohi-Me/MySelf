import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/LegalLens";

export const legallens: Project = {
  slug: "legallens",
  title: "LegalLens",
  tagline: "Contract risk analysis: upload a contract, get clause-level risk, missing clauses and a downloadable report.",
  summary:
    "A FastAPI service that parses contract PDFs, sorts clauses into 10 types with rule-based logic and returns a risk score with explanations, behind a Next.js frontend.",
  kind: "product",
  status: "prototype",
  statusNote: "Early full-stack prototype, live.",
  period: "Jan 2026",
  sortDate: "2026-01",
  featured: false,
  domains: ["Document analysis", "Full-stack engineering"],
  stack: ["FastAPI", "Pydantic", "Next.js", "Tailwind CSS", "jsPDF", "Docker", "Hugging Face Spaces", "Vercel"],
  role: "Solo.",
  links: [
    { label: "Live app", href: "https://legallenswebapp.vercel.app", kind: "live" },
    { label: "Repository", href: REPO, kind: "repo" },
  ],

  overview: {
    problem: "Reading a contract for risky or missing clauses is slow, and non-lawyers do not know what to look for.",
    solution: "Parse the PDF, sort clauses into 10 types with transparent rules, flag missing critical clauses, and summarise the risk distribution in a downloadable report.",
    contribution: "Built the backend, frontend and deployment.",
    outcome: "A live, deployed prototype. Classification is rule-based.",
  },

  keyMetrics: [],

  plain: [
    {
      type: "p",
      text: "Upload a contract and LegalLens highlights clauses that could be risky, lists important clauses that seem to be missing, and gives an overall risk level with a short explanation you can download as a PDF. It is a reading aid, not legal advice.",
    },
  ],

  engineering: [
    {
      id: "build",
      title: "How it is built",
      blocks: [
        {
          type: "list",
          items: [
            "FastAPI endpoints for text and PDF analysis; Pydantic schemas for clause-level output.",
            "Clauses sorted into 10 types by rules; missing-clause detection against the expected set.",
            "Backend in Docker on Hugging Face Spaces; Next.js frontend on Vercel; report PDF generated client-side with jsPDF.",
          ],
        },
        {
          type: "callout",
          tone: "note",
          title: "What the classifier is",
          text: "The repository's README mentions transformer-based models. The classifier that produces the results is rule-based; an embedding model is computed but not used by it. This page describes what runs.",
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
          type: "p",
          text: "There is no labelled evaluation set, so no accuracy is claimed. A natural next step is a small set of annotated contracts to measure clause-type accuracy and missing-clause recall.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: ["Built a FastAPI backend and a Next.js frontend", "Deployed with Docker on Hugging Face Spaces and Vercel"],
    contributions: ["End-to-end deployment of a document-analysis service"],
    skills: ["FastAPI", "Next.js", "Docker", "Deployment"],
    ownership: "Solo.",
    impact: ["Live prototype."],
  },

  implemented: ["PDF and text analysis endpoints", "Rule-based clause typing and missing-clause checks", "Downloadable risk report"],
  planned: ["OCR for scanned contracts", "Clause similarity search", "User accounts", "A labelled evaluation set"],
  limitations: ["Rule-based classification; no measured accuracy.", "Not legal advice."],
  lessons: ["Describe what actually runs, even when the README says more."],
  evidence: [{ label: "Repository", href: REPO, note: "Code and deployment notes." }],
  pipeline: [
    { title: "Upload", detail: "A contract as PDF" },
    { title: "Parse", detail: "Text split into clauses" },
    { title: "Classify", detail: "10 clause types, transparent rules" },
    { title: "Check", detail: "Flags missing critical clauses" },
    { title: "Report", detail: "Risk distribution, downloadable" },
  ],
  resolved: [
    {
      issue: "Reading a contract for risky or missing clauses is slow.",
      resolution: "Clause-level sorting into 10 types with a summary of the risk distribution.",
    },
    {
      issue: "Non-lawyers do not know what is missing.",
      resolution: "Explicit flags for missing critical clauses.",
    },
    {
      issue: "An opaque model is hard to trust for legal text.",
      resolution: "Rule-based classification whose reasons can be read.",
    },
  ],
  impact: [
    { area: "Small businesses and startups", text: "A first pass before paying for a lawyer's review. Not legal advice." },
    { area: "Freelancers", text: "Spotting a missing payment or termination clause before signing." },
    { area: "Procurement teams", text: "Triage of many vendor contracts so legal time goes to the risky ones." },
  ],
  related: ["assessiq", "feelfit"],
};
