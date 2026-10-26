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

/** A project as one row of an index: number, title and line, status and areas, and an arrow. */
export function ProjectCard({ p, index = 0 }: { p: ProjectSummary; index?: number }) {
  return (
    <Link href={`/projects/${p.slug}`} className="index-row group" data-reveal>
      <span className="font-mono text-[0.75rem] text-ink-3">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0">
        <p className="eyebrow">
          {projectKindLabel[p.kind]} · {p.period}
        </p>
        <ViewTransition name={`project-title-${p.slug}`} share="morph" default="none">
          <h3 className="display mt-2 text-[1.45rem] leading-tight text-ink sm:text-[1.7rem]">{p.title}</h3>
        </ViewTransition>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink-2">{p.tagline}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
        <ProjectStatusTag status={p.status} />
        <span className="text-[0.78rem] text-ink-3">{p.domains.slice(0, 2).join(" · ")}</span>
      </div>
      <span aria-hidden className="theme-arrow hidden lg:block">
        →
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
