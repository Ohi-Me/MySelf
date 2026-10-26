import type { Paper } from "../types";

const REPO = "https://github.com/Ohi-Me/RE-FUSED";
const RESULTS = `${REPO}/blob/main/Docs/RESULTS.md`;

export const adaptiveRiskAversion: Paper = {
  slug: "adaptive-risk-aversion-scheduling",
  title:
    "Does Adaptive Risk Aversion Pay? A Pre-Registered Evaluation of Probabilistic Day-Ahead Drawal Scheduling Under India's Deviation Settlement",
  shortTitle: "Does adaptive risk aversion pay?",
  status: "submitted",
  statusNote: "Submitted to IEEE Transactions on Power Systems on 19 October 2026. Not yet accepted; no DOI.",
  venue: "IEEE Transactions on Power Systems",
  year: "2026",
  sortDate: "2026-10",
  authors: [
    { name: "Rohit Kumar", me: true, affiliation: "Centre for AI, NIT Jalandhar" },
    { name: "Urvashi Bansal", affiliation: "Centre for AI, NIT Jalandhar" },
  ],
  authorship: "First and corresponding author",
  contribution: [
    "Conceptualization, methodology, software, data curation, formal analysis, validation, investigation, visualization and the original draft (CRediT roles as submitted).",
    "Co-author Urvashi Bansal: conceptualization, methodology, supervision, project administration, review and editing.",
  ],
  links: [
    { label: "Submitted manuscript (PDF)", href: "/papers/adaptive-risk-aversion-scheduling.pdf", kind: "paper" },
    { label: "Code and results", href: REPO, kind: "repo" },
    { label: "Data (Zenodo)", href: "https://doi.org/10.5281/zenodo.23301898", kind: "dataset" },
    { label: "Results guide", href: RESULTS, kind: "doc" },
  ],
  abstract:
    "A State pays for deviating from its day-ahead drawal schedule in either direction. For 34 Indian control areas we compare rules using a calibrated probability forecast of daily drawal: the forecast median, a fixed rule mixing expected regret and conditional value at risk, that rule with uncertainty- and stress-coupled risk, joint scheduling on copula scenarios and a reinforcement-learning policy. For a stylised daily model of the 2024 settlement we prove the expected regret convex, with the best risk-neutral quantile level bounded by the deviation-rate-to-price ratio. On 516 held-out days, as pre-registered, every rule beats repeating the latest recorded schedule in mean regret (fixed rule: 15.80 against 18.54 crore rupees per day), and no adaptive rule passes its test against the fixed rule. In six Eastern-Region areas the regulatory rules reproduce every official 15-minute block charge within 2.5 rupees, whereas the daily model only approximates them; re-scored per block, adaptivity again does not pay, but the forecast median beats the widened fixed rule. A better forecaster lowers mean system regret by 0.29 crore rupees daily. Schedulers should use one quantile tuned to the actual settlement and improve forecasts.",
  fullText: {
    pdf: "/papers/adaptive-risk-aversion-scheduling.pdf",
    version: "Submitted version",
    date: "19 October 2026",
    note: "The version submitted to IEEE Transactions on Power Systems, under review. It is not the version of record; if the paper is published, the final version will be linked here.",
  },
  plain:
    "Indian States are charged when they draw more or less power than they scheduled the day before. This paper asks whether a smarter, adaptive way of setting tomorrow's schedule saves money compared with one simple, well-chosen rule. Tested on 516 days that were never used to build the rules, the simple rule was as good as anything cleverer, including a reinforcement-learning policy. What did lower the cost was a better forecast.",
  keyMetrics: [
    {
      value: "15.80 vs 18.54",
      label: "Rs crore per day, fixed rule vs repeating the latest schedule",
      measures: "Mean daily system regret: settlement cost above the best schedule in hindsight.",
      method: "Stylised daily model of the 2024 deviation settlement applied to every State's schedule, 34 control areas.",
      source: "516 held-out days, pre-registered family F4.",
      kind: "simulation",
      conclusion: "Under the stylised settlement, any calibrated rule beats repeating the latest schedule; it is not a measured saving.",
      sourceUrl: RESULTS,
    },
    {
      value: "Rs 2.5",
      label: "largest error reproducing 302,400 official 15-minute charges",
      measures: "How exactly the implemented regulatory rules reproduce the published charges.",
      method: "Block-level re-implementation of the settlement for six Eastern-Region areas compared with official ERPC charges.",
      source: "Block-level check in the public repository; 99.9% of blocks within Rs 1.",
      kind: "measured",
      sourceUrl: REPO,
    },
    {
      value: "−0.29",
      label: "Rs crore per day from a better forecaster alone",
      measures: "Change in mean system regret when only the forecast changes.",
      method: "Same rule and settings; interval −0.4522 to −0.1457, Holm p = 5 × 10⁻⁵.",
      source: "Chain test H14, held-out period.",
      kind: "simulation",
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
          text: "Under India's deviation settlement, which rule should turn a calibrated probability forecast of tomorrow's drawal into a schedule; does risk aversion that adapts to forecast uncertainty or system stress pay; and does a better forecast reach the decision?",
        },
      ],
    },
    {
      id: "motivation",
      title: "Motivation and gap",
      blocks: [
        {
          type: "p",
          text: "Deviation charges are asymmetric and depend on market prices and regulation, so the cost of a schedule is a decision problem, not only a forecasting problem. Adaptive risk rules and reinforcement learning are natural candidates, but whether they beat a simple rule under the actual settlement, on data they were not tuned on, is an empirical question. This paper answers it with a pre-registered test.",
        },
      ],
    },
    {
      id: "contributions",
      title: "Contributions",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "A convexity proof for the expected regret under a stylised daily model of the 2024 settlement, with the best risk-neutral quantile bounded by the deviation-rate-to-price ratio.",
            "A pre-registered comparison of five scheduling rules on 516 held-out days for 34 control areas.",
            "A block-level validation that reproduces every official 15-minute charge in six Eastern-Region areas within Rs 2.5, and a re-scoring of the rules per block.",
            "A chain test showing that a better forecast lowers regret with the rule held fixed.",
            "A pre-registered test of a context-aware deviation charge, reported as a negative result.",
          ],
        },
      ],
    },
    {
      id: "formulation",
      title: "Formulation",
      blocks: [
        {
          type: "p",
          text: "A State chooses tomorrow's schedule s from a forecast distribution of drawal y. Regret is the settlement cost of s above the cost of the best schedule in hindsight. Rules are tuned on an objective that mixes the mean and the tail of daily regret:",
        },
        {
          type: "equation",
          tex: "J = \\tfrac{1}{2}\\,\\mathbb{E}[R] + \\tfrac{1}{2}\\,\\mathrm{CVaR}_{0.9}(R)",
        },
        {
          type: "callout",
          tone: "note",
          title: "Background, not the paper's equation",
          text: "With linear costs $c_u$ for drawing more than scheduled and $c_o$ for drawing less, the classical newsvendor result places the optimal schedule at the $c_u/(c_u+c_o)$ quantile of the forecast distribution. The paper proves the analogous convexity result for its stylised settlement model and bounds the best risk-neutral quantile by the deviation-rate-to-price ratio; the exact settlement model is in the manuscript.",
        },
      ],
    },
    {
      id: "method",
      title: "Methodology and experimental design",
      blocks: [
        {
          type: "table",
          caption: "Rules compared",
          columns: ["Rule", "Description"],
          rows: [
            ["P", "The forecast median"],
            ["A2", "One fixed risk level mixing expected regret and CVaR"],
            ["A4s", "The A2 rule with risk coupled to forecast uncertainty and system stress"],
            ["A5", "Joint scheduling on copula scenarios"],
            ["PPO", "A reinforcement-learning policy, 5 seeds"],
          ],
        },
        {
          type: "list",
          items: [
            "Data: the RE-FUSED State-day panel, 34 control areas, built from official reports.",
            "Baselines: repeating the latest recorded schedule; the recorded final schedule with intra-day revisions is shown only as a reference, because it uses same-day information.",
            "Pre-registration: choices frozen and hashed before the evaluation period (1 April 2025 – 31 August 2026) was opened; Holm correction within the family.",
            "Hard limits: no rule may place a State-day outside the historical schedule envelope or the ramp limit (none did).",
          ],
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          type: "table",
          caption: "Daily system regret, Rs crore, 516 held-out days",
          columns: ["Rule", "Mean", "CVaR₀.₉", "J"],
          numeric: [1, 2, 3],
          rows: [
            ["Latest published schedule", "18.54", "47.47", "33.00"],
            ["Forecast median (P)", "15.92", "41.71", "28.82"],
            ["Fixed risk level (A2)", "15.80", "38.51", "27.15"],
            ["Learned policy (PPO)", "15.64", "39.07", "27.35"],
          ],
          note: "PPO is not distinguishably better than A2 on its pre-registered test and has the worse J.",
        },
        {
          type: "callout",
          tone: "negative",
          title: "Negative results",
          text: "No adaptive rule passed its test against the fixed rule. The context-aware deviation assessment did not order observed consequences better than the energy-only measure (estimate 0.0108, interval −0.0154 to 0.0351); forecast information did beat a shuffled placebo.",
        },
      ],
    },
    {
      id: "sensitivity",
      title: "Sensitivity and additional analyses (not pre-registered)",
      blocks: [
        {
          type: "list",
          items: [
            "The best single fixed level is 60%, with mean regret 15.45 Rs crore per day.",
            "The risk-neutral level follows the published rate-to-price ratio (rank correlation 0.87), not forecast uncertainty (0.06) or system stress (0.05).",
            "Choosing the level by uncertainty, stress, price ratio or State, even with hindsight, gains at most 0.7% under the settlement and five alternative designs; a separate level for each day would gain 8.7%, which requires foreknowledge.",
            "A2 beats the forecast median for all 16 forecasters tested; the frozen A2 setting is also the best of its development grid on the evaluation period.",
          ],
        },
      ],
    },
    {
      id: "validity",
      title: "Threats to validity",
      blocks: [
        {
          type: "list",
          items: [
            "The headline comparison uses a stylised daily settlement without the frequency-linked rate; the block-level re-scoring covers six Eastern-Region areas only.",
            "One country and a 17-month evaluation period.",
            "Regret is computed, not observed: no State changed its schedules because of this work.",
          ],
        },
      ],
    },
    {
      id: "reproducibility",
      title: "Reproducibility",
      blocks: [
        {
          type: "p",
          text: "Code, the panel and frozen results are on Zenodo (DOI 10.5281/zenodo.23301898) and GitHub. Re-scoring the stored results reproduces the hypothesis table exactly; every number in the manuscript is generated from result files.",
        },
      ],
    },
  ],
  pipeline: [
    { title: "Forecast", detail: "Calibrated probability forecast of tomorrow's drawal" },
    { title: "Rule", detail: "Median, fixed risk, coupled risk, copula scenarios or PPO" },
    { title: "Schedule", detail: "Kept inside the historical envelope and ramp limit" },
    { title: "Settle", detail: "Stylised daily model of the 2024 deviation settlement" },
    { title: "Regret", detail: "Cost above the best schedule in hindsight, 516 held-out days" },
    { title: "Verify", detail: "Official 15-minute charges reproduced within Rs 2.5" },
  ],
  resolved: [
    {
      issue: "Whether risk aversion that adapts to uncertainty or system stress is worth its complexity had not been tested on held-out data under the actual settlement.",
      resolution: "A pre-registered test on 516 held-out days: no adaptive rule, the PPO policy included, beat one well-chosen fixed rule.",
    },
    {
      issue: "A daily settlement model may not match what States are really charged.",
      resolution: "A block-level re-implementation of the 2024 Regulations reproduces 302,400 official ERPC charges within Rs 2.5, and the rules were re-scored per block.",
    },
    {
      issue: "Do forecast improvements actually reach the scheduling decision?",
      resolution: "A chain test with the rule held fixed: a better forecaster alone lowers mean regret by 0.29 Rs crore per day.",
    },
  ],
  impact: [
    { area: "State load dispatch centres", text: "One quantile tuned to the actual settlement, plus a better forecast, instead of a complex adaptive policy." },
    { area: "Distribution companies", text: "A State's deviation charges end up as costs for the utilities and consumers behind it. The figures here come from a stylised settlement, not observed savings." },
    { area: "Regulators", text: "The best risk-neutral level follows the published rate-to-price ratio, so rule design directly shapes how States schedule." },
    { area: "Grid operators", text: "Schedules closer to actual drawal mean smaller deviations to balance in real time." },
  ],
  revisions: [
    {
      version: "Submitted",
      date: "19 October 2026",
      summary: "Submitted to IEEE Transactions on Power Systems.",
      changes: [
        "The abstract and results add the block-level validation: six Eastern-Region areas, every official 15-minute charge reproduced within Rs 2.5, and the rules re-scored per block.",
        "Sensitivity analyses reported as not pre-registered: the best single fixed level (60%) and the limit of adaptive levels (at most 0.7% gain, even with hindsight).",
      ],
    },
    {
      version: "Pre-submission review",
      date: "10 October 2026",
      summary: "Two departures from the pre-registration found while reviewing the manuscript, recorded and disclosed; nothing re-run.",
      changes: [
        "Tail-day comparisons used a 3-day block bootstrap where the plan said 7-day.",
        "The scored evaluation has 516 days (1 April 2025 – 29 August 2026), two fewer than the pre-registered window.",
      ],
    },
    {
      version: "Confirmatory run",
      date: "18–20 September 2026",
      summary: "Plan frozen and hashed (tag prereg-v1), then the held-out period scored once on the H100 cluster (job 31823).",
      changes: [
        "A first freeze attempt recorded the hash without a git commit; the blinding guard then refused every stage, so no held-out data were read. The freeze step was fixed and re-run with the same plan.",
        "The leakage test's issue days were moved one year forward for the confirmatory phase; its logic is unchanged.",
      ],
    },
    {
      version: "Rebuild",
      date: "February – September 2026",
      summary: "Earlier stages (RE-FUSED-0 to 8) superseded.",
      changes: [
        "All data rebuilt from official reports after an audit found 98.2% of early test-period prices carried forward.",
        "Single-seed results dropped after a 22.5% headline gain did not replicate; the learned policy now runs 5 seeds.",
      ],
    },
  ],
  related: ["re-fused", "publication-delay-forecasting", "india-state-day-panel"],
  topics: ["Decision-making under uncertainty", "Power systems", "Pre-registration", "Reinforcement learning"],
};
