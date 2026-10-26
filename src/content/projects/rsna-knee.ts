import type { Project } from "../types";

export const rsnaKnee: Project = {
  slug: "rsna-knee",
  title: "Knee MRI abnormality detection with labels from reports",
  tagline: "RSNA Knee Abnormality Detection on Kaggle: an out-of-core MRI pipeline, LLM labels from radiology reports, and a correction for how different sites write reports.",
  summary:
    "With only 58 expert-labelled studies among 4,407, labels were read from radiology reports by an open LLM and models were trained on a 65 GB cache built without downloading the 570 GB dataset. Final rank 542 of 6,425 (top 9%), solo.",
  kind: "competition",
  status: "completed",
  statusNote: "Competition finished 22 October 2026. No medal is shown on the Kaggle profile.",
  period: "Oct 2026",
  sortDate: "2026-10",
  featured: false,
  domains: ["Medical imaging", "Weak supervision", "LLM labelling", "Data engineering", "Distribution shift"],
  stack: ["PyTorch", "ConvNeXt", "Qwen3-32B (open LLM, labels)", "zstd", "HTTP range requests", "PBS GPU jobs", "Kaggle notebooks"],
  role: "Solo.",
  links: [{ label: "Kaggle profile", href: "https://www.kaggle.com/spicyohi13", kind: "profile" }],

  overview: {
    problem:
      "Detect 12 knee abnormalities from MRI. Of 4,407 training studies only 58 had expert labels; the rest had free-text radiology reports. The image archive was 570 GB, far more than the available disk.",
    solution:
      "An out-of-core cache built from HTTP byte-range reads of the remote zip, labels read from reports by an open LLM, ConvNeXt models trained on GPU batch jobs, and a correction for site-specific reporting habits found by checking against the 58 expert labels.",
    contribution: "All of it, solo: data pipeline, labelling, training, evaluation against the expert labels, and the submission notebooks.",
    outcome:
      "Rank 542 of 6,425 (top 9%) with private AUC 0.943. The final blend included public models (credited); my own models alone scored 0.940 – 0.942 public and 0.927 – 0.929 private.",
  },

  keyMetrics: [
    {
      value: "542 / 6,425",
      label: "final rank (top 9%)",
      measures: "Position on the final private leaderboard.",
      method: "Ranked by the organisers on macro ROC-AUC over 12 findings.",
      source: "Kaggle profile, checked 24 October 2026.",
      kind: "leaderboard",
      conclusion: "Top 9% would normally be in the bronze range, but no medal is shown on the profile, so none is claimed.",
      sourceUrl: "https://www.kaggle.com/spicyohi13",
    },
    {
      value: "570 GB → 65 GB",
      label: "remote archive to local cache, 0 failures",
      measures: "Size of the source archive and of the compressed training cache built from it.",
      method: "Zip central directory read once; each series fetched with one HTTP range read of the signed URL, decoded in memory, resized and zstd-compressed.",
      source: "4,407 studies cached on the GPU cluster's scratch disk.",
      kind: "measured",
    },
    {
      value: "0.943",
      label: "private AUC of the final blend (own models alone 0.927 – 0.929)",
      measures: "Macro ROC-AUC on the hidden private test set.",
      method: "Final submission: public models (credited) blended with my models and the site correction.",
      source: "Kaggle private leaderboard.",
      kind: "leaderboard",
      conclusion: "My own models lost 0.015 – 0.017 from public to private, more than the top teams (about 0.010).",
    },
  ],

  plain: [
    {
      type: "p",
      text: "The task was to spot problems such as torn ligaments or arthritis in knee MRI scans. Almost none of the training scans had expert answers, but almost all had the radiologist's written report, so a language model read each report and turned it into labels for training.",
    },
    {
      type: "p",
      text: "The scans filled 570 GB, much more than the disk available, so the pipeline read only the pieces it needed straight from the online archive and stored a compressed 65 GB copy.",
    },
    {
      type: "p",
      text: "Comparing with the 58 expert-labelled scans showed that hospitals differ in how often they mention some findings, which is a habit of writing, not a difference in disease. Removing that habit from the labels helped on the hidden test set too.",
    },
  ],

  engineering: [
    {
      id: "out-of-core",
      title: "An out-of-core data pipeline",
      blocks: [
        { type: "diagram", id: "knee-pipeline", caption: "Building the training cache without downloading the archive, and the label path from reports." },
        {
          type: "list",
          items: [
            "The zip's central directory is read once to find each series' byte range.",
            "Each series is fetched with a single HTTP range read and decoded in memory, never written to disk raw.",
            "Per series: uint8 slices in a canonical orientation, longer side at most 384 px, compressed with zstd; metadata into a parquet index.",
            "Resumable: a completion file per study, so a killed job continues where it stopped. 4,407 studies, 0 failures.",
          ],
        },
      ],
    },
    {
      id: "labels",
      title: "Labels from radiology reports",
      blocks: [
        {
          type: "p",
          text: "An open LLM (Qwen3-32B) read each report and produced the 12 findings. Its agreement with the 58 expert labels was AUC 0.862; later label versions blended it with other public label sets and with out-of-fold predictions of trained models (a teacher), each checked against the expert labels before use.",
        },
        {
          type: "callout",
          tone: "note",
          text: "With 58 expert labels, every comparison has wide uncertainty. Choices were made only when they helped across all nine models checked, not on a single model's score.",
        },
      ],
    },
    {
      id: "training",
      title: "Training and submission",
      blocks: [
        {
          type: "list",
          items: [
            "Baseline ConvNeXt-T at 256 px, 16 slices × 5 slots, 12 epochs, 5 folds: out-of-fold macro AUC 0.868 against report labels and 0.881 against the expert labels; first public score 0.919.",
            "A separate side classifier (left or right knee) agreed with DICOM tags 98.7% of the time; the LLM's side reading had been the noisy signal.",
            "Training ran as PBS jobs on GPU partitions, one job at a time, with chained dependencies for train, package and submit.",
            "Submission notebooks ran on Kaggle T4 GPUs in fp16 (bf16 fails on T4).",
          ],
        },
      ],
    },
  ],

  research: [
    {
      id: "site-bias",
      title: "Finding: reports differ by site, not only by disease",
      blocks: [
        {
          type: "p",
          text: "Adding a per-scanner prevalence prior raised agreement with report labels but lowered agreement with expert labels, which suggests the site differences in report labels are reporting habit, not disease. Subtracting each site's report-label log-odds offset instead raised expert-label AUC for all nine models checked (eight of mine and one public model), mainly for synovitis and patellofemoral osteoarthritis.",
        },
        {
          type: "equation",
          tex: "\\operatorname{logit} \\tilde{p}_{i,f} = \\operatorname{logit} p_{i,f} - b_f\\, o_{s(i),f}",
          caption: "Site correction applied at inference for finding f of study i scanned at site s(i).",
          where: [
            ["o_{s,f}", "log-odds offset of site s's report labels for finding f"],
            ["b_f", "strength, chosen on the expert labels (0.75 for synovitis, 0.5 for patellofemoral OA)"],
          ],
        },
        {
          type: "p",
          text: "On the public leaderboard the corrected submission kept the same displayed score (0.958) but moved from rank about 939 to 225 inside a large tie, so the correction transferred to unseen data. A later variant with raw key offsets reached 0.960 public (rank 136 at the time).",
        },
      ],
    },
    {
      id: "results",
      title: "Results and the public-to-private drop",
      blocks: [
        {
          type: "table",
          columns: ["Submission", "Public AUC", "Private AUC"],
          numeric: [1, 2],
          rows: [
            ["Final blend (v13: public models + mine + site correction)", "0.960", "0.943"],
            ["My models only (hedge)", "0.940 – 0.942", "0.927 – 0.929"],
          ],
          note: "Private scores are from the final leaderboard. Final rank 542 of 6,425.",
        },
        {
          type: "callout",
          tone: "negative",
          title: "What did not hold",
          text: "All report-trained models dropped 0.015 – 0.017 from public to private, against about 0.010 for the top teams, so the public leaderboard overstated the gains. Conditional, style-only correction layers did not transfer either.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: ["Built the out-of-core data pipeline", "Designed the LLM labelling and its checks", "Trained and ensembled the models", "Automated packaging and submission"],
    contributions: ["570 GB → 65 GB cache with range reads and 0 failures", "Site-bias correction validated on expert labels and on the leaderboard"],
    skills: ["PyTorch", "Medical imaging", "LLM labelling", "Data engineering", "GPU batch jobs"],
    ownership: "Solo.",
    impact: ["Rank 542 of 6,425 (top 9%)."],
  },

  implemented: ["Remote-zip range-read cache", "LLM report labelling", "ConvNeXt training and side classifier", "Site correction", "Automated Kaggle submission"],
  planned: [],
  limitations: [
    "Only 58 expert labels to check against.",
    "The best submission depends on public models; my own models alone scored lower.",
    "Larger public-to-private drop than the top teams.",
  ],
  lessons: ["Check weak labels against whatever expert labels exist before trusting them.", "A leaderboard tie can hide real progress; a large public-to-private drop can hide overfitting."],
  evidence: [{ label: "Kaggle profile", href: "https://www.kaggle.com/spicyohi13", note: "Final rank. Code and logs are not public." }],
  pipeline: [
    { title: "Locate", detail: "Read the 570 GB zip's directory once" },
    { title: "Stream", detail: "Byte-range reads per series, decoded in memory" },
    { title: "Cache", detail: "65 GB, 4,407 studies, 0 failures" },
    { title: "Label", detail: "Qwen3-32B reads 12 findings per report" },
    { title: "Check", detail: "Against 58 expert labels; site correction" },
    { title: "Train", detail: "ConvNeXt models, then a Kaggle notebook" },
  ],
  resolved: [
    {
      issue: "A 570 GB image archive, far more than the available disk.",
      resolution: "HTTP byte-range reads of the remote zip into a 65 GB cache, with no failed studies.",
    },
    {
      issue: "Only 58 of 4,407 training studies had expert labels.",
      resolution: "An open LLM read labels from the free-text radiology reports, and every label set was checked against the 58.",
    },
    {
      issue: "Different sites write reports differently, which biased the report labels.",
      resolution: "A correction for site-specific reporting habits, found by comparing with the expert labels.",
    },
  ],
  impact: [
    { area: "Radiology departments", text: "Research towards worklist triage for knee MRI. Not a clinical tool." },
    { area: "Hospitals with unlabelled archives", text: "Labels from existing reports turn years of stored scans into training data." },
    { area: "Medical AI teams", text: "Out-of-core streaming makes very large imaging datasets usable on modest hardware." },
  ],
  related: ["arc-agi-inference", "amazon-ml-entity-resolution"],
};
