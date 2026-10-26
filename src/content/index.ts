/**
 * Content registry. To add a project or paper: write its file, import it here,
 * and add it to the array. `validateContent` runs when this module loads, so
 * `next build` fails on a broken reference instead of shipping it.
 */
import type { Block, Paper, Project, Section } from "./types";
import { refused } from "./projects/re-fused";
import { amazonMl } from "./projects/amazon-ml";
import { orbit } from "./projects/orbit";
import { feelfit } from "./projects/feelfit";
import { caringu } from "./projects/caringu";
import { datasentry } from "./projects/datasentry";
import { rsnaKnee } from "./projects/rsna-knee";
import { arcInference } from "./projects/arc-agi-inference";
import { assessiq } from "./projects/assessiq";
import { legallens } from "./projects/legallens";
import { adaptiveRiskAversion } from "./papers/adaptive-risk-aversion";
import { adaptiveCorrection, publicationDelay, stateDayPanel } from "./papers/manuscripts";
import { arcFault, refusedDataset, renewableOptimization } from "./papers/published";

/** Display order on /projects (curated, strongest evidence first). */
export const projects: Project[] = [
  refused,
  amazonMl,
  orbit,
  feelfit,
  caringu,
  datasentry,
  rsnaKnee,
  arcInference,
  assessiq,
  legallens,
];

/** Display order on /research: submitted, then manuscripts, then published. */
export const papers: Paper[] = [
  adaptiveRiskAversion,
  publicationDelay,
  stateDayPanel,
  adaptiveCorrection,
  refusedDataset,
  renewableOptimization,
  arcFault,
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPaper(slug: string): Paper | undefined {
  return papers.find((p) => p.slug === slug);
}

/** Resolve a related slug to a title and route, whichever collection it is in. */
export function resolveRef(slug: string): { title: string; href: string; type: "project" | "paper"; summary: string } | undefined {
  const project = getProject(slug);
  if (project) return { title: project.title, href: `/projects/${slug}`, type: "project", summary: project.summary };
  const paper = getPaper(slug);
  if (paper) return { title: paper.shortTitle, href: `/research/${slug}`, type: "paper", summary: paper.plain };
  return undefined;
}

/** Fixed section ids used by the project page template. */
export const PROJECT_FIXED_IDS = [
  "overview",
  "plain",
  "engineering",
  "research",
  "recruiter",
  "key-results",
  "status",
  "lessons",
  "evidence",
  "related",
];

/* ------------------------------------------------------------------ */
/* Validation                                                           */
/* ------------------------------------------------------------------ */

/** Claims the master fact list forbids anywhere on the site. */
const FORBIDDEN: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b34 states\b/i, reason: "The panel covers 28 States and 6 Union Territories, not 34 States." },
  { pattern: /research assistant,? cpri/i, reason: "There is no CPRI appointment." },
  { pattern: /\bpatent\b/i, reason: "No patent exists." },
  { pattern: /(?<!\bno\s)\bmedal\b/i, reason: "No Kaggle medal is shown on the profile." },
  { pattern: /\bsanctioned\b|\bfunded project\b/i, reason: "The CPRI proposal is submitted, not funded." },
];

function blockText(block: Block): string[] {
  switch (block.type) {
    case "p":
    case "h3":
      return [block.text];
    case "list":
      return block.items;
    case "table":
      return [block.caption ?? "", block.note ?? "", ...block.columns, ...block.rows.flat()];
    case "equation":
      return [block.caption ?? "", ...(block.where ?? []).map((w) => w[1])];
    case "code":
      return [block.caption ?? ""];
    case "metrics":
      return block.items.flatMap((m) => [m.value, m.label, m.measures, m.method, m.source, m.conclusion ?? ""]);
    case "callout":
      return [block.title ?? "", block.text];
    case "diagram":
      return [block.caption];
    case "chart":
      return [block.caption, block.note ?? ""];
    case "steps":
      return block.items.flatMap((i) => [i.title, i.text]);
    case "kv":
      return block.items.flat();
  }
}

function sectionText(sections: Section[]): string[] {
  return sections.flatMap((s) => [s.title, ...s.blocks.flatMap(blockText)]);
}

export function validateContent(): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const item of [...projects, ...papers]) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug)) errors.push(`${item.slug}: slug must be kebab-case`);
    if (slugs.has(item.slug)) errors.push(`${item.slug}: duplicate slug`);
    slugs.add(item.slug);
  }

  const checkLinks = (owner: string, links: { href: string }[]) => {
    for (const l of links) if (!/^https:\/\//.test(l.href)) errors.push(`${owner}: link is not https: ${l.href}`);
  };

  const checkSections = (owner: string, sections: Section[], reserved: string[]) => {
    const ids = new Set(reserved);
    for (const s of sections) {
      if (ids.has(s.id)) errors.push(`${owner}: duplicate section id "${s.id}"`);
      ids.add(s.id);
    }
  };

  const checkText = (owner: string, texts: string[]) => {
    for (const t of texts) {
      for (const f of FORBIDDEN) if (f.pattern.test(t)) errors.push(`${owner}: forbidden claim (${f.reason}) in "${t.slice(0, 80)}"`);
    }
  };

  for (const p of projects) {
    for (const r of p.related) if (!slugs.has(r)) errors.push(`${p.slug}: related slug "${r}" does not exist`);
    checkLinks(p.slug, p.links);
    checkSections(p.slug, [...p.engineering, ...p.research], PROJECT_FIXED_IDS);
    for (const m of p.keyMetrics) if (!m.measures || !m.method || !m.source) errors.push(`${p.slug}: metric "${m.label}" lacks provenance`);
    checkText(p.slug, [
      p.title,
      p.tagline,
      p.summary,
      p.statusNote,
      ...Object.values(p.overview),
      ...p.plain.flatMap(blockText),
      ...sectionText(p.engineering),
      ...sectionText(p.research),
      ...p.limitations,
      ...p.lessons,
    ]);
  }

  for (const p of papers) {
    for (const r of p.related) if (!slugs.has(r)) errors.push(`${p.slug}: related slug "${r}" does not exist`);
    checkLinks(p.slug, p.links);
    checkSections(p.slug, p.sections, ["abstract", "plain", "authors", "status", "citation", "related"]);
    if (!p.authors.some((a) => a.me)) errors.push(`${p.slug}: no author marked as me`);
    if (p.status === "published" && !p.links.length) errors.push(`${p.slug}: published item without a link`);
    if (p.status !== "published" && p.status !== "dataset" && p.doi) errors.push(`${p.slug}: DOI on an unpublished item`);
    if (!p.abstract && !p.disclosure && p.status !== "published" && p.status !== "dataset")
      errors.push(`${p.slug}: unpublished item needs an abstract or a disclosure note`);
    checkText(p.slug, [p.title, p.statusNote, p.plain, p.abstract ?? "", ...sectionText(p.sections)]);
  }

  return errors;
}

const problems = validateContent();
if (problems.length) {
  throw new Error(`Content validation failed:\n- ${problems.join("\n- ")}`);
}
