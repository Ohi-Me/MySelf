import type { Project } from "../types";

export const arcInference: Project = {
  slug: "arc-agi-inference",
  title: "Faster LLM decoding under a compute budget",
  tagline: "ARC Prize 2026 (ARC-AGI-2) on Kaggle: making a test-time-training solver decode more within a fixed GPU budget, then serving a 27B model.",
  summary:
    "On a credited public baseline, batched search decoding and answer-only scoring cut time per task by 19% and decoding by about 26%, and a memory cap made it fit a 24 GB GPU. Later work serves a 27B FP8 model with vLLM on shared and partitioned GPUs.",
  kind: "competition",
  status: "ongoing",
  statusNote: "Competition running until 2 November 2026. No public code. Best public leaderboard score so far 29.44.",
  period: "Oct 2026 – present",
  sortDate: "2026-10",
  featured: false,
  domains: ["LLM inference", "GPU memory", "Test-time training", "Reasoning benchmarks"],
  stack: ["PyTorch", "Qwen3 (4B and 27B FP8)", "LoRA test-time training", "vLLM", "Tensor parallelism (4 × L4)", "PBS GPU jobs"],
  role: "Solo. Built on the public NVARC 2025 notebook (Qwen3-4B with per-task LoRA and batched depth-first search), which is credited.",
  links: [],

  overview: {
    problem:
      "Each ARC task must be solved within a hard Kaggle time budget on 4 × L4 GPUs. Timing the baseline's stages showed decoding and re-scoring took about 75% of the time, and an ablation showed every additional batch of decoded views improved accuracy, so the solver was compute-bound.",
    solution:
      "Let same-length views share one depth-first-search batch (search decoding is memory-bandwidth bound, so 8 rows cost about the same per step as 4), compute the output layer only at answer positions, and cap batch tokens so peak memory fits a 24 GB GPU; then add an adaptive per-task budget under a simulated deadline.",
    contribution: "Rebuilt the baseline on the cluster, wrote the speed options, the deadline replay and the A/B harness, and later the 27B serving setup.",
    outcome:
      "Mean time per task 274 → 222 s (−19%), decoding about −26%, peak memory 23.2 → 19.2 GB after the cap. Best public leaderboard 29.44 so far; the competition is still running.",
  },

  keyMetrics: [
    {
      value: "274 → 222 s",
      label: "mean time per task (−19%)",
      measures: "Wall-clock solve time per task, including training, decoding and re-scoring.",
      method: "Same 40 held-out development tasks, one worker, no deadline; baseline vs batched decoding with answer-only scoring.",
      source: "Internal dev40 runs on a cluster GPU partition.",
      kind: "measured",
      conclusion: "Accuracy without a deadline was similar (9.17 vs 8.67 of 40 solved); the value of the speed-up is that more decoding fits inside Kaggle's time budget.",
    },
    {
      value: "23.2 → 19.2 GB",
      label: "peak inference memory after a batch-token cap",
      measures: "Peak GPU memory during inference.",
      method: "Batched decoding first peaked at 23.2 GB, more than a 24 GB L4 can give a process; capping batch tokens at 32,000 brought it to 19.2 GB on a 4 × L4 check.",
      source: "Kaggle check run on 4 × L4.",
      kind: "measured",
    },
    {
      value: "29.44",
      label: "best public leaderboard score so far",
      measures: "Organisers' score on the public half of the hidden tasks.",
      method: "Kaggle notebook v4 with the speed options and adaptive budget.",
      source: "ARC Prize 2026 public leaderboard.",
      kind: "leaderboard",
      conclusion: "The underlying model was trained by the baseline's authors on data that includes the evaluation puzzles, so offline scores are optimistic and are used only to compare settings.",
    },
  ],

  plain: [
    {
      type: "p",
      text: "ARC puzzles ask a model to infer a rule from a few examples. The solver used here tries many candidate answers and keeps the best, and it has a strict time limit. More attempts give better answers, so the question was how to make each attempt cheaper.",
    },
    {
      type: "p",
      text: "Grouping similar attempts so the GPU processes them together, and skipping work whose result is thrown away, made each task about a fifth faster. A cap on how much is processed at once kept it within the memory of the smaller GPUs used for the competition.",
    },
  ],

  engineering: [
    {
      id: "diagnosis",
      title: "Finding the bottleneck",
      blocks: [
        { type: "diagram", id: "arc-inference", caption: "Per-task stages and where the time went on the baseline (mean 274 s per task)." },
        {
          type: "list",
          items: [
            "Stage timing on 40 development tasks: mean 274 s per task (median 225, max 738), of which training was 69 s, so decoding and re-scoring were about 75%.",
            "View ablation: decoding batches A, AB, ABC, ABCD gave 6.17, 6.67, 7.67 and 8.67 of 40 solved. Every batch added accuracy, so faster decoding buys accuracy.",
            "Deadline replay with a Kaggle-like 2.61 h budget: 36 of 40 tasks finished; time costs about 2.5 points.",
          ],
        },
      ],
    },
    {
      id: "changes",
      title: "What changed",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Batched search decoding", text: "Same-length views share one depth-first-search batch of 8 rows; the search is weight-bandwidth bound, so 8 rows cost about the same per step as 4." },
            { title: "Answer-only scoring", text: "Compute the output layer only at answer positions and score 8 views in one pass; copy only the grid-token log-probabilities back to the CPU." },
            { title: "Memory cap", text: "Batched decoding peaked at 23.2 GB, too much for an L4; a 32,000-token batch cap and two scoring passes of four brought the peak to 19.2 GB." },
            { title: "Adaptive budget", text: "A per-task decoding budget under a simulated 2.61 h clock reached 10.17 of 40 (25.4%) where the baseline cut at the same clock reached 19.2%." },
          ],
        },
      ],
    },
    {
      id: "serving",
      title: "Serving a 27B model on partitioned GPUs",
      blocks: [
        {
          type: "list",
          items: [
            "Qwen3.8-27B in FP8 served with vLLM: 382 tokens/s with 16 sequences on one partition of an H100 in a smoke test.",
            "vLLM's NVML check failed on partitioned (MIG) GPUs addressed by UUID; a small patch mapped the non-integer device id to index 0 so the check passes.",
            "A FlashInfer sampler kernel failed to JIT-compile because of a mismatch between nvcc and the toolkit headers; the sampler's top-k was switched to a plain PyTorch implementation.",
            "On Kaggle the model runs with tensor parallelism over 4 × L4.",
          ],
        },
        {
          type: "callout",
          tone: "note",
          text: "No custom CUDA kernels were written and no kernel-level profiler was used; the timing above is stage timing.",
        },
      ],
    },
  ],

  research: [
    {
      id: "ab",
      title: "Controlled comparisons",
      blocks: [
        {
          type: "p",
          text: "Every change was compared on the same held-out development tasks. The latest A/B on 120 tasks at 100k tokens per task: a solver that keeps going until two verified programs agree reached 30.0% against 25.1% for the previous version (verified-right 33 of 40 against 27 of 39).",
        },
        {
          type: "callout",
          tone: "caution",
          title: "Read the offline numbers with care",
          text: "The public baseline model was trained on synthetic data built from both training and evaluation puzzles, so offline scores on evaluation tasks are optimistic. They are used to compare decoding and selection settings, not to judge a model.",
        },
      ],
    },
  ],

  recruiter: {
    responsibilities: ["Stage timing and ablation to find the bottleneck", "Decoding speed and memory changes", "vLLM serving on partitioned GPUs", "A/B harness on held-out tasks"],
    contributions: ["−19% time per task, decoding about −26%", "Fit on a 24 GB GPU (peak 19.2 GB)"],
    skills: ["LLM inference", "GPU memory budgeting", "vLLM", "Experiment design"],
    ownership: "Solo, on a credited public baseline.",
    impact: ["Best public leaderboard 29.44 so far (competition ongoing)."],
  },

  implemented: ["Batched decoding, answer-only scoring, memory cap, adaptive budget", "vLLM serving of a 27B FP8 model", "A/B and deadline-replay harness"],
  planned: ["Final submissions before 2 November 2026"],
  limitations: ["No public code.", "Offline evaluation is optimistic for the baseline model.", "Competition result not final."],
  lessons: ["Measure where the time goes before optimising.", "On a fixed budget, speed is accuracy."],
  evidence: [{ label: "Private run logs", note: "Code and logs are not public; numbers are from the project's progress log." }],
  pipeline: [
    { title: "Task", detail: "One ARC puzzle under a hard time budget" },
    { title: "Adapt", detail: "Per-task LoRA, about 69 s" },
    { title: "Batch", detail: "Same-length views share one search batch" },
    { title: "Trim", detail: "Output layer only at answer positions" },
    { title: "Cap", detail: "Batch tokens capped to fit a 24 GB GPU" },
    { title: "Budget", detail: "Adaptive per-task budget under a deadline" },
  ],
  resolved: [
    {
      issue: "Decoding and re-scoring took about 75% of the time, and more decoding meant more accuracy.",
      resolution: "Shared search batches and answer-only output layers: decoding about −26%, mean time per task 274 → 222 s.",
    },
    {
      issue: "Peak memory near the limit of a 24 GB GPU.",
      resolution: "A cap on batch tokens: peak memory 23.2 → 19.2 GB.",
    },
    {
      issue: "A fixed per-task budget wastes time on easy tasks and runs out on hard ones.",
      resolution: "An adaptive budget, tested by replaying a simulated deadline before use.",
    },
  ],
  impact: [
    { area: "LLM serving", text: "Less GPU time per answer for search-style decoding, which lowers serving cost." },
    { area: "Fixed-budget compute", text: "On a fixed budget, speed becomes accuracy: the same hardware can try more candidates." },
    { area: "Smaller GPUs", text: "Memory caps let larger batches run on 24 GB cards instead of data-centre GPUs." },
  ],
  related: ["rsna-knee", "amazon-ml-entity-resolution"],
};
