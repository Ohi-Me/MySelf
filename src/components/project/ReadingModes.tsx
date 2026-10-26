"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export interface ModeDef {
  id: string;
  label: string;
  hint: string;
  toc: { id: string; title: string }[];
}

/**
 * Five ways to read one case study. The server renders every panel; this
 * component shows one at a time, keeps the choice in the URL hash so a mode
 * can be shared, and follows the reader with a table of contents.
 * Without JavaScript (see the <noscript> rule in the page) every panel shows.
 */
export function ReadingModes({ modes, children }: { modes: ModeDef[]; children: ReactNode }) {
  const [mode, setMode] = useState(modes[0].id);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const select = useCallback(
    (id: string, focus = false) => {
      setMode(id);
      history.replaceState(null, "", `#${id}`);
      if (focus) tabRefs.current[id]?.focus();
    },
    [setMode],
  );

  // Open the mode named in the hash, or the mode that contains a linked section.
  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return;
      if (modes.some((m) => m.id === h)) {
        setMode(h);
        return;
      }
      const el = document.getElementById(h);
      const panel = el?.closest<HTMLElement>("[data-mode-panel]");
      if (panel?.dataset.modePanel) {
        setMode(panel.dataset.modePanel);
        requestAnimationFrame(() => el?.scrollIntoView());
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [modes]);

  // Slide the underline to the active tab.
  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[mode];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mode]);

  // Scroll spy for the table of contents of the active mode.
  const current = modes.find((m) => m.id === mode) ?? modes[0];
  useEffect(() => {
    const els = current.toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [current]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = modes.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next >= 0) {
      e.preventDefault();
      select(modes[next].id, true);
    }
  };

  return (
    <div data-active-mode={mode}>
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-paper/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="overflow-x-auto py-2.5 [scrollbar-width:none]">
        <div ref={listRef} role="tablist" aria-label="Reading mode" className="relative inline-flex gap-0.5 rounded-full border border-line bg-pale p-1">
          {indicator && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-ink transition-[transform,width] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
            />
          )}
          {modes.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[m.id] = el;
              }}
              role="tab"
              id={`tab-${m.id}`}
              aria-selected={mode === m.id}
              aria-controls={`panel-${m.id}`}
              tabIndex={mode === m.id ? 0 : -1}
              onClick={() => select(m.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.85rem] whitespace-nowrap transition-colors duration-300 ${
                mode === m.id ? "text-paper" : "text-ink-3 hover:text-ink"
              }`}
            >
              <span aria-hidden className="font-mono text-[0.66rem] opacity-60">
                0{i + 1}
              </span>
              {m.label}
            </button>
          ))}
        </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-3" aria-live="polite">
        {current.hint}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block" aria-label="On this page">
          <div className="sticky top-36">
            <p className="eyebrow mb-3">On this page</p>
            <ul className="space-y-1.5 border-l border-line text-[0.85rem]">
              {current.toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className={`-ml-px block border-l py-0.5 pl-3 transition-colors ${
                      activeSection === t.id ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"
                    }`}
                  >
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
