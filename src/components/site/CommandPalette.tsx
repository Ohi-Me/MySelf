"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/search";

/** Rank items: every query word must match; titles weigh most. */
function rank(items: SearchItem[], query: string): SearchItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return items.filter((i) => i.type !== "Skill").slice(0, 12);
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of items) {
    const title = item.title.toLowerCase();
    const summary = item.summary.toLowerCase();
    const keys = item.keywords.toLowerCase();
    let score = 0;
    let all = true;
    for (const w of words) {
      const s = (title.includes(w) ? 4 : 0) + (keys.includes(w) ? 2 : 0) + (summary.includes(w) ? 1 : 0);
      if (!s) {
        all = false;
        break;
      }
      score += s + (title.startsWith(w) ? 2 : 0);
    }
    if (all) scored.push({ item, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.item).slice(0, 20);
}

export function CommandPalette({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => rank(items, query), [items, query]);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setQuery("");
    setActive(0);
    d.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      const typing = t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        open();
      }
    };
    const onOpen = () => open();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, [open]);

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    close();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      className="palette mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] max-w-none rounded-2xl border border-line-strong bg-paper p-0 text-ink shadow-[0_24px_80px_-20px_rgb(18_18_16/0.35)] backdrop:bg-[#121210]/45 backdrop:backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-ink-3">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search projects, papers, technologies…"
          className="h-14 w-full bg-transparent text-[0.98rem] outline-none placeholder:text-ink-3 focus-visible:outline-none"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `palette-${active}` : undefined}
          aria-autocomplete="list"
        />
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[0.68rem] text-ink-3 sm:block">Esc</kbd>
      </div>
      <ul id="palette-results" role="listbox" aria-label="Results" className="max-h-[55vh] overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-ink-3">No matches. Try a technology, such as “XGBoost” or “MCP”.</li>
        )}
        {results.map((item, i) => (
          <li
            key={item.href}
            id={`palette-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setActive(i)}
            onClick={() => go(item)}
            className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 ${i === active ? "bg-pale-2" : ""}`}
          >
            <span className="mt-0.5 w-16 shrink-0 font-mono text-[0.65rem] tracking-wide text-ink-3 uppercase">{item.type}</span>
            <span className="min-w-0">
              <span className="block truncate text-[0.92rem] text-ink">{item.title}</span>
              <span className="block truncate text-[0.8rem] text-ink-3">{item.summary}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex gap-4 border-t border-line px-4 py-2 font-mono text-[0.65rem] text-ink-3">
        <span>↑↓ move</span>
        <span>↵ open</span>
        <span>/ or Ctrl K anywhere</span>
      </div>
    </dialog>
  );
}

/** Button that opens the palette; the palette itself lives once in the layout. */
export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-[0.82rem] text-ink-3 transition-colors hover:border-ink hover:text-ink"
      aria-label="Search the site (Ctrl K)"
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 16 16">
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="hidden lg:inline">Search</span>
      <kbd className="hidden font-mono text-[0.65rem] lg:inline">Ctrl K</kbd>
    </button>
  );
}
