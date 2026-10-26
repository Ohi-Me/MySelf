import Link from "next/link";
import { profile, profileLinks } from "@/content/site";
import { NAV } from "./nav";

export function Footer() {
  return (
    <footer className="site-footer mt-28 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-semibold tracking-tight text-ink">{profile.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-3">{profile.affiliation}. Every number on this site names its source; corrections are welcome.</p>
          <a href={`mailto:${profile.email}`} className="link-quiet mt-4 inline-block text-sm text-ink">
            {profile.email}
          </a>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-3">Site</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-quiet text-ink-2 hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {profileLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink-2 hover:text-ink">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-10 text-[0.78rem] text-ink-3 sm:flex-row sm:justify-between sm:px-6">
        <p>© {profile.name}. Content checked against source files on 26 October 2026.</p>
        <a href="#top" className="link-quiet hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
