import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/CaringU";

export const caringu: Project = {
  slug: "caringu",
  title: "CaringU",
  tagline: "\"Ask before you act\": a voice-first safety companion for older adults, where fixed rules, not the model, decide anything risky.",
  summary:
    "A self-hosted MCP server with 29 tools, deterministic safety screens, human approvals through MCP elicitation, and an OpenCV 5 pipeline that reads payment QR codes and medicine strips. Runs on Amazon Bedrock or NVIDIA Nemotron.",
  kind: "product",
  status: "prototype",
  statusNote: "Hackathon build with a live demo on sample data. No contest results yet.",
  period: "Oct 2026",
  sortDate: "2026-10",
  featured: true,
  domains: ["Agentic systems", "Model Context Protocol", "Computer vision", "AI safety", "Voice interfaces"],
  stack: [
    "Node.js",
    "MCP SDK (Streamable HTTP, elicitation)",
    "SQLite (node:sqlite)",
    "Python + FastAPI",
    "OpenCV 5",
    "Amazon Bedrock (Nova Pro)",
    "NVIDIA Nemotron on Nebius",
    "Amazon Polly",
    "PayPal sandbox",
    "AWS EC2 Graviton (ARM64)",
  ],
  role: "Solo.",
  links: [
    { label: "Live demo", href: "https://100-55-233-113.sslip.io", kind: "live", note: "sample data" },
    { label: "Repository", href: REPO, kind: "repo" },
  ],

  overview: {
    problem:
      "Older adults face scam calls, fake \"refund\" payment QR codes, double doses and falls, and many will talk to a device but not use an app. A language model alone cannot be trusted with risky actions, and camera photos arrive blurred or tilted.",
    solution:
      "A voice experience whose every message first passes a deterministic safety screen, an MCP server where risky actions pause for a human yes through elicitation, an escalation ladder that moves an unanswered alert to the next family member, and OpenCV checks that refuse rather than guess.",
    contribution: "Designed and built the MCP server, the agent, the safety rules, the vision service, the evaluations and the deployment.",
    outcome:
      "On 640 generated photos the QR reading ladder raised the read rate from 89.7% to 99.5% with no wrong reads at a median 44 ms. 79 automated tests (62 server, 17 vision).",
  },

  keyMetrics: [
    {
      value: "89.7% → 99.5%",
      label: "QR read rate: plain OpenCV call vs the view ladder",
      measures: "Share of payment-code photos decoded correctly.",
      method:
        "QRCodeDetector and QRCodeDetectorAruco over a ladder of views (raw, CLAHE, upscaled, unsharp-masked, adaptive threshold), stopping at the first view that decodes.",
      source: "640 generated photos with controlled distance, blur, tilt, lighting and JPEG damage (docs/lens-eval.md).",
      kind: "measured",
      conclusion: "Generated photos measure robustness to controlled damage, not real-world accuracy on phone photos.",
      sourceUrl: `${REPO}/blob/main/docs/lens-eval.md`,
    },
    {
      value: "0",
      label: "wrong reads in the same evaluation",
      measures: "Codes decoded to the wrong content.",
      method: "Decoded payload compared with the generated ground truth.",
      source: "Same 640-photo evaluation; median 44 ms per photo.",
      kind: "measured",
      sourceUrl: `${REPO}/blob/main/docs/lens-eval.md`,
    },
    {
      value: "24 / 24",
      label: "held-out end-to-end conversations after the safety rework (7 / 24 before)",
      measures: "Scripted conversations that end with the right tool calls and reply, rule-based agent.",
      method: "Held-out sets frozen before the rework; scam detector (40), symptom triage (30), conversations (24).",
      source: "npm run heldout; baseline report in docs/.",
      kind: "validation",
      conclusion:
        "Optimistic: the failures in these sets were seen during development. A blind set written by someone else is the next step.",
      sourceUrl: REPO,
    },
  ],

  plain: [
    {
      type: "p",
      text: "CaringU is a voice companion that sits between an older person and a risky moment. If she says \"a man from the bank wants my OTP\", it tells her to hang up and alerts her son; if he does not respond in three minutes, it alerts her daughter, and then tells her to call 112.",
    },
    {
      type: "p",
      text: "It can also look through the camera. Shown a QR code that promises a refund, it explains that scanning a payment code always sends money, and blocks that payee. Shown a medicine strip, it counts the empty pockets and checks them against the doses she has reported, to catch a double dose.",
    },
    {
      type: "p",
      text: "The important design choice is that the AI only talks. Whether something is a scam, whether a payment is allowed and whether a dose is suspicious are decided by fixed, tested rules, and anything that changes the real world waits for a person to say yes.",
    },
    {
      type: "callout",
      tone: "note",
      text: "The demo uses fictional people and sample data. It simulates a smart speaker in the browser; it is not connected to Alexa or an Echo device, sends no SMS and moves no real money (PayPal sandbox). It is not a medical device.",
    },
  ],

  engineering: [
    {
      id: "architecture",
      title: "Architecture",
      blocks: [
        { type: "diagram", id: "caringu-architecture", caption: "The agent talks to the MCP server like any MCP client. Fixed rules sit between every tool and the database." },
        {
          type: "list",
          items: [
            "**MCP server:** official SDK, protocol 2025-11-25, Streamable HTTP at `/mcp`, session-based, with SSE responses so the server can ask a question in the middle of a tool call. 29 validated tools.",
            "**Two real MCP clients:** the server-side agent, and the family dashboard running in the browser with its own elicitation handler.",
            "**Agent:** Amazon Bedrock Converse API with tool use (Nova Pro by default) or NVIDIA Nemotron on Nebius, with a transparent rule-based planner when neither is configured.",
            "**State:** SQLite through Node's built-in driver; changes are verified by re-reading.",
            "**Deployment:** AWS EC2 Graviton (ARM64, Amazon Linux 2023).",
          ],
        },
      ],
    },
    {
      id: "approvals",
      title: "Approvals enforced by the protocol",
      blocks: [
        {
          type: "p",
          text: "Refills, appointment changes and payments use MCP elicitation: the server sends `elicitation/create` on the stream of the in-flight `tools/call`, and the person answers on their device or the dashboard. The language model never sees or produces the approval. Clients without elicitation fall back to a two-step confirmation id, behind a guard that blocks the model from approving anything unless the user's latest message says yes.",
        },
        {
          type: "table",
          caption: "Payment rules (sandbox), decided before any money moves",
          columns: ["Situation", "What happens"],
          rows: [
            ["Approved payee, within per-payment and daily limits", "The server asks her for a yes, then pays through PayPal"],
            ["New payee, larger amount, or over the daily limit", "Waits for the family to approve, with the reason"],
            ["Payee blocked by Scam Lens, or an unanswered scam alert", "Refused, and the family is told"],
          ],
        },
      ],
    },
    {
      id: "safety-screen",
      title: "The deterministic safety screen",
      blocks: [
        {
          type: "list",
          items: [
            "Symptom triage follows public first-aid red flags (FAST stroke signs, chest pain, breathing trouble, collapse, falls with injury, low-sugar confusion) and handles negation and third parties (\"I don't have chest pain\", \"my friend fell\").",
            "The scam screen follows the common playbook: credential requests, gift cards or crypto, remote-access apps, authority plus threat, family emergency plus money, secrecy. It also recognises legitimate notices so they do not raise alarms.",
            "When the screen fires, the tool runs and the emergency or scam instruction is guaranteed to be in the reply, whatever the model does.",
            "Medication answers say what is recorded, never that a dose is safe.",
          ],
        },
      ],
    },
    {
      id: "vision",
      title: "OpenCV 5: Scam Lens and the strip check",
      blocks: [
        {
          type: "p",
          text: "Scam Lens finds and decodes the code over a short ladder of views and measures blur and brightness, so an unreadable photo gets \"hold it closer and steadier\", never a guess. Fixed rules then decide what the code means: a UPI or PayPal payment code presented as a prize, refund or KYC step is a scam; look-alike bank links, app downloads and crypto requests are scams; shortened or odd-domain links are suspicious.",
        },
        {
          type: "table",
          caption: "Strip check pipeline",
          columns: ["Step", "OpenCV operations"],
          rows: [
            ["Identify the strip", "CLAHE, SIFT, FLANN kNN with Lowe's ratio test, findHomography (USAC_MAGSAC), convexity and area checks; close calls go to normalised cross-correlation of the printed foil"],
            ["Straighten it", "warpPerspective into the reference frame"],
            ["Find cavities", "Canny, morphology, minAreaRect, HoughCircles, clustered with kmeans into a rows × cols grid"],
            ["Full or empty", "CIE Lab distance to the learned pill colour and to the local foil ring, plus a Laplacian texture cue for torn foil"],
          ],
        },
        {
          type: "p",
          text: "The count is reconciled with the dose log: one more empty pocket than recorded triggers a question; two or more, or one more within the minimum gap, raises an urgent possible-double-dose alert.",
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
          caption: "Held-out measures, rule-based agent",
          columns: ["Measure", "Baseline", "After safety rework"],
          rows: [
            ["Scam recall · false alarms on legitimate look-alikes", "45% · 10%", "100% · 0%"],
            ["Symptom triage accuracy · urgent recall · false emergencies", "40% · 50% · 2/8", "97% · 100% · 0/8"],
            ["End-to-end conversations", "7/24", "24/24"],
          ],
          note: "Held-out sets: scam detector 40, symptom triage 30, conversations 24. Frozen before the rework, but their failures were seen during development, so the \"after\" column is optimistic.",
        },
        {
          type: "p",
          text: "The same scripted (32 conversations) and held-out sets were also run with Amazon Bedrock and with NVIDIA Nemotron as the agent; those reports are in the repository.",
        },
        {
          type: "callout",
          tone: "caution",
          title: "What the numbers do not show",
          text: "Scam Lens numbers come from generated photos; real phone photos are reported separately. The conversation sets were written by the developer. Neither establishes real-world accuracy.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: [
      "Built the MCP server, tools and session handling to the 2025-11-25 specification.",
      "Wrote the deterministic safety screens, payment rules and escalation ladder.",
      "Built the OpenCV vision service and its evaluation.",
      "Deployed on AWS (EC2 Graviton) with Bedrock, Polly and an optional Nemotron backend.",
    ],
    contributions: [
      "Approvals through MCP elicitation, so the model can never approve a risky action.",
      "A QR reading ladder that refuses instead of guessing (no wrong reads in evaluation).",
    ],
    skills: ["Model Context Protocol", "Agent design", "OpenCV", "Node.js", "AWS", "Evaluation design"],
    ownership: "Solo, end to end.",
    impact: ["Live demo; 79 automated tests; evaluated with two different model providers."],
  },

  implemented: [
    "MCP server with 29 tools and elicitation",
    "Safety screens, escalation ladder and payment rules",
    "Scam Lens and strip check on OpenCV 5",
    "Family dashboard as a browser MCP client",
    "Bedrock, Nemotron and rule-based agent modes",
  ],
  planned: [
    "Real SMS or push delivery to family members",
    "Accounts and per-caregiver permissions",
    "A blind evaluation set written by someone else",
    "A managed database with backups",
  ],
  limitations: [
    "One household, no authentication.",
    "Simulated speaker; sample data only; sandbox payments.",
    "The live demo runs on a single EC2 instance and stops if the instance is stopped.",
  ],
  lessons: ["Put the approval in the protocol, where the model cannot reach it."],
  evidence: [
    { label: "Repository and README", href: REPO, note: "Architecture, what is real versus simulated, tests and evaluation." },
    { label: "Scam Lens evaluation", href: `${REPO}/blob/main/docs/lens-eval.md`, note: "640-photo robustness evaluation." },
  ],
  pipeline: [
    { title: "Listen", detail: "Voice in on a speaker" },
    { title: "Screen", detail: "Fixed safety rules read every message first" },
    { title: "Reason", detail: "Model (Bedrock or Nemotron) picks a tool" },
    { title: "Guard", detail: "29 MCP tools, each call checked" },
    { title: "Ask", detail: "Risky actions pause for a human yes" },
    { title: "Escalate", detail: "Unanswered alerts move to the next family member" },
  ],
  resolved: [
    {
      issue: "Scam calls and fake \"refund\" payment QR codes aimed at older adults.",
      resolution: "Scam Lens: OpenCV checks plus fixed rules that flag the pattern before money moves.",
    },
    {
      issue: "A language model cannot be trusted with doses, payments or alerts.",
      resolution: "Fixed rules, not the model, decide anything risky, and the MCP server pauses for approval through elicitation.",
    },
    {
      issue: "Camera photos arrive blurred or tilted.",
      resolution: "A QR reading ladder raised the read rate from 89.7% to 99.5% with no wrong reads on 640 generated photos; it refuses rather than guesses.",
    },
    {
      issue: "An alert nobody answers is no alert at all.",
      resolution: "An escalation ladder hands an unanswered alert to the next family member.",
    },
  ],
  impact: [
    { area: "Older adults living alone", text: "A voice companion that checks before acting, for people who will talk to a device but not use an app." },
    { area: "Family caregivers", text: "Alerts, approvals and a shared view from a second app." },
    { area: "Elder-care homes", text: "Dose and fall routines with a record of every decision." },
    { area: "Banks and payment apps", text: "The scam-QR and approval patterns transfer to payment safety checks." },
  ],
  related: ["feelfit", "orbit", "datasentry"],
};
