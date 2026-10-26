import type { CSSProperties } from "react";

const d = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;

/**
 * A schematic, not data: a series observed up to the last published day, the
 * days not yet published, a forecast with its interval, and the quantile at
 * which a schedule is set. Solid strokes draw in once on load; dashed marks
 * fade in so their dash pattern is kept.
 */
export function HeroSchematic() {
  return (
    <figure className="schematic relative">
      <svg viewBox="0 0 560 330" className="h-auto w-full text-ink" aria-hidden="true" focusable="false">
        <line x1="16" y1="290" x2="548" y2="290" stroke="var(--line-strong)" strokeWidth="1" />
        {[70, 130, 190, 250].map((y) => (
          <line key={y} x1="16" y1={y} x2="548" y2={y} stroke="var(--line)" strokeWidth="1" />
        ))}

        {/* interval of the forecast */}
        <path className="node" style={d(4)} d="M372 176 C 420 150, 470 120, 548 96 L 548 262 C 470 236, 420 214, 372 196 Z" fill="var(--pale-2)" />

        {/* observed series up to the last published day */}
        <path
          className="draw"
          style={d(0)}
          pathLength={1}
          d="M16 214 C 40 196, 58 230, 82 206 S 120 170, 146 192 S 188 224, 212 186 S 252 150, 276 178 S 300 196, 312 184"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* days that happened but are not yet published */}
        <path
          className="node"
          style={d(1)}
          d="M312 184 C 330 172, 350 192, 372 186"
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="2"
          strokeDasharray="2 5"
          strokeLinecap="round"
        />

        {/* forecast issue time */}
        <line className="node" style={d(2)} x1="372" y1="40" x2="372" y2="290" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" />

        {/* forecast median */}
        <path className="node" style={d(3)} d="M372 186 C 420 182, 470 178, 548 176" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 5" />

        {/* the schedule: one tuned quantile */}
        <line className="draw" style={d(5)} pathLength={1} x1="452" y1="146" x2="548" y2="146" stroke="currentColor" strokeWidth="2.5" />
        <circle className="node" style={d(6)} cx="452" cy="146" r="4.5" fill="currentColor" />

        <g className="node" style={d(6)} fill="var(--ink-3)" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="0.6">
          <text x="18" y="312">OBSERVED, AS PUBLISHED</text>
          <text x="306" y="312">LAG</text>
          <text x="380" y="34">ISSUE TIME</text>
          <text x="466" y="136">SCHEDULE q*</text>
          <text x="484" y="282">INTERVAL</text>
        </g>
      </svg>
      <figcaption className="mt-2 font-mono text-[0.68rem] tracking-wide text-ink-3 uppercase">
        Schematic · forecast from data as published, then decide at one tuned quantile
      </figcaption>
    </figure>
  );
}
