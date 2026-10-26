import type { CSSProperties } from "react";
import type { PipelineStage } from "@/content/types";

/**
 * Animated pipeline. A token travels the rail and each stage lights up as it
 * is reached; the timing comes from --n (stage count) and --i (stage index)
 * in globals.css. Hovering pauses it. The stages are an ordered list, so the
 * content is complete with motion off or before any CSS loads.
 */
export function Pipeline({ stages, caption, label = "Pipeline" }: { stages: PipelineStage[]; caption?: string; label?: string }) {
  return (
    <figure className="pipeline" style={{ "--n": stages.length } as CSSProperties} data-reveal>
      <div className="rounded-2xl border border-line bg-pale p-4 sm:p-6">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <p className="eyebrow">{label}</p>
          <p className="font-mono text-[0.68rem] tracking-wide text-ink-3 uppercase">{stages.length} stages</p>
        </div>
        <div className="pipeline-track">
          <span className="pipeline-rail" aria-hidden>
            <span className="pipeline-fill" />
            <span className="pipeline-token" />
          </span>
          <ol className="pipeline-stages">
            {stages.map((s, i) => (
              <li key={s.title} className="pipeline-stage" style={{ "--i": i } as CSSProperties}>
                <span className="pipeline-dot" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pipeline-card">
                  <p className="text-[0.92rem] leading-snug font-medium text-ink">{s.title}</p>
                  <p className="mt-1 text-[0.8rem] leading-snug text-ink-3">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-sm leading-relaxed text-ink-3">{caption}</figcaption>}
    </figure>
  );
}
