import Link from "next/link";
import type { CSSProperties } from "react";
import { ProjectStatusTag } from "@/components/content/Tags";
import type { Project } from "@/content/types";
import { projectKindLabel } from "@/lib/site";

/**
 * Featured work as a stack of sheets: each panel sticks a little lower than
 * the one before, so scrolling lays them on top of each other like papers on
 * a desk. Each sheet carries the first stages of its pipeline, which light up
 * in turn. Without sticky support the panels simply follow one another.
 */
export function WorkStack({ items }: { items: Project[] }) {
  return (
    <ol className="stack">
      {items.map((p, i) => (
        <li key={p.slug} className="stack-item" style={{ "--k": i } as CSSProperties}>
          <Link href={`/projects/${p.slug}`} className="stack-panel group">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[0.72rem] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className="eyebrow">
                    {projectKindLabel[p.kind]} · {p.period}
                  </span>
                  <ProjectStatusTag status={p.status} />
                </div>
                <h3 className="display mt-5 text-[1.9rem] leading-[1.08] text-ink sm:text-[2.5rem]">{p.title}</h3>
                <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-2">{p.tagline}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.85rem] text-paper">
                  Open the case study <span aria-hidden className="arrow-nudge">→</span>
                </span>
                <span className="text-[0.82rem] text-ink-3">{p.domains.slice(0, 3).join(" · ")}</span>
              </div>
            </div>
            <ol className="mini-pipe" aria-label="Pipeline" style={{ "--n": Math.min(p.pipeline.length, 5) } as CSSProperties}>
              {p.pipeline.slice(0, 5).map((s, j) => (
                <li key={s.title} className="mini-stage" style={{ "--i": j } as CSSProperties}>
                  <span className="mini-dot" aria-hidden />
                  <span className="text-[0.9rem] font-medium text-ink">{s.title}</span>
                  <span className="text-[0.78rem] leading-snug text-ink-3">{s.detail}</span>
                </li>
              ))}
            </ol>
          </Link>
        </li>
      ))}
    </ol>
  );
}
