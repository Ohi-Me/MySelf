"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchButton } from "./CommandPalette";
import { NAV } from "./nav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  // The menu is open for the route it was opened on, so navigating closes it.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean | ((o: boolean) => boolean)) =>
    setOpenedAt((typeof next === "function" ? next(open) : next) ? pathname : null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedAt(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-transparent bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="Rohit Kumar, home">
          <span className="text-[0.98rem] font-semibold tracking-tight text-ink">Rohit Kumar</span>
          <span className="hidden font-mono text-[0.68rem] tracking-wide text-ink-3 uppercase sm:inline">ML research · engineering</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-[0.88rem] transition-colors ${
                    isActive(item.href) ? "text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-300 ${
                      isActive(item.href) ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16">
              <path
                d={open ? "M3 3l10 10M13 3L3 13" : "M2 5h12M2 11h12"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        className={`overflow-hidden border-t border-line bg-paper transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
        }`}
        hidden={!open}
      >
        <ul className="px-4 py-3">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-center justify-between border-b border-line py-3 text-[1rem] last:border-0 ${
                  isActive(item.href) ? "text-ink" : "text-ink-2"
                }`}
              >
                {item.label}
                <span aria-hidden className="font-mono text-ink-3">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
