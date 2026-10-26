"use client";

import { useState, type ReactNode } from "react";

const sizes = [
  { id: "s", label: "Smaller text" },
  { id: "m", label: "Default text" },
  { id: "l", label: "Larger text" },
] as const;

type Size = (typeof sizes)[number]["id"];

/**
 * Reading frame around a manuscript sheet: a sticky toolbar with text size
 * controls and a progress line driven by a CSS view timeline (globals.css).
 * The sheet itself is server-rendered and readable without JavaScript.
 */
export function ManuscriptFrame({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  const [size, setSize] = useState<Size>("m");
  return (
    <div className="manuscript" data-size={size}>
      <div className="manuscript-bar">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-ink" />
          <p className="eyebrow truncate !text-ink-2">{label}</p>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Text size">
          {sizes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSize(s.id)}
              aria-pressed={size === s.id}
              aria-label={s.label}
              className="grid h-7 w-7 place-items-center rounded-full border border-transparent font-display text-ink-2 transition-colors hover:border-line-strong aria-pressed:border-ink aria-pressed:text-ink"
              style={{ fontSize: `${0.74 + i * 0.14}rem` }}
            >
              A
            </button>
          ))}
        </div>
        <span className="manuscript-progress" aria-hidden />
      </div>
      {note && <p className="border-x border-line bg-pale px-5 py-3 text-[0.84rem] leading-relaxed text-ink-2 sm:px-10">{note}</p>}
      {children}
    </div>
  );
}
