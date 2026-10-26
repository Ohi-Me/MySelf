import type { ChartSpec } from "@/content/types";

/**
 * Small, dependency-free charts in HTML and CSS. Values are exact (taken from
 * the content file), marks animate in on scroll where supported, and every
 * chart also exposes its numbers as text.
 */

const pct = (v: number, [lo, hi]: [number, number]) => ((v - lo) / (hi - lo)) * 100;

function ticks([lo, hi]: [number, number], count = 5): number[] {
  const step = (hi - lo) / count;
  const nice = Math.pow(10, Math.floor(Math.log10(step)));
  const unit = [1, 2, 2.5, 5, 10].map((m) => m * nice).find((m) => m >= step) ?? step;
  const out: number[] = [];
  for (let v = Math.ceil(lo / unit) * unit; v <= hi + 1e-9; v += unit) out.push(Number(v.toFixed(6)));
  return out;
}

function Dumbbell({ chart }: { chart: Extract<ChartSpec, { type: "dumbbell" }> }) {
  const d = chart.domain;
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-ink-2">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink" />
          {chart.valueLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-ink bg-paper" />
          {chart.baselineLabel}
        </span>
        {chart.lowerIsBetter && <span className="text-ink-3">Lower is better</span>}
      </div>
      <div className="space-y-3">
        {chart.rows.map((r) => {
          const a = pct(r.value, d);
          const b = pct(r.baseline, d);
          const left = Math.min(a, b);
          const width = Math.abs(a - b);
          return (
            <div key={r.label} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-4">
              <p className="text-[0.85rem] text-ink-2">{r.label}</p>
              <div className="relative h-9">
                <div aria-hidden className="absolute inset-x-0 top-[62%] h-px bg-line" />
                {chart.reference && (
                  <div
                    aria-hidden
                    className="absolute inset-y-0 border-l border-dashed border-ink-3"
                    style={{ left: `${pct(chart.reference.at, d)}%` }}
                  />
                )}
                <div
                  aria-hidden
                  className="span absolute top-[62%] h-[2px] -translate-y-1/2 bg-ink"
                  style={{ left: `${left}%`, width: `${width}%`, transformOrigin: a < b ? "right" : "left" }}
                />
                <span
                  aria-hidden
                  className="dot absolute top-[62%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-paper"
                  style={{ left: `${b}%` }}
                />
                <span
                  aria-hidden
                  className="dot absolute top-[62%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
                  style={{ left: `${a}%` }}
                />
                <span className="absolute top-0 -translate-x-1/2 font-mono text-[0.68rem] text-ink" style={{ left: `${a}%` }}>
                  {r.value.toFixed(3)}
                </span>
                <span className="absolute top-0 -translate-x-1/2 font-mono text-[0.68rem] text-ink-3" style={{ left: `${b}%` }}>
                  {r.baseline.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid sm:grid-cols-[13rem_1fr] sm:gap-4">
        <span />
        <div className="relative h-5 border-t border-line">
          {ticks(d).map((t) => (
            <span key={t} className="absolute top-1 -translate-x-1/2 font-mono text-[0.68rem] text-ink-3" style={{ left: `${pct(t, d)}%` }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bars({ chart }: { chart: Extract<ChartSpec, { type: "bars" }> }) {
  const d = chart.domain;
  return (
    <div>
      {chart.lowerIsBetter && <p className="mb-3 text-[0.8rem] text-ink-3">Lower is better{chart.unit ? ` · ${chart.unit}` : ""}</p>}
      <div className="space-y-2.5">
        {chart.rows.map((r) => (
          <div key={r.label} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-4">
            <p className={`text-[0.85rem] ${r.emphasis ? "font-medium text-ink" : "text-ink-2"}`}>{r.label}</p>
            <div className="flex items-center gap-3">
              <div className="relative h-6 flex-1">
                <div
                  className={`bar absolute inset-y-0 left-0 rounded-[3px] ${r.emphasis ? "bg-ink" : "border border-ink-3 bg-pale-2"}`}
                  style={{ width: `${pct(r.value, d)}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right font-mono text-[0.78rem] text-ink tabular-nums">{r.display ?? r.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Chart({ chart, caption, note }: { chart: ChartSpec; caption: string; note?: string }) {
  return (
    <figure className="chart my-2" data-reveal>
      <div className="rounded-2xl border border-line p-4 sm:p-6">
        {chart.type === "dumbbell" ? <Dumbbell chart={chart} /> : <Bars chart={chart} />}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-3">
        {caption}
        {note && <span className="mt-1 block">{note}</span>}
      </figcaption>
    </figure>
  );
}
