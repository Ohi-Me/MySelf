"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener("themechange", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("themechange", onChange);
  };
}

/** Switches between light and dark; the choice is remembered on this device only. */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme"
    >
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="transition-transform duration-500"
        style={{ transform: theme === "dark" ? "rotate(180deg)" : "none" }}
      >
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" />
      </svg>
    </button>
  );
}
