import type { Paper } from "../types";

/**
 * Manuscripts that are complete but not yet submitted. Their abstracts and full
 * text are withheld until submission; every result quoted here is already
 * public in the RE-FUSED repository.
 */

const REPO = "https://github.com/Ohi-Me/RE-FUSED";
const RESULTS = `${REPO}/blob/main/Docs/RESULTS.md`;
const ME = { name: "Rohit Kumar", me: true, affiliation: "Centre for AI, NIT Jalandhar" };

export const publicationDelay: Paper = {
  slug: "publication-delay-forecasting",
  title: "What publication delay costs: a pre-registered evaluation of day-ahead forecasting for India's State power systems",
  shortTitle: "What publication delay costs",
  status: "manuscript",
  statusNote: "Complete manuscript prepared for Applied Energy; not yet submitted.",
  venue: "Prepared for Applied Energy",
  year: "2026",
  sortDate: "2026-10",
  authors: [ME],
  authorship: "Sole author (as in the current manuscript)",
  contribution: ["All research, code, analysis and writing."],
  links: [
    { label: "Code and results", href: REPO, kind: "repo" },
    { label: "Results guide", href: RESULTS, kind: "doc" },
  ],
  disclosure: "The abstract and full text are withheld until the manuscript is submitted. The results below are public in the repository.",
  plain:
    "Forecasters of Indian State power data usually assume yesterday's numbers are available today. They are not: some reports come out a day later, some two weeks later. This study forecasts five quantities using only what was public at the time, fixes every choice before looking at the final 17 months, and measures how much the delay costs. The honest forecasts still beat the standard baseline everywhere, but the delay raises error by 15% to 138%.",
  keyMetrics: [
    {
      value: "15.1% – 137.7%",
      label: "increase in scaled error caused by publication delay",
      measures: "Accuracy lost by using inputs only after their measured publication delay.",
      method: "Same model with and without real publication lags; relative change in MASE.",
      source: "Confirmatory period, 34 control areas, pre-registered family F1.",
      kind: "held-out",
      sourceUrl: RESULTS,
    },
    {
      value: "20 of 20",
      label: "forecasting checks supported",
      measures: "Pre-registered accuracy, calibration and delay-cost hypotheses that passed.",
      method: "Holm within the family; 7-day block bootstrap.",
      source: "Family F1; with the context family F2 (7 of 18) the paper reports 27 of 38.",
      kind: "held-out",
      sourceUrl: RESULTS,
    },
  ],
  sections: [
    {
      id: "question",
      title: "Research question",
      blocks: [
        {
          type: "p",
          text: "How accurately can a State's demand, drawal, conventional and renewable generation and the day-ahead price be forecast when each input is used only after it is actually published, and what does that delay cost?",
        },
      ],
    },
    {
      id: "method",
      title: "Methodology",
      blocks: [
        {
          type: "list",
          items: [
            "Forecast issued at 12:00 on day t−1; each source used only after its measured availability lag (1 day for PSP and weather, 2 for CEA generation, 14 for price files).",
            "Thirteen forecasters, among them pretrained models with covariates (Chronos-2) and a context model that weighs each source by how stale it is; combinations chosen per target on a calibration year.",
            "Split-conformal calibration of 80% and 90% intervals.",
            "Pre-registration frozen and hashed before a 17-month evaluation period was opened; scored once on 34 control areas.",
          ],
        },
      ],
    },
    {
      id: "results",
      title: "Results (public)",
      blocks: [
        {
          type: "table",
          caption: "MASE on the evaluation period",
          columns: ["Target", "Final forecaster", "Seasonal naive"],
          numeric: [1, 2],
          rows: [
            ["Demand met", "0.892", "1.338"],
            ["Actual drawal", "0.922", "1.339"],
            ["Conventional generation", "0.859", "1.130"],
            ["Renewable generation", "1.107", "1.615"],
            ["Day-ahead price", "0.741", "1.027"],
          ],
        },
        {
          type: "list",
          items: [
            "80% and 90% intervals within five points of nominal coverage on every target (0.778 – 0.802 and 0.886 – 0.899).",
            "Staleness-aware gating helps on three of five targets; three further context claims, including graceful degradation when a source stops, are not supported and are reported.",
            "Additional analysis (not pre-registered): each 0.1 GWh of mean absolute drawal error per State-day costs about 0.26 Rs crore per day of system-wide settlement regret under a frozen scheduling rule.",
          ],
        },
      ],
    },
  ],
  related: ["re-fused", "india-state-day-panel", "adaptive-risk-aversion-scheduling"],
  topics: ["Time-series forecasting", "Data latency", "Calibration", "Power systems"],
};

export const stateDayPanel: Paper = {
  slug: "india-state-day-panel",
  title: "A provenance-tracked State-day panel of India's power system built from official public reports, 2018–2026",
  shortTitle: "A provenance-tracked State-day panel",
  status: "manuscript",
  statusNote: "Data descriptor prepared for Scientific Data; not yet submitted. The dataset itself is published on Zenodo.",
  venue: "Prepared for Scientific Data",
  year: "2026",
  sortDate: "2026-10",
  authors: [ME],
  authorship: "Sole author (as in the current manuscript)",
  contribution: ["Data acquisition, parsing, validation, documentation and writing."],
  links: [
    { label: "Dataset (Zenodo)", href: "https://doi.org/10.5281/zenodo.23301898", kind: "dataset" },
    { label: "Data guide", href: `${REPO}/blob/main/Docs/DATA.md`, kind: "doc" },
  ],
  disclosure: "The manuscript text is withheld until submission. The dataset and its documentation are public.",
  plain:
    "India publishes detailed daily electricity data, but as thousands of report files whose layouts change over time, spread across several agencies. This paper describes one clean, open table built only from those official reports, where every value can be traced to its source file and every column records how long after the day it becomes public.",
  keyMetrics: [
    {
      value: "104,550 × 107",
      label: "State-days × columns",
      measures: "Size of the published panel.",
      method: "Deterministic build from official files; rebuild reproduces an order-independent content hash.",
      source: "34 control areas, 1 April 2018 – 31 August 2026.",
      kind: "measured",
      sourceUrl: "https://doi.org/10.5281/zenodo.23301898",
    },
    {
      value: "18,233",
      label: "source files, each with URL, retrieval time and SHA-256",
      measures: "Number of official report files behind the panel.",
      method: "Per-source manifests written by the acquisition scripts.",
      source: "Grid-India, CEA and IMD publications.",
      kind: "measured",
    },
  ],
  sections: [
    {
      id: "contents",
      title: "What the dataset contains",
      blocks: [
        {
          type: "kv",
          items: [
            ["One row", "One Grid-India State control area on one day"],
            ["Areas", "34: 28 States and 6 Union Territories"],
            ["Period", "1 April 2018 – 31 August 2026 (3,075 days)"],
            ["Column groups", "Demand, deviation, conventional generation, renewables, prices, carbon, system stress, weather, calendar, availability, quality flags"],
            ["Per column", "Source, unit, availability lag and missing share (field registry)"],
            ["Licence", "CC BY 4.0"],
          ],
        },
      ],
    },
    {
      id: "provenance",
      title: "Provenance and validation",
      blocks: [
        {
          type: "list",
          items: [
            "Original files are not redistributed (the agencies give no open licence for copying); manifests record each file's URL, retrieval time, size and SHA-256, and scripts download and verify them again.",
            "No silent imputation; missing values are counted per field and State.",
            "A rebuild from the raw files reproduces the recorded content hash exactly.",
            "Each variable carries its measured publication delay, so forecasting studies can respect what was known on each day.",
          ],
        },
      ],
    },
  ],
  related: ["re-fused-dataset", "re-fused", "publication-delay-forecasting"],
  topics: ["Open data", "Provenance", "Power systems"],
};

export const adaptiveCorrection: Paper = {
  slug: "adaptive-forecast-correction",
  title: "When does adaptive correction of day-ahead forecasts pay? Evidence from India's power system",
  shortTitle: "When does adaptive correction pay?",
  status: "manuscript",
  statusNote: "Complete manuscript prepared for Energy Conversion and Management; awaiting the co-author's approval before submission.",
  venue: "Prepared for Energy Conversion and Management",
  year: "2026",
  sortDate: "2026-10",
  authors: [ME, { name: "Urvashi Bansal", affiliation: "Centre for AI, NIT Jalandhar" }],
  authorship: "First author",
  contribution: ["Research design, code, experiments, analysis and the draft."],
  links: [
    { label: "Code and results", href: `${REPO}/tree/main/Forecast_Correction_India`, kind: "repo" },
    { label: "Results guide", href: RESULTS, kind: "doc" },
  ],
  disclosure: "The abstract and full text are withheld until the co-author approves and the manuscript is submitted. The results below are public in the repository.",
  plain:
    "A forecast can be improved by learning its usual mistakes and adding a correction. The question is how finely that correction should adapt: one setting for everything, or a different one for every region, hour or day. Finer looks smarter but can just chase noise. On India's data, one simple correction was usually as good or better.",
  keyMetrics: [
    {
      value: "13,374 GWh/yr",
      label: "drawal forecast-error energy removed by one fixed gate",
      measures: "Reduction in the absolute energy of next-day drawal forecast errors across 34 control areas.",
      method: "Interval 10,273 – 17,003. Finer gates were significantly worse in 9 of 36 cases and better in 3.",
      source: "State-day panel, April 2025 – August 2026; additional analysis, not pre-registered.",
      kind: "exploratory",
      sourceUrl: RESULTS,
    },
    {
      value: "5 of 20",
      label: "pre-registered tests supported on all-India hourly data",
      measures: "Whether validation-only rules choose the right level of adaptivity on Indian data.",
      method: "Frozen plan (tag prereg-india-v1), scored once on 1 March – 13 September 2026.",
      source: "Compared with 19 of 23 on New York, European and client data.",
      kind: "held-out",
      sourceUrl: RESULTS,
    },
  ],
  sections: [
    {
      id: "formulation",
      title: "Formulation",
      blocks: [
        {
          type: "equation",
          tex: "\\hat{y} = B + g \\cdot r, \\qquad 0 \\le g \\le 1.5",
          caption: "A base forecast B plus a learned correction r of its usual errors, scaled by a gate g that may be one number or one per series, hour, instance or day.",
        },
        {
          type: "p",
          text: "A finer gate helps only if the variation it exploits is large, persists into operation and outweighs its estimation cost. Two validation-only rules (PART and prequential selection) estimate this criterion.",
        },
      ],
    },
    {
      id: "results",
      title: "Results (public)",
      blocks: [
        {
          type: "list",
          items: [
            "Correction helps weak forecasts most: about a third of the squared error of \"same hour last week\" for demand, net demand and wind, 11–15% for LightGBM, almost nothing for N-HiTS and Chronos.",
            "PART did not predict whether a finer gate would help better than chance on Indian data (0.625, Holm p = 0.43).",
            "Correcting LightGBM's demand forecast cut deviation energy by 5,742 GWh a year but raised a stylised imbalance cost by 469 Rs crore a year.",
            "Prices are the exception: a fixed gate is worse than no correction, while a gate re-learned over time helps.",
          ],
        },
        {
          type: "callout",
          tone: "negative",
          text: "The validation rules that worked on the comparison data did not transfer to India's all-India series, while the energy effect and the missing cost effect did.",
        },
      ],
    },
  ],
  related: ["re-fused", "publication-delay-forecasting"],
  topics: ["Forecast correction", "Adaptivity", "Pre-registration", "Power systems"],
};
