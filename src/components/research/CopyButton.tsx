"use client";

import { useState } from "react";

/** Copies text to the clipboard and confirms in place. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      setDone(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] text-ink-3 transition-colors hover:border-ink hover:text-ink"
      aria-live="polite"
    >
      {done ? "Copied" : label}
    </button>
  );
}
