import Link from "next/link";
import type { ReactNode } from "react";
import { absoluteUrl, jsonLd } from "@/lib/site";

export interface Crumb {
  label: string;
  href: string;
}

/** Breadcrumb trail with BreadcrumbList structured data. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...trail];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="enter" style={{ ["--i" as string]: 0 }}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.72rem] tracking-wide text-ink-3 uppercase">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-ink-2">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="link-quiet hover:text-ink">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
    </nav>
  );
}

/** Standard page header: optional breadcrumbs, eyebrow, title and lede. */
export function PageHeader({
  trail,
  eyebrow,
  title,
  lede,
  children,
}: {
  trail?: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="grid-paper -mx-4 px-4 pt-10 pb-12 sm:-mx-6 sm:px-6 sm:pt-14 sm:pb-16">
      {trail && <Breadcrumbs trail={trail} />}
      {eyebrow && (
        <p className="eyebrow enter mt-8" style={{ ["--i" as string]: 1 }}>
          {eyebrow}
        </p>
      )}
      <h1 className="display enter mt-3 max-w-4xl text-[2.4rem] leading-[1.06] text-ink sm:text-[3.5rem]" style={{ ["--i" as string]: 2 }}>
        {title}
      </h1>
      {lede && (
        <div className="enter mt-5 max-w-2xl text-[1.08rem] leading-relaxed text-ink-2 sm:text-[1.15rem]" style={{ ["--i" as string]: 3 }}>
          {lede}
        </div>
      )}
      {children && (
        <div className="enter mt-7" style={{ ["--i" as string]: 4 }}>
          {children}
        </div>
      )}
    </header>
  );
}

/** Section heading used on index pages. */
export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4" data-reveal>
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="display text-[1.65rem] leading-tight text-ink sm:text-[2rem]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
