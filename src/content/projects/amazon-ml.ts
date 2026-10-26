import type { Project } from "../types";

const REPO = "https://github.com/Ohi-Me/A_ML";
const LOG = `${REPO}/blob/main/EXPERIMENT_LOG.md`;
const SUBS = `${REPO}/blob/main/submissions/README.md`;

export const amazonMl: Project = {
  slug: "amazon-ml-entity-resolution",
  title: "Business entity resolution at 10 million records",
  tagline:
    "Amazon ML Challenge 2026: matching 1.73 million reference businesses to their noisy, multilingual records across three countries.",
  summary:
    "A recall-first retrieval and calibrated scoring pipeline for cross-source record linkage, with a diagnosed and fixed validation-to-leaderboard gap. Team rank 206 on the final leaderboard, macro F0.5 0.988285.",
  kind: "competition",
  status: "competition",
  statusNote: "Competition finished. Final leaderboard: team rank 206, macro F0.5 0.988285.",
  period: "Sep – Oct 2026",
  sortDate: "2026-09",
  featured: true,
  domains: ["Entity resolution", "Information retrieval", "Multilingual NLP", "Distribution shift", "Calibration"],
  stack: [
    "Python",
    "PyTorch",
    "Polars",
    "XGBoost (CUDA)",
    "XLM-RoBERTa base",
    "bge-reranker-v2-m3",
    "Graph neural network",
    "cuSPARSE sparse search",
    "rapidfuzz",
    "PBS GPU jobs",
  ],
  role:
    "Team Enigma, four members. The public repository and its experiment log are Rohit's (every commit is his); he designed and built the pipeline described here. A teammate ran the final V8 job on the cluster.",
  links: [
    { label: "Code and experiment log", href: REPO, kind: "repo" },
    { label: "Experiment log", href: LOG, kind: "doc" },
    { label: "Submissions and scores", href: SUBS, kind: "doc" },
  ],

  overview: {
    problem:
      "Match every reference business (1.73 million in the test set) to its records in two other sources (about 10 million), where names are transliterated into Indic scripts, legal forms are swapped, addresses are reordered or empty, a country (France) appears only in the test set, and about 40% of test records match nothing.",
    solution:
      "Two GPU retrievers for recall-first blocking, a gradient-boosted pair classifier on about 100 features, multilingual cross-encoders on the uncertain pairs, collective evidence from each entity's other records, and a calibrated decoder that picks, per entity, the set of records with the highest expected F0.5.",
    contribution:
      "Designed and implemented the pipeline and the evaluation protocol, and diagnosed why the best validation system scored worse on the leaderboard: the test set was half as crowded as training in the US, so competition features shifted. Retraining at the test's density fixed it.",
    outcome:
      "Final leaderboard: team rank 206, macro F0.5 0.988285. Candidate recall rose from 0.988 to 0.9929 in the last version, but that version scored lower on validation and was not submitted.",
  },

  keyMetrics: [
    {
      value: "206",
      label: "team rank, final leaderboard",
      measures: "Position of Team Enigma on the competition's final leaderboard.",
      method: "Ranked by the organisers on macro F0.5 over the hidden test labels.",
      source: "Team records (rank card in the repository). The official leaderboard page is not archived in the repository.",
      kind: "reported",
      conclusion: "A team result. Day-by-day ranks are omitted here because two internal records disagree.",
    },
    {
      value: "0.988285",
      label: "macro F0.5, final leaderboard",
      measures: "Per-entity F0.5 averaged over all reference businesses, singletons included; precision weighted about 3× recall.",
      method: "Organisers' metric on the test labels. The submitted file was the V6 system minus 4.3k pairs no other system predicted.",
      source: "submissions/README.md (system T1).",
      kind: "leaderboard",
      conclusion: "Comparable only with other leaderboard scores, never with the validation numbers below.",
      sourceUrl: SUBS,
    },
    {
      value: "0.9883",
      label: "candidate recall, V2 to V6 candidates",
      measures: "Share of true record–entity pairs that survive blocking, so the scorer can see them at all.",
      method: "Measured on the entity-level validation fold against labels; 84.9 million candidate pairs, 8.2 per record.",
      source: "EXPERIMENT_LOG.md, candidate sets C2 v2.",
      kind: "validation",
      conclusion: "Blocking caps the achievable score: a perfect scorer on these candidates reaches 0.99635 on the density-matched validation set.",
      sourceUrl: LOG,
    },
    {
      value: "0.945 vs 0.916",
      label: "AUC on uncertain pairs: XLM-R cross-encoder vs stage-1 model",
      measures: "How well each model ranks true above false pairs among the ~1 million pairs the first stage was unsure about.",
      method: "XLM-RoBERTa base fine-tuned 2 epochs on raw text (native scripts and accents), cross-fitted halves.",
      source: "Validation fold, uncertain band 0.02 ≤ p ≤ 0.98.",
      kind: "validation",
      sourceUrl: LOG,
    },
  ],

  plain: [
    {
      type: "p",
      text: "Imagine three phone books that describe the same shops, written by different people. In one, a shop is \"Ram Marketing Pvt Ltd\"; in another it is written in Hindi script; in a third the address is missing and the name has a typo. The task is to say, for every shop in the first book, which entries in the other two are the same shop, across about ten million entries and three countries.",
    },
    {
      type: "p",
      text: "Comparing every pair would take far too long, so the system first finds a short list of likely matches for each record, then scores each pair with a trained model, asks a stronger language model about the pairs it is unsure of, and finally decides which records to accept so that wrong matches, which cost about three times more than missed ones, stay rare.",
    },
    {
      type: "p",
      text: "The most interesting moment was a failure. A version that looked clearly better in our own testing scored worse on the real leaderboard. The cause was that the real test data had half as many look-alike shops in the US as the training data, so the model saw less competition and accepted too much. Rebuilding the training data to match the test's crowding fixed it.",
    },
  ],

  engineering: [
    {
      id: "problem-data",
      title: "The data and what it implied",
      blocks: [
        {
          type: "table",
          caption: "Data sizes (records)",
          columns: ["", "Source 1 (reference)", "Source 2", "Source 3"],
          numeric: [1, 2, 3],
          rows: [
            ["Train", "2,206,821", "5,034,616", "5,285,603"],
            ["Test", "1,732,544", "4,887,273", "5,082,316"],
          ],
          note: "Test Source 1 by country: India 0.81M, US 0.66M, France 0.26M. France does not appear in training.",
        },
        {
          type: "table",
          caption: "Findings from the data study and what was done about each",
          columns: ["Finding", "Response"],
          rows: [
            ["Only ~11% of true pairs share the same lower-cased name", "Fuzzy retrieval and learned scoring; exact keys found under half the matches (F0.5 0.641)"],
            ["~10% of Source 2/3 names are in Indic scripts, mostly word-by-word transliterations", "A transliteration map learned from training pairs only (1,347 words, 16 states), anyascii as fallback"],
            ["Every Source 2/3 record matches at most one reference entity", "Record-level competition features and a decoder that assigns each record once"],
            ["True pairs always share the country label", "Country blocking is lossless, and the country stays an open label"],
            ["No entity has more than 5 Source 2 or 6 Source 3 records", "The decoder enforces these caps"],
            ["Macro F0.5 per entity: a wrong match costs about 3× a missed one", "Calibrated probabilities and expected-F0.5 decoding per entity"],
          ],
        },
      ],
    },
    {
      id: "architecture",
      title: "Pipeline",
      blocks: [
        {
          type: "diagram",
          id: "er-pipeline",
          caption: "Final pipeline (V6). Dashed boxes run only on the uncertain pairs.",
        },
        {
          type: "steps",
          items: [
            {
              title: "Normalisation",
              text: "Honorific and symbol prefixes stripped, OCR digit swaps fixed (Y0uth, lnc), every legal form mapped to one token, French regions and departments recognised as states.",
            },
            {
              title: "Blocking on the GPU",
              text: "Hashed TF-IDF over name character trigrams, words and address tokens, searched with cuSPARSE sparse-matrix products and an fp16 top-k per country; plus a learned n-gram bi-encoder (hashed n-grams → MLP → 256-d) trained with InfoNCE and state-bucketed in-batch negatives. Recall@20 0.9908 on validation.",
            },
            {
              title: "Candidate union",
              text: "Bi-encoder top-5 plus TF-IDF combined top-3, name top-2 and address top-2: 84.8 million pairs, 8.2 per record, recall 0.988.",
            },
            {
              title: "Pair features and stage 1",
              text: "About 100 features: TF-IDF and embedding cosines, retrieval ranks, competition gaps between candidates, rapidfuzz name and address scores, house-number conflicts, legal-form family. XGBoost on CUDA, cross-fitted so every score is out-of-fold, blended with a no-embedding model as a hedge for unseen France.",
            },
            {
              title: "Cross-encoders on the uncertain band",
              text: "XLM-RoBERTa base and bge-reranker-v2-m3 fine-tuned on raw text re-score the ~1.5% of pairs the first stage is unsure of.",
            },
            {
              title: "Collective rounds",
              text: "An entity's other records vote: records of one entity from the same source share an address 81% of the time, so an easy sibling can link a hard one.",
            },
            {
              title: "Decoder",
              text: "Isotonic calibration, then for each entity the top-k records that maximise expected F0.5 by Monte Carlo on the GPU, with per-source caps.",
            },
          ],
        },
      ],
    },
    {
      id: "decoder",
      title: "Deciding what to accept: expected-F0.5 decoding",
      blocks: [
        {
          type: "p",
          text: "A fixed threshold ignores the metric. Instead, after isotonic calibration, each candidate's probability is treated as the chance it is a true match, and for each entity the decoder picks the set of records whose expected F0.5 is highest.",
        },
        {
          type: "equation",
          tex: "F_{0.5} = \\frac{(1+0.5^2)\\,\\mathrm{TP}}{(1+0.5^2)\\,\\mathrm{TP} + 0.5^2\\,\\mathrm{FN} + \\mathrm{FP}}, \\qquad S^{*}_e = \\arg\\max_{k}\\; \\mathbb{E}\\big[F_{0.5}(\\text{top-}k\\ \\text{records of } e)\\big]",
          caption: "Per-entity F0.5 and the decoding rule; the expectation is estimated by Monte Carlo over the calibrated probabilities.",
          where: [
            ["e", "a reference entity"],
            ["\\text{top-}k", "its k most probable candidate records, after source caps"],
          ],
        },
        {
          type: "p",
          text: "This removed a hand-set threshold and favoured precision as the metric does. Where stage 2 was absent, an explicit threshold-and-margin rule was slightly better, so the final predictor picks whichever rule scores higher on the tuning folds.",
        },
      ],
    },
    {
      id: "operations",
      title: "Running it on a shared GPU cluster",
      blocks: [
        {
          type: "list",
          items: [
            "Every stage is a PBS GPU job on one partition of a shared H100 node, driven by `run_all.sh`, and writes results incrementally so a killed job resumes where it stopped.",
            "Twice, every running job was killed in the same second by an external process; jobs were changed to avoid crossing that time window.",
            "Worker pools hung because named semaphores disappeared from shared memory, so feature stages were rewritten to run in one process with multi-threaded Polars and rapidfuzz.",
            "A race let two jobs land on the same GPU partition; partitions are now claimed with lock files.",
            "Taking top-k along the strided dimension was 5× slower than on a contiguous fp16 copy, found with a small benchmark before the full run.",
            "At the end, 103 GB of cache was copied off the cluster, checked by md5 against the GitHub copy, and deleted, with a manifest of what existed.",
          ],
        },
      ],
    },
  ],

  research: [
    {
      id: "protocol",
      title: "Validation protocol",
      blocks: [
        {
          type: "list",
          items: [
            "Entity-level folds: `fold = crc32(entity id) % 5`; an entity and all its true matches share a fold. Fold 0 (~441k entities) is validation.",
            "The search space during validation is all training entities and records, the same shape as the test problem, so competition from other entities is realistic.",
            "Everything learned (transliteration maps, models, thresholds) is fitted on folds 1–4 only.",
            "Scored with the official macro F0.5 plus pair precision and recall, false positives and negatives, singleton accuracy and candidate recall.",
          ],
        },
      ],
    },
    {
      id: "progression",
      title: "Version history and what each step bought",
      blocks: [
        {
          type: "table",
          caption: "Validation F0.5 by version. Each row names its validation protocol; numbers from different protocols are not compared with each other.",
          columns: ["Version", "Change", "Validation F0.5", "Protocol"],
          numeric: [2],
          rows: [
            ["B0", "Exact keys, deterministic rules", "0.641", "plain"],
            ["V1", "TF-IDF + bi-encoder blocking, 69 features, XGBoost", "0.98171", "SIM19"],
            ["V1.5", "Out-of-fold bi-encoders; number, legal and token features", "0.98519", "SIM19"],
            ["V2", "Normalisation v2, no-embedding blend, stage-2 context", "0.98696", "SIM19"],
            ["V3", "XLM-R cross-encoder + GNN on the candidate graph", "0.99078", "SIM19"],
            ["V6", "Density-matched training, two cross-encoders, collective rounds", "0.99127", "DMS"],
            ["V8", "Wider candidates + pruner", "0.98787", "DMS"],
          ],
          note: "SIM19 simulates the test's share of unmatched records by dropping 19% of entities. DMS also matches the test's density per country.",
        },
      ],
    },
    {
      id: "shift",
      title: "The failure: better on validation, worse on the leaderboard",
      blocks: [
        {
          type: "table",
          caption: "Leaderboard scores of the submitted systems",
          columns: ["System", "Leaderboard F0.5"],
          numeric: [1],
          rows: [
            ["V2", "0.98332"],
            ["V3", "0.982814"],
            ["V4A (chain replay)", "0.981"],
            ["V6", "0.988109"],
            ["V6 + consensus pairs", "0.988059"],
            ["V6 minus pairs no other system predicts (final)", "0.988285"],
          ],
        },
        {
          type: "p",
          text: "V3 was the best system on validation and worse than V2 on the leaderboard. The investigation went in order:",
        },
        {
          type: "steps",
          items: [
            {
              title: "Label-free diff of the submitted files",
              text: "V3 added 106,409 pairs and removed 39,770 compared with V2. Validation had predicted about 2.5× fewer extra accepts at test scale.",
            },
            {
              title: "Code audit",
              text: "Five train/test mismatches were listed (for example, test cosines averaged over five fold models while validation used one held-out model). Replaying the chain the validation way (V4A) scored lower still, so this was not the cause.",
            },
            {
              title: "Ablation by country",
              text: "V3's extra test accepts were in the US (+49.4k, 9.4× what validation predicted); India was consistent. Test-to-validation predicted matches per entity in the US ordered the systems exactly as the leaderboard did.",
            },
            {
              title: "Cause: density",
              text: "The US test set has 0.66 million reference entities against 1.32 million in training, so each record sees half as many look-alike competitors. Competition features shift and the model over-accepts. A simulator reproduced it on labelled data.",
            },
            {
              title: "Fix: V6",
              text: "Rebuild training and validation per country at the test's density (keep 62% of US entities, then drop 19% so their records become distractors) and train, calibrate and tune everything there. Leaderboard 0.988109, the best so far.",
            },
          ],
        },
        {
          type: "callout",
          tone: "result",
          title: "What the evidence shows",
          text: "The validation protocol has to reproduce the test's structure, including how crowded it is, not only its label distribution. Matching the share of unmatched records (SIM19) was not enough.",
        },
      ],
    },
    {
      id: "errors",
      title: "Error analysis",
      blocks: [
        {
          type: "list",
          items: [
            "Misses dominate: about 31.7k false negatives against 1.6k false positives at V3, so recall is about 90% of the validation loss.",
            "68% of blocking misses at depth 5 are records with an empty address whose name is shared by several entities: ambiguous by construction, so the right action is to abstain.",
            "Over half of all misses involve empty-address records. A name-sibling signal was tested and found too weak: only 40% of such records have a same-name sibling, and only half of that group belongs to the same entity.",
            "Record ids carry no information (Spearman 0.001 for true and random pairs), checked before ruling them out.",
            "Loss decomposition for V6 on the density-matched set: about 0.0037 from blocking and 0.0051 from the scorer.",
          ],
        },
        {
          type: "callout",
          tone: "negative",
          title: "A higher ceiling that scored lower",
          text: "V8 widened the candidates to recall 0.9929 and pruned them to 2.1 pairs per record, raising the perfect-scorer ceiling from 0.99635 to 0.99759. Its validation score fell to 0.98787, below V6, and it showed the same US over-acceptance pattern. It was not submitted.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: [
      "Built the retrieval, feature, model and decoding pipeline for 1.73 million entities and about 10 million records.",
      "Designed the entity-level validation protocol and the test-prior simulations (SIM19, density-matched).",
      "Ran every stage as resumable GPU batch jobs on a shared cluster.",
      "Led the investigation of the validation-to-leaderboard gap.",
    ],
    contributions: [
      "Recall-first blocking with two GPU retrievers (0.988 candidate recall).",
      "Expected-F0.5 decoding instead of a hand-set threshold.",
      "Diagnosis of the density shift and the density-matched training that fixed it.",
    ],
    skills: [
      "Entity resolution",
      "Information retrieval",
      "Gradient boosting and cross-encoders",
      "Calibration and decision rules",
      "Distribution-shift debugging",
      "GPU batch computing",
    ],
    ownership: "Pipeline design and implementation, in a four-person team.",
    impact: ["Team rank 206 on the final leaderboard, macro F0.5 0.988285."],
  },

  implemented: [
    "Normalisation with a learned transliteration map",
    "TF-IDF and bi-encoder blocking on the GPU",
    "XGBoost stages, cross-encoders, GNN, collective rounds",
    "Isotonic calibration and expected-F0.5 decoding",
    "SIM19 and density-matched validation universes",
  ],
  planned: [],
  limitations: [
    "The official leaderboard page is not archived in the repository; the rank comes from team records.",
    "Validation numbers come from two different protocols and are not comparable with each other or with the leaderboard.",
    "Empty-address records with shared names remain largely unresolvable from the data given.",
  ],
  lessons: [
    "Make validation match the test's structure, including density, not just its labels.",
    "When validation and leaderboard disagree, diff the submissions before changing the model.",
    "A higher ceiling is worthless if the scorer cannot reach it.",
  ],
  evidence: [
    { label: "Experiment log", href: LOG, note: "Every experiment with its candidate recall, precision, recall, F0.5 and runtime." },
    { label: "Submissions and scores", href: SUBS, note: "Leaderboard score of each submitted system." },
    { label: "Repository", href: REPO, note: "Code, reports and run logs." },
  ],
  pipeline: [
    { title: "Normalise", detail: "Transliteration, legal forms, OCR fixes, states" },
    { title: "Retrieve", detail: "TF-IDF and bi-encoder GPU top-k, blocked per country" },
    { title: "Classify", detail: "XGBoost on about 100 pair features" },
    { title: "Re-rank", detail: "Multilingual cross-encoders on uncertain pairs only" },
    { title: "Vote", detail: "An entity's other records add evidence" },
    { title: "Decode", detail: "Calibrated, expected-F0.5 choice per entity" },
  ],
  resolved: [
    {
      issue: "Names transliterated into Indic scripts, legal forms swapped, addresses reordered or empty.",
      resolution: "A normalisation stage with learned transliteration, legal-form and OCR corrections before any matching.",
    },
    {
      issue: "Comparing 1.73 million references with about 10 million records pair by pair is out of reach.",
      resolution: "Recall-first blocking per country with two GPU retrievers: about 85 million candidate pairs at recall 0.988.",
    },
    {
      issue: "The best validation system scored worse on the leaderboard.",
      resolution: "Diagnosed a density shift (the US test set was half as crowded as training) and retrained at the test's density.",
    },
    {
      issue: "About 40% of test records match nothing, so a forced match costs precision.",
      resolution: "Isotonic calibration turns scores into probabilities, and the decoder keeps only the set of records with the highest expected F0.5.",
    },
  ],
  impact: [
    { area: "E-commerce and marketplaces", text: "Merging duplicate sellers and catalogue listings written in different scripts and formats." },
    { area: "Banking and KYC", text: "Linking one customer or business across onboarding, payments and compliance records." },
    { area: "Government registries", text: "Joining business records across tax, company and licensing databases that never shared an identifier." },
    { area: "Supply chains", text: "Cleaning supplier master data so spend and risk roll up to the right company." },
  ],
  related: ["re-fused", "assessiq"],
};
