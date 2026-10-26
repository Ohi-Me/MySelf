import type { RatingPoint } from "@/content/competitive";

/**
 * Rating history as a hairline series on a time axis. The SVG only draws;
 * the best and latest points are labelled in HTML so text never stretches,
 * and every contest is listed in a disclosure for screen readers and print.
 */
export function Sparkline({ series, label }: { series: RatingPoint[]; label: string }) {
  const t = series.map(([d]) => new Date(`${d}T00:00:00Z`).getTime());
  const r = series.map(([, v]) => v);
  const [t0, t1] = [t[0], t[t.length - 1]];
  const lo = Math.min(...r);
  const hi = Math.max(...r);
  const pad = (hi - lo) * 0.12 || 50;
  const [y0, y1] = [lo - pad, hi + pad];
  const x = (v: number) => ((v - t0) / (t1 - t0 || 1)) * 100;
  const y = (v: number) => 100 - ((v - y0) / (y1 - y0)) * 100;

  const line = series.map((_, i) => `${i ? "L" : "M"}${x(t[i]).toFixed(2)},${y(r[i]).toFixed(2)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  const bestIndex = r.indexOf(hi);
  const last = series.length - 1;
  const year = (i: number) => series[i][0].slice(0, 4);

  const marks = [
    { i: bestIndex, text: `Best ${hi}`, strong: true },
    ...(bestIndex === last ? [] : [{ i: last, text: `Now ${r[last]}`, strong: false }]),
  ];

  return (
    <figure className="chart">
      <div className="relative mt-6 h-32 sm:h-36">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="sparkline absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <line className="grid" x1="0" x2="100" y1={y(hi)} y2={y(hi)} />
          <line className="grid" x1="0" x2="100" y1={y(lo)} y2={y(lo)} />
          <path className="area" d={area} opacity="0.6" />
          <path d={line} />
        </svg>
        {marks.map((m) => (
          <span
            key={m.text}
            aria-hidden
            className="dot absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x(t[m.i])}%`, top: `${y(r[m.i])}%` }}
          >
            <span className={`block h-2.5 w-2.5 rounded-full border border-ink ${m.strong ? "bg-ink" : "bg-paper"}`} />
            <span
              className={`absolute font-mono text-[0.68rem] whitespace-nowrap ${m.strong ? "bottom-3.5 text-ink" : "top-3.5 text-ink-3"} ${
                x(t[m.i]) > 70 ? "right-0" : x(t[m.i]) < 30 ? "left-0" : "left-1/2 -translate-x-1/2"
              }`}
            >
              {m.text}
            </span>
          </span>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.68rem] text-ink-3">
        <span>{year(0)}</span>
        <span>{year(last)}</span>
      </div>
      <figcaption className="sr-only">
        {label}: {series.length} rated contests from {series[0][0]} to {series[last][0]}, lowest {lo}, best {hi}, latest {r[last]}.
      </figcaption>
      <details className="mt-3 text-[0.8rem] text-ink-3">
        <summary className="cursor-pointer select-none hover:text-ink">All {series.length} contests</summary>
        <ol className="mt-2 grid max-h-48 grid-cols-2 gap-x-6 overflow-y-auto font-mono text-[0.72rem] tabular-nums sm:grid-cols-3">
          {series.map(([d, v], i) => (
            <li key={i} className="flex justify-between border-b border-line py-1">
              <span>{d}</span>
              <span className="text-ink">{v}</span>
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
