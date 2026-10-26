import type { Metric } from "@/content/types";
import { Inline, SmartLink } from "./Inline";
import { EvidenceTag } from "./Tags";

/**
 * Headline numbers. Each card carries its evidence kind up front, and a
 * native disclosure explains what the number measures, how it was computed,
 * where it came from and what it does not show.
 */
export function MetricGrid({ items }: { items: Metric[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      {items.map((m, i) => (
        <div
          key={i}
          className={`flex flex-col bg-paper p-5 sm:p-6 ${i === items.length - 1 && items.length % 2 === 1 ? "sm:col-span-2" : ""}`}
          data-reveal
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-[1.65rem] leading-none tracking-tight text-ink tabular-nums sm:text-[1.9rem]">{m.value}</p>
            <EvidenceTag kind={m.kind} />
          </div>
          <p className="mt-3 text-[0.95rem] leading-snug text-ink-2">{m.label}</p>
          <details className="group mt-4 border-t border-line pt-3 text-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-ink-3 select-none hover:text-ink [&::-webkit-details-marker]:hidden">
              <span aria-hidden className="inline-block transition-transform duration-300 group-open:rotate-45">+</span>
              How this was measured
            </summary>
            <dl className="mt-3 space-y-2.5 leading-relaxed text-ink-2">
              <div>
                <dt className="eyebrow">Measures</dt>
                <dd><Inline text={m.measures} /></dd>
              </div>
              <div>
                <dt className="eyebrow">Method</dt>
                <dd><Inline text={m.method} /></dd>
              </div>
              <div>
                <dt className="eyebrow">Source</dt>
                <dd><Inline text={m.source} /></dd>
              </div>
              {m.conclusion && (
                <div>
                  <dt className="eyebrow">What it shows</dt>
                  <dd><Inline text={m.conclusion} /></dd>
                </div>
              )}
              {m.sourceUrl && (
                <div>
                  <SmartLink href={m.sourceUrl}>Open the source file</SmartLink>
                </div>
              )}
            </dl>
          </details>
        </div>
      ))}
    </div>
  );
}
