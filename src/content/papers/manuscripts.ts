import type { Paper } from "../types";

/**
 * Manuscripts that are complete but not yet submitted. Each is shown in full as a
 * preprint (the latest revised PDF in public/papers), with its abstract and
 * highlights verbatim; every result quoted here is also public in the RE-FUSED
 * repository.
 */

const REPO = "https://github.com/Ohi-Me/RE-FUSED";
const RESULTS = `${REPO}/blob/main/Docs/RESULTS.md`;
const ME = { name: "Rohit Kumar", me: true, affiliation: "Centre for AI, NIT Jalandhar" };

export const publicationDelay: Paper = {
  slug: "publication-delay-forecasting",
  title: "What publication delay costs: a pre-registered evaluation of day-ahead forecasting for India's State power systems",
  shortTitle: "What publication delay costs",
  status: "manuscript",
  statusNote: "Final revised manuscript (26 October 2026) prepared for Applied Energy; not yet submitted. Shown here as a preprint.",
  venue: "Prepared for Applied Energy",
  year: "2026",
  sortDate: "2026-10",
  authors: [ME],
  authorship: "Sole author (as in the current manuscript)",
  contribution: ["All research, code, analysis and writing."],
  links: [
    { label: "Manuscript (PDF)", href: "/papers/publication-delay-forecasting.pdf", kind: "paper" },
    { label: "Code and results", href: REPO, kind: "repo" },
    { label: "Results guide", href: RESULTS, kind: "doc" },
  ],
  abstract:
    "State control areas in India forecast demand, drawal, generation and prices from public data that arrive one to fourteen days after the event, and some sources drop out altogether. We treat this delay as part of the forecasting problem. In a State-day panel of 104,550 rows built only from official reports, every variable enters a forecast only after its measured publication delay. Running the same model as if all data were published at once shows that waiting costs between 15.1 % and 137.7 % of accuracy across five targets. We combine thirteen forecasters, among them pretrained models with covariates and a context model that weighs each source by how stale it is, and fix every choice in a pre-registration before a seventeen-month evaluation period is opened. Scored once on 34 State control areas, the final forecaster beats the seasonal naive and the single model chosen a year earlier on all five targets, and its 80 % and 90 % intervals stay within five points of nominal coverage. Staleness-aware gating helps on three of five targets; three further context claims, including graceful degradation when a source stops, are not supported and are reported as findings. Of the 38 pre-registered checks reported here, 27 are supported. In an additional analysis that was not pre-registered, we pass every forecaster through a frozen day-ahead scheduling rule: each 0.1 GWh of mean absolute error per State-day costs about 0.26 Rs crore per day of system-wide settlement regret.",
  highlights: [
    "State-day forecasts built only from official Indian reports, delays included",
    "Publication delay costs 15.1% to 137.7% of forecast accuracy",
    "Combined forecaster beats seasonal naive and last year's model on all 5 targets",
    "Staleness-aware gating helps on 3 of 5 targets; failed claims reported in full",
    "Each 0.1 GWh of forecast error costs about 0.26 Rs crore a day in settlement",
  ],
  fullText: {
    pdf: "/papers/publication-delay-forecasting.pdf",
    version: "Preprint · final revision",
    date: "26 October 2026",
    note: "Author's final revised manuscript, prepared for Applied Energy and not yet peer reviewed. 49 pages in the journal's double-spaced review layout.",
  },
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
  pipeline: [
    { title: "Reports", detail: "Grid-India, CEA, IMD and price files" },
    { title: "Lag", detail: "Each source's measured availability: 1, 2 or 14 days" },
    { title: "Issue", detail: "Forecast made at 12:00 on day t−1" },
    { title: "Model", detail: "Thirteen forecasters, combined per target" },
    { title: "Calibrate", detail: "Split-conformal 80% and 90% intervals" },
    { title: "Score", detail: "Once, on 17 months, 34 control areas" },
  ],
  resolved: [
    {
      issue: "Forecasts of Indian State power data quietly assume every report is available the next morning.",
      resolution: "Every input is used only after its measured publication delay, which makes the forecasts ones an operator could actually issue.",
    },
    {
      issue: "The cost of that delay had never been measured.",
      resolution: "The same models with and without real lags: delay raises scaled error by 15.1% (drawal) to 137.7% (price).",
    },
    {
      issue: "Prediction intervals are often reported without checking their coverage.",
      resolution: "Split-conformal calibration: coverage within five points of nominal on every target.",
    },
  ],
  impact: [
    { area: "Load forecasting desks", text: "Day-ahead demand and drawal forecasts that beat the seasonal naive baseline (MASE 0.892 and 0.922) using only data that is really available." },
    { area: "Renewable and conventional plants", text: "Next-day generation forecasts with calibrated intervals for scheduling units and fuel." },
    { area: "Power exchanges and traders", text: "Day-ahead price forecast with MASE 0.741 against 1.027 for the baseline." },
    { area: "Data-publishing agencies", text: "A measured case for publishing faster: late reports raise forecast error by 15% to 138%." },
  ],
  revisions: [
    {
      version: "Final check",
      date: "26 October 2026",
      summary: "New title, and every page of the manuscript and supplement read again after rendering.",
      changes: [
        "CEA's State renewable report did not stop in November 2025, it moved to a new portal; the text now says the source dropped out of the listing the pipeline read. Pre-registered results unchanged.",
        "Contribution 2 no longer claims graceful degradation, because that pre-registered check (H7) was not supported.",
        "Appendix tables renumbered A.1–A.6 in page order; figure axes corrected so they agree with the table captions.",
        "Checks: 0 LaTeX errors, 0 undefined references, 0 overfull boxes; abstract 242 words.",
      ],
    },
    {
      version: "Applied Energy revision",
      date: "25 October 2026",
      summary: "Rewritten for Applied Energy against its current Guide for Authors, with the equations matched line by line to the code.",
      changes: [
        "Introduction framed around the State Load Despatch Centres' duty under the 2023 Grid Code (day-ahead demand estimates, published forecast errors).",
        "Related work rewritten with a table of lines of work against what this paper adds; 16 new verified references (63 in all).",
        "Method: quantile sorting named as monotone rearrangement with a proof that it never increases pinball loss; the online gate window, conformal ranks and online weights written exactly as the code computes them.",
        "Proof that the settlement regret is non-negative and zero for a perfect schedule; leakage test, block bootstrap and multiple-testing corrections described and cited.",
        "New discussion paragraph for SLDCs, RLDCs and the regulator; new graphical abstract built from the generated numbers only.",
      ],
    },
    {
      version: "Manuscript complete",
      date: "October 2026",
      summary: "Prepared for Applied Energy; not yet submitted.",
      changes: [
        "Final forecaster fixed per target on a calibration year: stacked weights for demand and drawal, an equal-weight average of the best few models for conventional generation and price, Chronos-2 alone for renewables.",
        "Adds the analysis run after scoring, labelled as such: the settlement value of drawal accuracy across 16 forecasters.",
      ],
    },
    {
      version: "Second confirmatory round",
      date: "September 2026",
      summary: "The final per-target combinations were built on top of the first-round models and scored on the same held-out period.",
      changes: ["Both rounds are kept in the repository so the gain of the combination step can be checked."],
    },
    {
      version: "Pre-registration",
      date: "18 September 2026",
      summary: "Every choice frozen and hashed before the 17-month evaluation period was opened.",
      changes: ["20 accuracy, calibration and delay-cost checks in family F1; all 20 supported."],
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
  statusNote: "Final revised data descriptor (26 October 2026) prepared for Scientific Data; not yet submitted. Shown here as a preprint. The dataset itself is published on Zenodo.",
  venue: "Prepared for Scientific Data",
  year: "2026",
  sortDate: "2026-10",
  authors: [ME],
  authorship: "Sole author (as in the current manuscript)",
  contribution: ["Data acquisition, parsing, validation, documentation and writing."],
  links: [
    { label: "Manuscript (PDF)", href: "/papers/india-state-day-panel.pdf", kind: "paper" },
    { label: "Dataset (Zenodo)", href: "https://doi.org/10.5281/zenodo.23301898", kind: "dataset" },
    { label: "Data guide", href: `${REPO}/blob/main/Docs/DATA.md`, kind: "doc" },
  ],
  abstract:
    "India publishes detailed daily information on electricity demand, scheduling, generation and prices, but as thousands of report files whose layouts change over time, spread across the grid operator, the Central Electricity Authority and the meteorological department. We describe a State-day panel for 34 Indian State control areas from 2018-04-01 to 2026-08-31 (104,550 State-days, 107 variables). It joins, from official sources only, energy met and shortages, scheduled and actual drawal with over- and under-drawal, conventional generation by fuel, renewable generation, bid-area exchange prices and deviation charge rates, system frequency stress, carbon intensity and weather. Every one of the 18,233 source files is recorded with its URL, retrieval time and SHA-256 hash, and the panel can be rebuilt deterministically from the raw files. Each variable carries its measured publication delay, so forecasting studies can respect what was known on each day. Technical validation reproduces the sources' own totals exactly and agrees with an independent copy of the generation data within 1% on 100.0% of 75,485 State-days.",
  fullText: {
    pdf: "/papers/india-state-day-panel.pdf",
    version: "Preprint · final revision",
    date: "26 October 2026",
    note: "Author's final revised data descriptor, prepared for Scientific Data and not yet peer reviewed.",
  },
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
  pipeline: [
    { title: "Acquire", detail: "18,233 official report files" },
    { title: "Manifest", detail: "URL, retrieval time, size and SHA-256 per file" },
    { title: "Parse", detail: "Per-source parsers for changing layouts" },
    { title: "Validate", detail: "QC report; missing values counted, never imputed" },
    { title: "Panel", detail: "104,550 State-days × 107 columns" },
    { title: "Rebuild", detail: "Reproduces the recorded content hash" },
  ],
  resolved: [
    {
      issue: "India's daily power data is spread across thousands of report files from several agencies, in layouts that change over time.",
      resolution: "One table, built deterministically from official files only, with one row per State control area per day.",
    },
    {
      issue: "The agencies give no open licence to copy their files.",
      resolution: "The files are not redistributed; manifests record each file's URL and hash, and scripts download and verify them again.",
    },
    {
      issue: "Forecasting studies cannot tell when each value became public.",
      resolution: "Every column records its measured publication delay in a field registry.",
    },
    {
      issue: "Early versions mixed in data from aggregator websites.",
      resolution: "Rebuilt from Grid-India, CEA and IMD publications only.",
    },
  ],
  impact: [
    { area: "Energy researchers", text: "A CC BY 4.0 panel for forecasting, scheduling and policy studies, with provenance down to the source file." },
    { area: "Utilities and planners", text: "Eight years of State-level demand, generation, price and weather in one place." },
    { area: "Policy analysts", text: "Renewables, carbon and system stress by State over time, traceable to official reports." },
    { area: "Teaching", text: "A real, documented dataset for courses on power systems and time series." },
  ],
  revisions: [
    {
      version: "Scientific Data revision",
      date: "25 October 2026",
      summary: "Restructured to the journal's data descriptor format, with a new cross-portal validation.",
      changes: [
        "Found that CEA moved its daily renewable report to a new portal (gen-re.cea.gov.in) in November 2025; 304 missing days were downloaded and parsed. The 18 days published on both portals agree in all 5,040 parsed cells.",
        "Missing renewables from April 2025 fall from 56.7% to 3.2% in panel version 1.1; version 1.0 stays frozen for the companion papers, which cite its own DOI.",
        "Sections reordered to the journal's template (Methods, Data Records, Data Overview, Technical Validation, Usage Notes, Code Availability); abstract 164 words, title 106 characters.",
        "Input data cited by their exact report pages, not agency homepages; a sentence that called the companion studies 'under review' corrected.",
      ],
    },
    {
      version: "v1.1 prepared",
      date: "October 2026",
      summary: "Adds CEA's daily renewable reports from its new portal (gen-re.cea.gov.in), from 19 November 2025.",
      changes: ["Everything else is identical to version 1.0; validation and the QC report are re-run for 1.1."],
    },
    {
      version: "v1.0.0 published",
      date: "October 2026",
      summary: "Panel, code and documentation released on Zenodo (DOI 10.5281/zenodo.23301898).",
      changes: ["Data descriptor prepared for Scientific Data; not yet submitted."],
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
  statusNote: "Final revised manuscript (23 October 2026) prepared for Energy Conversion and Management; not yet submitted. Shown here as a preprint.",
  venue: "Prepared for Energy Conversion and Management",
  year: "2026",
  sortDate: "2026-10",
  authors: [ME, { name: "Urvashi Bansal", affiliation: "Centre for AI, NIT Jalandhar" }],
  authorship: "First author",
  contribution: ["Research design, code, experiments, analysis and the draft."],
  links: [
    { label: "Manuscript (PDF)", href: "/papers/adaptive-forecast-correction.pdf", kind: "paper" },
    { label: "Code and results", href: `${REPO}/tree/main/Forecast_Correction_India`, kind: "repo" },
    { label: "Results guide", href: RESULTS, kind: "doc" },
  ],
  abstract:
    "Day-ahead demand, drawal and generation forecasts are corrected with models of recent errors, and the weight (gate) on the correction is increasingly specific to a region, hour, observation or time. As forecast errors must be balanced or covered by reserve, we ask when such adaptivity pays in energy terms in India. A finer gate helps only if the variation it exploits is large, persists into operation and outweighs its estimation cost; two validation-only rules estimate this criterion, tested under two pre-registrations on government data. On 34 State control areas (April 2025 to August 2026), one fixed gate removed 13,374 GWh per year (15%) of next-day drawal forecast-error energy (post-hoc analysis), whereas finer gates left significantly more error energy in 9 of 36 cases and less in 3. On all-India hourly series, the validation-only rules, confirmed earlier on New York, European and client data, were not confirmed (5 of 20 tests supported), and no design helped the N-HiTS or Chronos-Bolt forecasts. In exploratory benchmarks, a simple bias correction refitted daily on each forecast's own errors removed 34.7% of the squared error of a LightGBM forecast, against at most 12.7% for any gated design, and gating on top of it added little. Correction lowered forecast-error energy but raised a stylised two-settlement imbalance cost, whereas a deviation-settlement-style charge valued it positively. For Indian control areas, a simple correction refitted on recent errors is the safer default; finer or learned gates need evidence that the structure they exploit persists.",
  highlights: [
    "One fixed gate cut State drawal error energy by 13,374 GWh/yr (post-hoc analysis)",
    "Finer gates added error in 9 of 36 Indian State cases and removed it in 3",
    "Validation-only gate choice was not confirmed on Indian data (5 of 20 tests)",
    "Bias correction refitted daily beat learned gates for 4 of 8 all-India forecasts",
    "Correction value changed sign between stylised and DSM-style settlement rules",
  ],
  fullText: {
    pdf: "/papers/adaptive-forecast-correction.pdf",
    version: "Preprint · final revision",
    date: "23 October 2026",
    note: "Authors' final revised manuscript (with Urvashi Bansal), prepared for Energy Conversion and Management and not yet peer reviewed. The first page is the highlights page the journal asks for.",
  },
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
  pipeline: [
    { title: "Base", detail: "Any day-ahead forecast B" },
    { title: "Learn", detail: "Correction r from B's own past errors, up to day D−2" },
    { title: "Gate", detail: "g: one number, or per series, hour, instance or day" },
    { title: "Select", detail: "PART or prequential rule, validation data only" },
    { title: "Correct", detail: "B + g · r" },
    { title: "Value", detail: "Deviation energy, reserve and imbalance cost" },
  ],
  resolved: [
    {
      issue: "A finer, more adaptive correction looks smarter but can just chase noise.",
      resolution: "A pre-registered ladder from one gate to one per series, hour, instance or day: on India's data one simple gate was usually as good or better.",
    },
    {
      issue: "Validation rules that choose the level of adaptivity worked on other countries' data.",
      resolution: "Tested on India and reported as a negative result: PART did not predict when a finer gate helps (0.625, Holm p = 0.43).",
    },
    {
      issue: "Error metrics alone hide the money.",
      resolution: "Energy and cost reported side by side: 5,742 GWh a year less deviation energy, yet a stylised imbalance cost 469 Rs crore a year higher.",
    },
  ],
  impact: [
    { area: "Grid operators", text: "One fixed gate removed 13,374 GWh a year of drawal forecast error across 34 areas in the additional analysis." },
    { area: "Forecast providers", text: "Correction helps weak forecasts most; for strong deep models it adds almost nothing." },
    { area: "Power traders", text: "For prices a fixed gate hurts and a gate re-learned over time helps." },
    { area: "Reserve planning", text: "A warning: lower error energy did not lower imbalance cost, and the 99% quantiles under-covered." },
  ],
  revisions: [
    {
      version: "Second revision",
      date: "23 October 2026",
      summary: "Rewritten around the benchmark result: for Indian control areas a simple correction refitted on recent errors is the safer default.",
      changes: [
        "Abstract, highlights, results and conclusions now lead with the conventional-correction benchmark; the adaptivity criterion and the pre-registered tests remain the core contribution.",
        "Theory rewritten: assumptions A0–A4, Propositions 1–6 and their proofs in Appendix A after a full mathematical audit.",
        "Literature review rewritten with a table of lines of work; 30 new verified references (92 in all).",
        "Energy and settlement value reported separately: the sign of the imbalance value depends on the settlement rule (stylised two-settlement −469 Rs crore a year, DSM-style buyer rule +186).",
        "Indian government data sources (Grid-India, CEA, IMD, CERC rules) cited where they are used; layout tightened to remove float-only pages.",
      ],
    },
    {
      version: "Revision analyses",
      date: "23 October 2026",
      summary: "Exploratory checks for the Energy Conversion and Management manuscript, with every setting written down before any was run.",
      changes: [
        "Conventional residual corrections as benchmarks (hour-of-day and hour-of-week means, EWMA, an autoregressive remainder, linear error regression).",
        "An error-aware corrector, a LightGBM base forecast refitted every month, and a rolling-origin check of the selection rules.",
        "A bootstrap sensitivity check of the gate-energy valuation on the State panel.",
        "All are labelled exploratory; none changes a pre-registered verdict.",
      ],
    },
    {
      version: "Confirmatory run",
      date: "6 October 2026",
      summary: "All-India hourly study scored once (H100 job 34223) after the plan was frozen (tag prereg-india-v1).",
      changes: [
        "Thread and core limits changed after the cluster stopped three attempts within 35 seconds, before any forecast was written; listed as deviations D1–D3.",
      ],
    },
    {
      version: "Comparison data",
      date: "Before October 2026",
      summary: "The same method, pre-registered earlier, tested on NYISO, European and UCI data: 19 of 23 tests supported.",
      changes: ["Kept as the comparison that shows what did and did not transfer to India."],
    },
  ],
  related: ["re-fused", "publication-delay-forecasting"],
  topics: ["Forecast correction", "Adaptivity", "Pre-registration", "Power systems"],
};
