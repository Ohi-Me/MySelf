"use client";

import { useMemo, useState } from "react";
import type { ProjectKind, ProjectStatus } from "@/content/types";
import { projectKindLabel, projectStatusLabel } from "@/lib/site";
import { ProjectCard, type ProjectSummary } from "./ProjectCard";

type Filter<T> = T | "all";

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[0.8rem] transition-colors ${
        pressed ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/** Searchable, filterable project list. Server-rendered with every card visible. */
export function ProjectExplorer({ items }: { items: ProjectSummary[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Filter<ProjectKind>>("all");
  const [status, setStatus] = useState<Filter<ProjectStatus>>("all");
  const [domain, setDomain] = useState<Filter<string>>("all");

  const kinds = useMemo(() => Array.from(new Set(items.map((i) => i.kind))), [items]);
  const statuses = useMemo(() => Array.from(new Set(items.map((i) => i.status))), [items]);
  const domains = useMemo(() => {
    const count = new Map<string, number>();
    items.forEach((i) => i.domains.forEach((d) => count.set(d, (count.get(d) ?? 0) + 1)));
    return Array.from(count.entries())
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([d]) => d);
  }, [items]);

  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((i) => {
      if (kind !== "all" && i.kind !== kind) return false;
      if (status !== "all" && i.status !== status) return false;
      if (domain !== "all" && !i.domains.includes(domain)) return false;
      if (!words.length) return true;
      const hay = [i.title, i.tagline, i.summary, ...i.stack, ...i.domains].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [items, query, kind, status, domain]);

  const reset = () => {
    setQuery("");
    setKind("all");
    setStatus("all");
    setDomain("all");
  };

  return (
    <div>
      <div className="space-y-4 rounded-2xl border border-line p-4 sm:p-5">
        <label className="flex items-center gap-3 rounded-xl border border-line px-3.5 focus-within:border-ink">
          <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" className="shrink-0 text-ink-3">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or technology, e.g. XGBoost, LangGraph, OpenCV"
            className="h-11 w-full bg-transparent text-[0.95rem] outline-none placeholder:text-ink-3"
          />
        </label>
        <div className="grid gap-3 text-sm sm:grid-cols-[6rem_1fr] sm:items-start">
          <span className="eyebrow pt-2">Type</span>
          <div className="flex flex-wrap gap-1.5">
            <Chip pressed={kind === "all"} onClick={() => setKind("all")}>All</Chip>
            {kinds.map((k) => (
              <Chip key={k} pressed={kind === k} onClick={() => setKind(k)}>
                {projectKindLabel[k]}
              </Chip>
            ))}
          </div>
          <span className="eyebrow pt-2">Status</span>
          <div className="flex flex-wrap gap-1.5">
            <Chip pressed={status === "all"} onClick={() => setStatus("all")}>All</Chip>
            {statuses.map((s) => (
              <Chip key={s} pressed={status === s} onClick={() => setStatus(s)}>
                {projectStatusLabel[s]}
              </Chip>
            ))}
          </div>
          <span className="eyebrow pt-2">Area</span>
          <div className="flex flex-wrap gap-1.5">
            <Chip pressed={domain === "all"} onClick={() => setDomain("all")}>All</Chip>
            {domains.map((d) => (
              <Chip key={d} pressed={domain === d} onClick={() => setDomain(d)}>
                {d}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 mb-4 text-sm text-ink-3" aria-live="polite">
        {shown.length === items.length ? `${items.length} projects` : `${shown.length} of ${items.length} projects`}
        {shown.length !== items.length && (
          <button type="button" onClick={reset} className="link-quiet ml-3 text-ink">
            Clear filters
          </button>
        )}
      </p>

      <h2 className="sr-only">Project list</h2>
      {shown.length ? (
        <ul className="border-t border-ink">
          {shown.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard p={p} index={i} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center text-ink-3">
          Nothing matches those filters.{" "}
          <button type="button" onClick={reset} className="link text-ink">
            Clear them
          </button>
        </p>
      )}
    </div>
  );
}
