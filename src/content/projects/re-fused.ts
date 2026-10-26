import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/RE-FUSED";
const RESULTS = `${REPO}/blob/main/Docs/RESULTS.md`;

export const refused: Project = {
  slug: "re-fused",
  title: "RE-FUSED",
  tagline:
    "Forecasting, uncertainty and scheduling decisions for India's power system, built from official data and tested under a pre-registration.",
  summary:
    "An M.Tech research programme that turns 18,233 official grid reports into an open State-day dataset, forecasts five targets a day ahead using data only as it is published, and tests whether better forecasts and adaptive rules lower deviation charges.",
  kind: "research",
  status: "research",
  statusNote:
    "Both studies are complete and scored. One paper submitted (IEEE TPWRS, 19 Oct 2026), three manuscripts complete, dataset published. The thesis is not yet written.",
  period: "Feb 2026 – present",
  sortDate: "2026-10",
  featured: true,
  domains: ["Time-series forecasting", "Power systems", "Uncertainty quantification", "Decision-making", "Reproducibility"],
  stack: [
    "Python 3.10",
    "PyTorch 2.5",
    "LightGBM",
    "XGBoost",
    "neuralforecast (TFT, PatchTST, N-HiTS, TiDE)",
    "BiLSTM",
    "Chronos-2 / Chronos-Bolt",
    "PPO",
    "PBS GPU jobs",
    "LaTeX build pipeline",
  ],
  role: "Sole designer and implementer. Supervised by Dr Urvashi Bansal, NIT Jalandhar, who co-authors Papers 2 and 4.",
  links: [
    { label: "Code repository", href: REPO, kind: "repo" },
    { label: "Dataset (Zenodo, v1.0.0)", href: "https://doi.org/10.5281/zenodo.23301898", kind: "dataset" },
    { label: "Results guide", href: RESULTS, kind: "doc" },
  ],

  overview: {
    problem:
      "Each Indian State schedules its power drawal a day ahead and pays charges when it deviates in either direction. The data it could forecast from arrive one to fourteen days late, in thousands of reports whose layouts change, and studies usually pretend the data arrive instantly.",
    solution:
      "An open State-day panel built from official reports only; five day-ahead forecasts that use each source only after its measured publication delay; calibrated intervals; and scheduling rules scored against the settlement, with every choice frozen in a pre-registration before a 17-month evaluation period was opened.",
    contribution:
      "Designed and built everything: data acquisition and parsers, the panel, forecasting and gating models, scheduling rules and a PPO baseline, the statistics, the integrity audit and the manuscripts.",
    outcome:
      "35 of 52 pre-registered checks supported. Forecasts beat the seasonal naive baseline on all five targets with calibrated intervals. In the stylised settlement, a fixed quantile rule cut mean regret from 18.54 to 15.80 Rs crore per day, and no adaptive rule beat it. Dataset published; one paper submitted.",
  },

  keyMetrics: [
    {
      value: "35 of 52",
      label: "pre-registered checks supported",
      measures: "How many of the frozen confirmatory hypotheses passed their test.",
      method:
        "One-sided tests at 5%, Holm-corrected within each family and Benjamini–Yekutieli across all primary tests, with 7-day block bootstrap intervals over days.",
      source:
        "Confirmatory run on 1 April 2025 – 31 August 2026, 34 State control areas, scored once after the pre-registration hash was recorded (PBS job 32207 re-scored it identically).",
      kind: "held-out",
      conclusion:
        "Forecasting passed 20 of 20, scheduling 6 of 9, context gating 7 of 18, deviation assessment 1 of 2, adaptivity 1 of 3. A supported check is not the same as a large effect.",
      sourceUrl: RESULTS,
    },
    {
      value: "0.741 – 1.107",
      label: "MASE of the final forecasters (seasonal naive 1.027 – 1.615)",
      measures: "Mean absolute scaled error on the evaluation period; below the seasonal naive value means better than that baseline.",
      method: "Mean absolute error divided by the in-sample error of a 7-day seasonal naive forecast, averaged over control areas.",
      source: "Five targets (demand met, drawal, conventional generation, renewable generation, day-ahead price), confirmatory period.",
      kind: "held-out",
      conclusion:
        "The final forecaster beats the seasonal naive on every target. Renewable generation stays above 1.0, so it still loses to an in-sample naive benchmark on that scale.",
      sourceUrl: RESULTS,
    },
    {
      value: "15.1% – 137.7%",
      label: "extra scaled error from waiting for data to be published",
      measures: "How much worse the same model forecasts when inputs are used only after they are actually public.",
      method:
        "Same model run twice: with each source lagged by its measured publication delay, and as if every report arrived at once. Relative increase in MASE.",
      source: "Pre-registered family F1, confirmatory period. Lowest for drawal, highest for the day-ahead price.",
      kind: "held-out",
      conclusion: "Publication delay is a first-order cost that benchmarks with instant data do not see.",
      sourceUrl: RESULTS,
    },
    {
      value: "15.80 vs 18.54",
      label: "mean daily regret, Rs crore: fixed rule vs repeating the latest schedule",
      measures: "System-wide settlement cost above the best schedule in hindsight, per day.",
      method:
        "Each rule sets every State's schedule from the calibrated forecast; the cost is computed with a stylised daily model of the 2024 deviation settlement on 516 held-out days.",
      source: "Pre-registered family F4, 34 control areas.",
      kind: "simulation",
      conclusion:
        "Valid inside the stylised daily settlement (no frequency-linked rate). It is not a measured saving of any State.",
      sourceUrl: RESULTS,
    },
    {
      value: "−0.2914",
      label: "Rs crore per day: change in regret from a better forecast alone",
      measures: "Whether forecast quality reaches the decision when the rule is held fixed.",
      method: "Same rule and settings; only the forecast changes. Interval −0.4522 to −0.1457, Holm p = 5 × 10⁻⁵.",
      source: "Chain test H14, confirmatory period.",
      kind: "simulation",
      conclusion: "A better forecast lowers the stylised settlement cost; the size depends on the settlement model.",
      sourceUrl: RESULTS,
    },
    {
      value: "104,550 × 107",
      label: "State-days × columns in the open panel",
      measures: "Size of the published dataset.",
      method: "Built deterministically from 18,233 official files; a rebuild reproduces the content hash.",
      source: "34 control areas (28 States and 6 Union Territories), 1 April 2018 – 31 August 2026.",
      kind: "measured",
      sourceUrl: "https://doi.org/10.5281/zenodo.23301898",
    },
  ],

  plain: [
    {
      type: "p",
      text: "Every day, each Indian State tells the grid operator how much electricity it will draw from the national grid tomorrow. If it draws more or less than it promised, it pays a charge. A better forecast of tomorrow should mean smaller charges.",
    },
    {
      type: "p",
      text: "Two things make this harder than a textbook exercise. The reports a forecaster needs arrive late: some the next morning, some two weeks later. A model that quietly uses numbers that were not yet public looks far better on paper than it would in a control room. And it is easy to keep adjusting a model until it looks good on the test data, at which point the test no longer measures anything.",
    },
    {
      type: "p",
      text: "RE-FUSED collects 18,233 official report files into one clean, open table. It forecasts using only what was public at the time, and it writes down every modelling choice, and the tests that decide success, before looking at the final 17 months of data. Then it scores everything exactly once.",
    },
    {
      type: "p",
      text: "The honest forecasts still beat the standard baseline on every target, and their uncertainty ranges mean what they say. Waiting for data costs a lot of accuracy. A simple rule, always scheduling at the same well-chosen point of the forecast, beat what actually happened in the cost model, and cleverer adaptive rules, including reinforcement learning, did not beat the simple one. Better forecasts did lower the cost.",
    },
    {
      type: "callout",
      tone: "note",
      text: "The money figures come from a simplified daily model of the settlement rules, applied to real held-out days. They show which rule is better under that model, not what any State actually saved.",
    },
  ],

  engineering: [
    {
      id: "architecture",
      title: "System architecture",
      blocks: [
        {
          type: "p",
          text: "The work is one pipeline from official reports to a scored decision. Every stage is a named step in a single driver, `run_all.py`, which knows which GPU or CPU batch job each stage belongs to, skips stages that are already done, and writes a log and a completion record for each.",
        },
        {
          type: "diagram",
          id: "refused-chain",
          caption: "The RE-FUSED chain. Solid boxes are pre-registered stages; the dashed boundary is the blinding guard that keeps the evaluation period locked until the pre-registration hash is recorded.",
        },
        {
          type: "code",
          lang: "bash",
          caption: "One driver for every stage, on a laptop or on the cluster.",
          source: `${REPO}/tree/main/India_Grid_Study`,
          code: "python run_all.py status          # which stages are done\npython run_all.py stage o2_tft    # run one stage\npython run_all.py submit          # on the cluster: submit all PBS jobs with dependencies\npython run_all.py local           # anywhere: run all stages one after another",
        },
      ],
    },
    {
      id: "data",
      title: "Data acquisition and the State-day panel",
      blocks: [
        {
          type: "p",
          text: "Everything comes from three Government of India publishers: Grid Controller of India (Grid-India), the Central Electricity Authority (CEA) and the India Meteorological Department (IMD). The original files are not redistributed because the agencies give no open licence for copying; instead each source folder keeps a manifest with the URL, download time, size and SHA-256 of every file, and the acquisition scripts can fetch and verify them again.",
        },
        {
          type: "table",
          caption: "Sources joined into the panel",
          columns: ["Publisher", "Product", "What it contributes"],
          rows: [
            ["Grid-India", "Daily Power Supply Position report", "Energy met, peak demand, scheduled and actual drawal, deviation, shortage, frequency"],
            ["Grid-India", "Deviation Settlement Mechanism files", "Deviation rates and day-ahead and real-time market prices per bid area"],
            ["CEA", "National Power Portal daily generation", "Conventional generation by station and fuel"],
            ["CEA", "Daily renewable energy reports", "Renewable generation by State (publication ended 18 Nov 2025)"],
            ["CEA", "CO₂ baseline database", "Emission factors by station, for carbon intensity"],
            ["IMD", "Gridded rainfall and temperature", "Weather averaged over each State"],
          ],
        },
        {
          type: "list",
          items: [
            "**Deterministic parsers** per source, with a field registry that records each column's source, unit, conversion and availability lag.",
            "**Entity registry** that maps renamed control areas onto one key (for example the merged Dadra and Nagar Haveli and Daman and Diu).",
            "**Rebuild check:** `build_verify` rebuilds the panel into a separate folder and compares an order-independent content hash with the recorded one.",
            "**No silent imputation** of targets or outcome variables; missing values stay missing and are counted per field and State.",
          ],
        },
        {
          type: "kv",
          items: [
            ["Rows × columns", "104,550 × 107"],
            ["Control areas", "34 (28 States and 6 Union Territories)"],
            ["Period", "1 April 2018 – 31 August 2026 (3,075 days)"],
            ["Non-missing values", "10,169,383"],
            ["Source files", "18,233, each with URL, time and SHA-256"],
            ["Licence", "CC BY 4.0 (data), MIT (code)"],
          ],
        },
      ],
    },
    {
      id: "information-set",
      title: "Forecasting with data as published",
      blocks: [
        {
          type: "p",
          text: "Publication timing was measured before any modelling, from Grid-India API metadata and HTTP headers: the daily PSP report appears about 10.6 hours after the day ends (median) and the deviation price files about 8.8 days after. A forecast is issued at 12:00 on day t−1 for days t to t+2, and a column may enter it only once its lag has passed.",
        },
        {
          type: "equation",
          tex: "x_{j,s} \\in \\mathcal{I}_{t} \\iff s \\le t - 1 - \\ell_j",
          caption: "Information set at forecast origin t: the value of source j for day s is usable only if it was already published.",
          where: [
            ["\\mathcal{I}_t", "information available when the forecast for day t is issued"],
            ["\\ell_j", "measured availability lag of source j, in days (1 for PSP and IMD, 2 for CEA, 14 for price files)"],
          ],
        },
        {
          type: "p",
          text: "A leakage test in `codes/tests` fails the build if any feature would have been unknown at forecast time. A sensitivity run with every source ending at t−1 (\"instant publication\") measures what the delay costs.",
        },
      ],
    },
    {
      id: "models",
      title: "Models and how the final forecaster was chosen",
      blocks: [
        {
          type: "table",
          caption: "Forecasting families tried, by development round",
          columns: ["Round", "Models", "Role"],
          rows: [
            ["Anchors", "Seasonal naive (7-day), persistence, moving average", "Baselines every model must beat"],
            ["Round 1", "LightGBM; BiLSTM; Temporal Fusion Transformer; PatchTST; Chronos-Bolt zero-shot", "≥ 5 seeds each, selection on validation MASE"],
            ["Round 2", "XGBoost; N-HiTS, TiDE, BiTCN, NBEATSx; Chronos-2 and Chronos-base", "Closing the gaps round 1 left"],
            ["Combination", "Top-k average, stacked weights, lag-aware online weights", "The final forecaster is chosen per target"],
          ],
        },
        {
          type: "p",
          text: "The final forecaster was fixed per target on a 365-day calibration window and is the same for every control area: stacked weights for demand and drawal, an equal-weight top-k average for conventional generation (Chronos-2 and XGBoost) and for price (six members), and Chronos-2 alone for renewable generation.",
        },
        {
          type: "p",
          text: "Uncertainty comes from quantile outputs at τ ∈ {0.05, 0.10, 0.25, 0.5, 0.75, 0.90, 0.95}, recalibrated with split-conformal prediction at three levels of adaptivity: global, per State, and per State and regime.",
        },
      ],
    },
    {
      id: "gating",
      title: "Context gating (LA-MCAG)",
      blocks: [
        {
          type: "p",
          text: "Context such as market prices, generation mix, weather and system stress arrives with different delays. The latency-aware multi-context adaptive gate learns how much to trust each context block, weighing it by how stale it is, and scales the temporal representation element by element. It was compared with a matched fixed fusion that has the same parameter count, and with null, permuted and market-only context as placebos.",
        },
        {
          type: "equation",
          tex: "\\tilde{h} = \\sigma\\!\\left(W_c\\, c + b\\right) \\odot h",
          caption: "Gated fusion: the context vector c produces a gate between 0 and 1 for each element of the temporal representation h.",
          where: [
            ["h", "temporal representation from the forecaster"],
            ["c", "context vector (market, mix, environment, reliability, weather), with staleness features"],
            ["\\sigma", "logistic sigmoid"],
          ],
        },
        {
          type: "callout",
          tone: "negative",
          title: "Outcome",
          text: "7 of 18 checks in this family were supported. Staleness-aware gating helped on three of five targets; graceful degradation when a source stops was not supported and is reported as a finding.",
        },
      ],
    },
    {
      id: "scheduling",
      title: "Scheduling rules",
      blocks: [
        {
          type: "p",
          text: "Each rule turns the calibrated forecast distribution of tomorrow's drawal into a schedule. The tuning objective mixes the mean and the tail of the daily regret, so that a rule cannot win by being cheap on average and ruinous on bad days.",
        },
        {
          type: "equation",
          tex: "J = \\tfrac{1}{2}\\,\\mathbb{E}[R] + \\tfrac{1}{2}\\,\\mathrm{CVaR}_{0.9}(R)",
          caption: "Tuning objective over daily system regret R.",
          where: [
            ["R", "settlement cost above the best schedule in hindsight, Rs crore per day"],
            ["\\mathrm{CVaR}_{0.9}", "mean of the worst 10% of days"],
          ],
        },
        {
          type: "table",
          columns: ["Arm", "What it does"],
          rows: [
            ["P", "Schedule the forecast median"],
            ["A2", "One fixed risk level: a fixed mix of expected regret and CVaR"],
            ["A4s", "Risk level coupled to forecast uncertainty and system stress"],
            ["A5", "Joint scheduling on copula scenarios to control the system-wide tail"],
            ["PPO", "Reinforcement-learning policy, 5 seeds, on GPU"],
          ],
        },
        {
          type: "p",
          text: "Hard limits are checked, not assumed: no arm places a single State-day outside the historical schedule envelope or the ramp limit. Computation is 0.07 to 0.19 ms per State-day.",
        },
      ],
    },
    {
      id: "blinding",
      title: "Blinding, integrity and reproducibility",
      blocks: [
        {
          type: "p",
          text: "The evaluation period is locked in code. The data loader refuses reserved-period rows unless three independent conditions hold, so a careless run during development cannot peek at the test.",
        },
        {
          type: "code",
          lang: "python",
          caption: "The blinding guard, abridged.",
          source: `${REPO}/blob/main/India_Grid_Study/codes/refused/guard.py`,
          code: `def confirmatory_unlocked(verbose=False):
    reasons = []
    if os.environ.get("REFUSED_CONFIRMATORY") != "1":
        reasons.append("REFUSED_CONFIRMATORY is not 1")
    h = hashlib.sha256(open(PREREG, "rb").read()).hexdigest()
    if open(SHAFILE).read().split()[0] != h:
        reasons.append("pre-registration changed after hashing")
    tags = subprocess.run(["git", "tag", "--list", "prereg-v1"], ...).stdout
    if "prereg-v1" not in tags:
        reasons.append("git tag prereg-v1 missing")
    return (not reasons, reasons) if verbose else (not reasons)`,
        },
        {
          type: "steps",
          items: [
            { title: "Pre-registration hash", text: "Matches the frozen record." },
            { title: "Frozen choice files", text: "The 42 frozen choice files and the scoring script are unchanged." },
            { title: "Panel content hash", text: "Matches for 104,550 × 107." },
            { title: "Re-scoring", text: "Re-scoring the stored predictions reproduces the hypothesis table exactly (35 of 52)." },
          ],
        },
        {
          type: "p",
          text: "Every number in every manuscript is a macro generated from a result file; a build step fails if a macro is used without being defined, and a final check recompiles each submission archive from scratch and compares its text with the delivered PDF. The environment is pinned (Python 3.10, PyTorch 2.5.1 with CUDA 12.1); `neuralforecast` is installed without its dependencies on purpose, because it declares a newer PyTorch than the validated one.",
        },
        {
          type: "callout",
          tone: "caution",
          title: "What reproducible means here",
          text: "Re-scoring from stored results is exact and checked automatically, and the dataset rebuild is deterministic. Retraining depends on the GPU: seeds are fixed, but different hardware can change the last digits. The earliest stages ran in unpinned notebooks and are not reproducible in the strict sense.",
        },
      ],
    },
  ],

  research: [
    {
      id: "questions",
      title: "Research questions",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "How well can each State's demand, drawal, generation and market price be forecast a day ahead, using data only as it is actually published?",
            "How should a State set its day-ahead schedule when deviations from it are charged, and does a better forecast lower that charge?",
            "When does adaptive correction of a day-ahead forecast actually help, and when does it only add noise?",
            "Can all of this be released as an open dataset that anyone can rebuild from the original reports?",
          ],
        },
        {
          type: "p",
          text: "One hypothesis runs through every component: an adaptive part (a context gate, regime-specific calibration, an uncertainty-coupled risk level) pays only when the variation it exploits is large, persists into deployment, and can be estimated from the data available. The research design writes this as a crossing condition.",
        },
        {
          type: "equation",
          tex: "2\\langle h_V, h_T\\rangle - \\lVert h_V \\rVert^2 > \\frac{\\Delta V}{n}",
          caption: "Persistence-adjusted crossing condition from the research design: refine only when the heterogeneity seen in validation (h_V) persists into the test period (h_T) by more than the added estimation variance.",
          where: [
            ["h_V,\\ h_T", "heterogeneity of the optimal setting in the validation and test periods"],
            ["\\Delta V / n", "extra estimation variance of the finer design, per observation"],
          ],
        },
      ],
    },
    {
      id: "evolution",
      title: "How the research changed, and what failed",
      blocks: [
        {
          type: "p",
          text: "RE-FUSED went through nine stages in seven months. The early ones failed in instructive ways, and each failure changed the method.",
        },
        {
          type: "steps",
          items: [
            {
              title: "RE-FUSED-0 (Feb – Aug 2026): an ambitious pipeline",
              text: "An 18-State panel with carbon-aware gating, a price model, distributionally robust dispatch and reinforcement learning, on a GTX 1660 Ti. Gradient-boosted trees on the residual from yesterday's value beat every deep model (MASE 0.377 vs persistence 0.408).",
            },
            {
              title: "RE-FUSED-1 (17 Aug): inputs, not architecture",
              text: "Giving every target its own history cut each family's error by 49.9% to 56.7%. Four leaky features were refit on training data only.",
            },
            {
              title: "RE-FUSED-1 to 4: claims that did not survive",
              text: "A random-noise control gate beat the real carbon gate (14.08% vs 15.29% MAPE). A 22.5% volatility reduction was one seed; the same code gave −7.7% in the next release, with ±20.9 points of spread over five seeds.",
            },
            {
              title: "RE-FUSED-4 (21 Aug): audit the labels",
              text: "98.2% of test-period prices were carried forward from earlier days (median run 31 days) and 78.01% sat at the price cap. Price skill had never been measurable; the price work was withdrawn.",
            },
            {
              title: "RE-FUSED-5 and 6 (12 Sep): ask a question the data can answer",
              text: "The panel was rebuilt from official sources, a baseline ladder fixed first (persistence beat the operator schedule), and seven defects in the previous stage were diagnosed. The most adaptive correction gate was almost never the best one.",
            },
            {
              title: "RE-FUSED-7 and 8 (13 – 21 Sep): pre-register, then score once",
              text: "The gated-correction study (19 of 23 checks supported) and the India programme (35 of 52) were each frozen, hashed and scored once on the GPU cluster.",
            },
          ],
        },
      ],
    },
    {
      id: "design",
      title: "Study design",
      blocks: [
        {
          type: "diagram",
          id: "refused-splits",
          caption: "Time splits. The reserved period was replayed once, after the pre-registration was frozen; during development the loader refused its rows.",
        },
        {
          type: "table",
          caption: "Pre-registered hypothesis families",
          columns: ["Family", "What it tests", "Supported"],
          numeric: [2],
          rows: [
            ["F1", "Forecast accuracy, interval calibration and the cost of publication delay", "20 of 20"],
            ["F2", "Context gating against matched fusion, and the carbon block", "7 of 18"],
            ["F3", "Consequence-aware assessment of deviations", "1 of 2"],
            ["F4", "Risk-aware scheduling and the forecast-to-decision chain", "6 of 9"],
            ["F5", "How finely a forecast correction should adapt", "1 of 3"],
            ["Total", "", "35 of 52"],
          ],
        },
        {
          type: "p",
          text: "Evidence unit: the State-day panel, resampled in 7-day blocks with all States together. Pairwise forecast comparisons use the Diebold–Mariano test with the Harvey–Leybourne–Newbold correction. Thresholds follow the proposal: p < 0.05, at least five seeds, coverage within ±5 points, uncertainty beating a placebo, and zero hard-limit violations.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          type: "chart",
          caption: "MASE on the confirmatory period, final forecaster vs seasonal naive. Lower is better; the line marks 1.0.",
          chart: {
            type: "dumbbell",
            valueLabel: "Final forecaster",
            baselineLabel: "Seasonal naive",
            reference: { at: 1, label: "1.0" },
            domain: [0.6, 1.7],
            lowerIsBetter: true,
            rows: [
              { label: "T1 demand met", value: 0.892, baseline: 1.338 },
              { label: "T2 actual drawal", value: 0.922, baseline: 1.339 },
              { label: "T3 conventional generation", value: 0.859, baseline: 1.13 },
              { label: "T4 renewable generation", value: 1.107, baseline: 1.615 },
              { label: "T5 day-ahead price", value: 0.741, baseline: 1.027 },
            ],
          },
          note: "Source: Docs/RESULTS.md and results/paper/confirm/numbers.tex in the public repository.",
        },
        {
          type: "p",
          text: "The 80% and 90% intervals have measured coverage of 0.778 – 0.802 and 0.886 – 0.899, inside the pre-registered ±5 point band on every target. The final forecaster also beats the model selected a year earlier on every target.",
        },
        {
          type: "chart",
          caption: "Mean daily system regret on 516 held-out days, Rs crore, stylised daily settlement. Lower is better.",
          chart: {
            type: "bars",
            unit: "Rs crore / day",
            domain: [0, 20],
            lowerIsBetter: true,
            rows: [
              { label: "Latest published schedule", value: 18.54, display: "18.54" },
              { label: "Forecast median (P)", value: 15.92, display: "15.92" },
              { label: "Fixed risk level (A2)", value: 15.8, display: "15.80", emphasis: true },
              { label: "Learned policy (PPO)", value: 15.64, display: "15.64" },
            ],
          },
          note: "PPO's lower mean is not distinguishable from A2 and its tail (J 27.35) is worse than A2's (27.15). The recorded final schedule including intra-day revisions (2.27) is a reference only, because it uses same-day information.",
        },
        {
          type: "table",
          caption: "Scheduling arms, 516 held-out days",
          columns: ["Arm", "Mean", "CVaR₀.₉", "J"],
          numeric: [1, 2, 3],
          rows: [
            ["Latest published schedule", "18.54", "47.47", "33.00"],
            ["Forecast median (P)", "15.92", "41.71", "28.82"],
            ["Fixed risk level (A2)", "15.80", "38.51", "27.15"],
            ["Learned policy (PPO)", "15.64", "39.07", "27.35"],
          ],
        },
        {
          type: "callout",
          tone: "negative",
          title: "Negative results, reported as findings",
          text: "No adaptive rule beat a well-tuned constant risk level; the coupled and system-tail arms were not better than A2, and the learned policy was not distinguishably better. The consequence-aware deviation measure did not rank observed consequences better than the energy-only measure (estimate 0.0108, interval −0.0154 to 0.0351).",
        },
      ],
    },
    {
      id: "additional",
      title: "Additional analyses (not pre-registered)",
      blocks: [
        {
          type: "p",
          text: "These ran after the confirmatory scoring, read only stored results, and are labelled as not pre-registered wherever they appear.",
        },
        {
          type: "table",
          columns: ["Finding", "Value"],
          rows: [
            ["Money value of accuracy", "2.63 Rs crore per day per GWh of mean absolute drawal error (interval 2.32 – 2.89), across 16 forecasters"],
            ["Where the best fixed level sits", "Median 0.58; follows the deviation-rate-to-price ratio (rank correlation 0.87), not forecast uncertainty (0.06)"],
            ["Limit of adaptive risk levels", "Choosing the level by uncertainty, stress, price ratio or State, even with hindsight, gains at most 0.7%"],
            ["What would gain", "A separate level for each day gains 8.7%, which needs foreknowledge of the day: that is what a better forecast supplies"],
            ["One correction gate, in energy", "13,374 GWh a year of drawal forecast error removed over 34 areas (interval 10,273 – 17,003)"],
          ],
        },
      ],
    },
    {
      id: "correction",
      title: "Companion study: when does adaptive correction pay?",
      blocks: [
        {
          type: "diagram",
          id: "refused-correction",
          caption: "Gated forecast correction: a learned correction of a base forecast's usual errors, scaled by a gate.",
        },
        {
          type: "equation",
          tex: "\\hat{y} = B + g \\cdot r, \\qquad 0 \\le g \\le 1.5",
          caption: "The gate g can be one number for everything, or one per series, hour, instance or day.",
        },
        {
          type: "p",
          text: "On New York, European and client data, 19 of 23 pre-registered tests were supported, and a validation-only diagnostic (PART) predicted the sign of refinement gains with 0.75 accuracy. On India's all-India hourly series only 5 of 20 were supported: PART did not beat chance (0.625, Holm p = 0.43). Correction lowered deviation energy in both settings but did not lower the stylised imbalance cost.",
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
            "The settlement used for scheduling is stylised: daily, without the frequency-linked rate. A block-level re-scoring on six Eastern-Region areas reproduced the official 15-minute charges within Rs 2.5, but the daily model only approximates them.",
            "One country; the State study's evaluation window is 17 months and the hourly study's about 6½.",
            "CEA stopped the daily State renewable report after 18 November 2025, so the renewable target is evaluated at State level up to that date.",
            "Some publisher data (NYISO) can be revised; per-month content hashes show where a fresh download differs.",
            "Single-researcher project: the integrity checks are automated, but the pre-registration was written and audited by the same person.",
          ],
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: [
      "Designed the research programme, its hypotheses and its pre-registration.",
      "Built acquisition, parsing and validation for 18,233 official files and published the dataset.",
      "Implemented forecasting, gating, scheduling and reinforcement-learning baselines, and ran them as GPU batch jobs.",
      "Wrote the statistics, the integrity audit and the manuscript build pipeline.",
    ],
    contributions: [
      "Treated publication delay as part of the forecasting problem and measured its cost (15% to 138%).",
      "Showed with a pre-registered chain test that forecast quality reaches the scheduling decision.",
      "Reported that adaptive and RL scheduling rules did not beat a fixed one, instead of tuning until they did.",
    ],
    skills: [
      "Probabilistic forecasting",
      "Evaluation design and statistics",
      "Python, PyTorch, gradient-boosted trees",
      "GPU batch computing",
      "Data engineering and provenance",
      "Scientific writing",
    ],
    ownership: "End to end and solo: from downloading the first report to the submitted paper, with supervision from Dr Urvashi Bansal.",
    impact: [
      "Open dataset with DOI, citable and rebuildable from source.",
      "One journal paper submitted (IEEE TPWRS); three further manuscripts complete.",
      "Basis of a co-written CPRI research proposal (submitted, decision pending).",
    ],
  },

  implemented: [
    "Acquisition with manifests and SHA-256 checks for every source file",
    "State-day panel and all-India 15-minute and hourly series",
    "Forecasting rounds 1 and 2, combination and conformal calibration",
    "LA-MCAG context gating with placebo ablations",
    "Scheduling arms P, A2, A4s, A5 and PPO",
    "Blinding guard, confirmatory run and integrity audit",
    "Manuscript build with generated number macros",
  ],
  planned: [
    "Zenodo version 1.1 with the additional-analysis scripts (built, waiting for upload)",
    "Submitting Papers 1, 3 and 4",
    "The M.Tech thesis (chapter plan exists; writing not started)",
  ],
  limitations: [
    "Stylised daily settlement model for all money figures.",
    "One country and one 17-month evaluation window.",
    "Renewable State-level target limited by a discontinued report.",
  ],
  lessons: [
    "Inputs beat architecture: yesterday's value did more than three months of model additions.",
    "A result smaller than the seed-to-seed spread is not a result.",
    "Audit how labels were made before modelling them.",
    "Freeze the choices before looking at the test period, and lock the test period in code.",
  ],
  evidence: [
    { label: "Results guide", href: RESULTS, note: "Every number on this page, with the result file it comes from." },
    { label: "Research design", href: `${REPO}/blob/main/India_Grid_Study/codes/design/01_research_design.md`, note: "Questions, data, splits and metrics, fixed before any model result." },
    { label: "Blinding guard", href: `${REPO}/blob/main/India_Grid_Study/codes/refused/guard.py`, note: "Code that locks the evaluation period." },
    { label: "Zenodo record", href: "https://doi.org/10.5281/zenodo.23301898", note: "Panel, code and frozen results, version 1.0.0." },
  ],
  pipeline: [
    { title: "Collect", detail: "18,233 official Grid-India, CEA and IMD files, each hashed" },
    { title: "Build", detail: "State-day panel, 104,550 × 107, rebuild hash-checked" },
    { title: "Lag", detail: "Each source enters only after its measured publication delay" },
    { title: "Forecast", detail: "Five targets, combined per target, conformal 80% and 90% intervals" },
    { title: "Decide", detail: "Schedule set at one tuned quantile of the forecast" },
    { title: "Score", detail: "Settlement regret on 516 held-out days, pre-registered" },
  ],
  resolved: [
    {
      issue: "An audit of the early panel found 98.2% of test-period market prices carried forward from an earlier day, so price skill could not be measured.",
      resolution: "Rebuilt every column from official reports only; each value traces to a source file with its URL, retrieval time and SHA-256.",
    },
    {
      issue: "Forecasting studies usually assume yesterday's reports are available today, which leaks information the operator does not have.",
      resolution: "Each input is used only after its measured availability lag (1 to 14 days), and a leakage test guards the rule.",
    },
    {
      issue: "A 22.5% volatility reduction turned out to be one seed; the same code gave −7.7% in the next release.",
      resolution: "Single-seed claims were dropped, the PPO baseline runs 5 seeds, and every choice was frozen in a hashed pre-registration before scoring.",
    },
    {
      issue: "Thousands of reports whose layouts change over eight years.",
      resolution: "Per-source parsers with manifests and a deterministic build whose content hash a rebuild reproduces exactly.",
    },
  ],
  impact: [
    {
      area: "State load dispatch centres",
      text: "A day-ahead drawal schedule from a calibrated forecast and one tuned quantile. Under the stylised settlement, mean regret fell from 18.54 to 15.80 Rs crore per day across 34 areas.",
    },
    {
      area: "Power plants and generators",
      text: "Next-day forecasts of conventional and renewable generation with calibrated intervals, the inputs for unit commitment and fuel planning.",
    },
    {
      area: "Regulators and settlement",
      text: "The settlement rules reproduce official 15-minute charges within Rs 2.5, so the effect of a rule change on what States pay can be tested before it is adopted.",
    },
    {
      area: "Researchers and analysts",
      text: "An open CC BY panel of India's power system with publication delays recorded per column.",
    },
  ],
  related: ["adaptive-risk-aversion-scheduling", "publication-delay-forecasting", "india-state-day-panel", "adaptive-forecast-correction"],
};
