import Link from "next/link";
import { ViewTransition } from "react";
import type { ProjectKind, ProjectStatus } from "@/content/types";
import { ProjectStatusTag } from "@/components/content/Tags";
import { projectKindLabel } from "@/lib/site";

export interface ProjectSummary {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  kind: ProjectKind;
  status: ProjectStatus;
  period: string;
  domains: string[];
  stack: string[];
  featured: boolean;
}

export function ProjectCard({ p }: { p: ProjectSummary; index?: number }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="lift group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6"
      data-reveal
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow">
          {projectKindLabel[p.kind]} · {p.period}
        </p>
        <ProjectStatusTag status={p.status} />
      </div>
      <ViewTransition name={`project-title-${p.slug}`} share="morph" default="none">
        <h3 className="mt-5 text-[1.3rem] leading-tight font-medium tracking-tight text-ink">{p.title}</h3>
      </ViewTransition>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-2">{p.tagline}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Areas">
        {p.domains.slice(0, 3).map((d) => (
          <li key={d} className="rounded-full bg-pale px-2.5 py-1 text-[0.72rem] text-ink-2">
            {d}
          </li>
        ))}
      </ul>
      <span className="mt-auto flex items-center gap-1.5 pt-6 text-[0.85rem] text-ink">
        Read the case study <span aria-hidden className="arrow-nudge">→</span>
      </span>
    </Link>
  );
}

/** Strip a project down to what cards and the explorer need. */
export function toSummary(p: ProjectSummary): ProjectSummary {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    summary: p.summary,
    kind: p.kind,
    status: p.status,
    period: p.period,
    domains: p.domains,
    stack: p.stack,
    featured: p.featured,
  };
}
