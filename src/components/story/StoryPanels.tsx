import { Inline } from "@/components/content/Inline";
import type { ImpactArea, ResolvedIssue } from "@/content/types";

/** Each problem the work ran into, paired with how it was resolved. */
export function ResolvedList({ items }: { items: ResolvedIssue[] }) {
  return (
    <ol className="space-y-3">
      {items.map((r, i) => (
        <li key={i} className="grid overflow-hidden rounded-xl border border-line md:grid-cols-2" data-reveal>
          <div className="border-b border-dashed border-line-strong bg-pale px-5 py-4 md:border-r md:border-b-0">
            <p className="eyebrow">
              <span className="mr-2 text-ink">{String(i + 1).padStart(2, "0")}</span>Issue
            </p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">
              <Inline text={r.issue} />
            </p>
          </div>
          <div className="bg-surface px-5 py-4">
            <p className="eyebrow">
              <span aria-hidden className="mr-2 text-ink">
                ✓
              </span>
              Resolved
            </p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">
              <Inline text={r.resolution} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Where the work could matter: industries, operators and people. */
export function ImpactGrid({ items }: { items: ImpactArea[] }) {
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((a) => (
          <li key={a.area} className="lift flex flex-col rounded-xl border border-line bg-surface p-5" data-reveal>
            <span aria-hidden className="mb-3 block h-1 w-8 rounded-full bg-cream-4" />
            <p className="font-medium text-ink">{a.area}</p>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-2">
              <Inline text={a.text} />
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.8rem] text-ink-3">Possible uses of the work. Nothing here is a deployment unless the text says so.</p>
    </div>
  );
}
