import Link from "next/link";
import { Container } from "@/components/site/Page";
import { projects } from "@/content";

export default function NotFound() {
  return (
    <Container>
      <section className="py-24 sm:py-32">
        <p className="eyebrow enter">Error 404</p>
        <h1 className="enter mt-4 max-w-2xl text-[2.4rem] leading-tight font-medium tracking-tight text-ink sm:text-[3.2rem]" style={{ ["--i" as string]: 1 }}>
          This page is not here.
        </h1>
        <p className="enter mt-5 max-w-xl text-[1.1rem] leading-relaxed text-ink-2" style={{ ["--i" as string]: 2 }}>
          The link may be old or mistyped. Search with <kbd className="rounded border border-line px-1.5 font-mono text-[0.85rem]">/</kbd>, or start from one of these.
        </p>
        <ul className="enter mt-10 grid max-w-3xl gap-2 sm:grid-cols-2" style={{ ["--i" as string]: 3 }}>
          {[
            { href: "/", label: "Home" },
            { href: "/research", label: "Research and publications" },
            { href: "/projects", label: "All projects" },
            { href: "/contact", label: "Contact and CV" },
            ...projects.filter((p) => p.featured).slice(0, 2).map((p) => ({ href: `/projects/${p.slug}`, label: p.title })),
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="lift group flex items-center justify-between rounded-xl border border-line px-4 py-3 text-ink">
                {l.label} <span aria-hidden className="arrow-nudge text-ink-3">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
