import type { Paper } from "../types";

/** Published outputs: two co-authored papers and the dataset release. */

export const renewableOptimization: Paper = {
  slug: "renewable-energy-optimization",
  title: "Renewable energy optimization for sustainable power generation",
  shortTitle: "Renewable energy optimization",
  status: "published",
  statusNote: "Published in IJ-ICT, Vol. 15, No. 1, March 2026, pp. 365–373. Open access.",
  venue: "International Journal of Informatics and Communication Technology (IJ-ICT)",
  year: "2026",
  sortDate: "2026-03",
  authors: [
    { name: "Debani Prasad Mishra" },
    { name: "Sarita Samal" },
    { name: "Rohit Kumar", me: true },
    { name: "Arun Kumar Sahoo" },
    { name: "Surender Reddy Salkuti" },
  ],
  authorship: "Third of five authors",
  contribution: ["Wrote the analysis code: capacity utilisation, weather–energy correlation and the machine-learning forecasts (credited for software in the paper's CRediT statement)."],
  links: [
    { label: "Article (IJ-ICT)", href: "https://ijict.iaescore.com/index.php/IJICT/article/view/21289", kind: "paper" },
    { label: "DOI", href: "https://doi.org/10.11591/ijict.v15i1.pp365-373", kind: "paper" },
  ],
  doi: "10.11591/ijict.v15i1.pp365-373",
  plain:
    "A data-driven look at how well India's solar and wind capacity is used. The study compares the two sources with the capacity utilisation factor and efficiency, checks how output relates to weather, and tries machine-learning forecasts. In the data studied, wind used its capacity better than solar.",
  keyMetrics: [],
  sections: [
    {
      id: "summary",
      title: "Summary",
      blocks: [
        {
          type: "p",
          text: "The paper evaluates solar and wind generation in India using historical weather and generation data, with the capacity utilisation factor (CUF) and efficiency as the main measures, a weather–energy correlation analysis, machine-learning forecasting, and a comparison of the two sources, including all-India renewable generation (excluding large hydro) for June 2023 and a year-over-year comparison.",
        },
        {
          type: "equation",
          tex: "\\mathrm{CUF} = \\frac{E_{\\text{actual}}}{P_{\\text{installed}} \\times T}",
          caption: "Capacity utilisation factor: energy actually generated over the energy the installed capacity could produce in the period T.",
        },
        {
          type: "callout",
          tone: "note",
          text: "Numbers from the paper's tables are not repeated here; this page describes the study and my part in it.",
        },
      ],
    },
  ],
  bibtex: `@article{mishra2026renewable,
  author  = {Mishra, Debani Prasad and Samal, Sarita and Kumar, Rohit and Sahoo, Arun Kumar and Salkuti, Surender Reddy},
  title   = {Renewable energy optimization for sustainable power generation},
  journal = {International Journal of Informatics and Communication Technology (IJ-ICT)},
  volume  = {15},
  number  = {1},
  pages   = {365--373},
  year    = {2026},
  doi     = {10.11591/ijict.v15i1.pp365-373}
}`,
  related: ["re-fused", "arc-fault-detection"],
  topics: ["Renewable energy", "Data analysis", "Forecasting"],
};

export const arcFault: Paper = {
  slug: "arc-fault-detection",
  title: "Arc Fault Detection for Improved Electrical Safety with ADC and Relay",
  shortTitle: "Arc fault detection with ADC and relay",
  status: "published",
  statusNote: "Published at the IEEE International Conference on Advances in Power, Signal, and Information Technology (APSIT), 2023.",
  venue: "IEEE APSIT 2023",
  year: "2023",
  sortDate: "2023-05",
  authors: [
    { name: "Debani Prasad Mishra" },
    { name: "Rohit Kumar", me: true },
    { name: "Arun Kumar Sahoo" },
    { name: "Tanmoy Parida" },
  ],
  authorship: "Second of four authors",
  contribution: ["Wrote the C++ detection code on a Raspberry Pi: sampling over SPI, threshold logic and relay control."],
  links: [{ label: "IEEE Xplore", href: "https://ieeexplore.ieee.org/document/10201793", kind: "paper" }],
  plain:
    "An arc fault is an unintended electrical discharge that can start a fire. This work builds a small real-time detector: it measures voltage and current, looks for the signatures of an arc, and switches the power off through a relay.",
  keyMetrics: [],
  sections: [
    {
      id: "system",
      title: "The detector",
      blocks: [
        {
          type: "steps",
          items: [
            { title: "Sample", text: "Voltage and current read by an analog-to-digital converter over SPI on a Raspberry Pi." },
            { title: "Detect", text: "C++ code computes RMS and peak values and the phase gap, and compares them with limits, with hysteresis so the relay does not chatter." },
            { title: "Act", text: "A relay driven through GPIO (WiringPi) disconnects the supply when a fault is detected." },
          ],
        },
        {
          type: "equation",
          tex: "V_{\\mathrm{rms}} = \\sqrt{\\frac{1}{N}\\sum_{n=1}^{N} v[n]^2}",
          caption: "RMS over a window of N samples, one of the quantities compared with limits.",
        },
      ],
    },
  ],
  bibtex: `@inproceedings{mishra2023arc,
  author    = {Mishra, Debani Prasad and Kumar, Rohit and Sahoo, Arun Kumar and Parida, Tanmoy},
  title     = {Arc Fault Detection for Improved Electrical Safety with ADC and Relay},
  booktitle = {IEEE International Conference on Advances in Power, Signal, and Information Technology (APSIT)},
  year      = {2023},
  url       = {https://ieeexplore.ieee.org/document/10201793}
}`,
  related: ["renewable-energy-optimization"],
  topics: ["Embedded systems", "Electrical safety", "C++"],
};

export const refusedDataset: Paper = {
  slug: "re-fused-dataset",
  title:
    "RE-FUSED: State-day panel of India's power system from official data, with forecasting, forecast correction and scheduling code, results and logs",
  shortTitle: "RE-FUSED dataset",
  status: "dataset",
  statusNote: "Published on Zenodo, version 1.0.0 (October 2026). A version 1.1 with the additional-analysis scripts is prepared.",
  venue: "Zenodo",
  year: "2026",
  sortDate: "2026-10",
  authors: [{ name: "Rohit Kumar", me: true, affiliation: "Centre for AI, NIT Jalandhar" }],
  authorship: "Sole creator",
  contribution: ["Built and documented the panel, the code and the frozen results."],
  links: [
    { label: "Zenodo record (v1.0.0)", href: "https://doi.org/10.5281/zenodo.23301898", kind: "dataset" },
    { label: "All versions", href: "https://doi.org/10.5281/zenodo.23301897", kind: "dataset" },
    { label: "GitHub", href: "https://github.com/Ohi-Me/RE-FUSED", kind: "repo" },
  ],
  doi: "10.5281/zenodo.23301898",
  plain:
    "The open data and code behind RE-FUSED: a daily table of India's power system for 34 State control areas from April 2018 to August 2026, built only from official reports, with the code and the frozen results of the studies that use it.",
  keyMetrics: [],
  sections: [
    {
      id: "contents",
      title: "Contents and licence",
      blocks: [
        {
          type: "kv",
          items: [
            ["Panel", "104,550 State-days × 107 columns, 34 control areas"],
            ["Also", "All-India 15-minute and hourly series, hourly market prices"],
            ["Code", "Acquisition, build, forecasting, correction and scheduling"],
            ["Results", "Frozen confirmatory results and run logs"],
            ["Licence", "CC BY 4.0 (data and documentation), MIT (code)"],
          ],
        },
      ],
    },
  ],
  bibtex: `@dataset{kumar2026refused,
  author    = {Kumar, Rohit},
  title     = {RE-FUSED: State-day panel of India's power system from official data, with forecasting, forecast correction and scheduling code, results and logs},
  year      = {2026},
  publisher = {Zenodo},
  version   = {1.0.0},
  doi       = {10.5281/zenodo.23301898}
}`,
  related: ["india-state-day-panel", "re-fused"],
  topics: ["Open data", "Power systems"],
};
