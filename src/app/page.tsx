import Link from "next/link";
import type { CSSProperties } from "react";
import { EvidenceTag } from "@/components/content/Tags";
import { HeroSchematic } from "@/components/home/HeroSchematic";
import { WorkStack } from "@/components/home/WorkStack";
import { PaperRow } from "@/components/research/PaperList";
import { Container, SectionHeading } from "@/components/site/Page";
import { papers, projects } from "@/content";
import { platforms } from "@/content/competitive";
import { achievements, profile, profileLinks, researchThemes } from "@/content/site";
import { absoluteUrl, jsonLd } from "@/lib/site";

/** Hero figures: each one is stated, with its source, elsewhere on the site. */
const heroStats = [
  { value: "104,550", label: "State-days in the open RE-FUSED dataset", href: "/projects/re-fused" },
  { value: "35 / 52", label: "pre-registered checks supported, scored once", href: "/projects/re-fused" },
  { value: "#206", label: "team rank, Amazon ML Challenge 2026", href: "/projects/amazon-ml-entity-resolution" },
  { value: "542 / 6,425", label: "RSNA knee MRI on Kaggle, top 9%", href: "/projects/rsna-knee" },
  {
    value: platforms.reduce((n, p) => n + p.solved, 0).toLocaleString("en-US"),
    label: "problems solved on LeetCode, Codeforces and CodeChef",
    href: "/competitions",
  },
  { value: "4", label: "manuscripts, readable in full on this site", href: "/research" },
];

const v = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: absoluteUrl("/"),
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    description: profile.description,
    affiliation: { "@type": "CollegeOrUniversity", name: "Dr B R Ambedkar National Institute of Technology Jalandhar" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "IIIT Bhubaneswar" },
    identifier: `https://orcid.org/${profile.orcid}`,
    sameAs: profileLinks.filter((l) => l.kind === "profile").map((l) => l.href),
    knowsAbout: ["Machine learning", "Probabilistic forecasting", "Entity resolution", "LLM agents", "Power systems"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(person) }} />

      {/* Hero: the name rises out of its own baseline, the schematic draws itself */}
      <Container>
        <section className="hero-glow -mx-4 grid items-center gap-12 px-4 pt-14 pb-12 sm:-mx-6 sm:px-6 sm:pt-20 lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:pb-16">
          <div>
            <p className="eyebrow enter flex items-center gap-2" style={v(0)}>
              <span aria-hidden className="pulse-dot" />
              {profile.affiliation} · 2025 – 2027
            </p>
            <h1 className="display mt-5 text-[3.2rem] leading-[0.95] text-ink sm:text-[5.2rem]">
              <span className="mask-line">
                <span style={v(1)}>Rohit</span>
              </span>{" "}
              <span className="mask-line">
                <span style={v(2)}>
                  <em>Kumar</em>
                </span>
              </span>
            </h1>
            <p className="enter mt-7 max-w-xl text-[1.12rem] leading-relaxed text-ink-2 sm:text-[1.22rem]" style={v(3)}>
              {profile.statement}
            </p>
            <div className="enter mt-9 flex flex-wrap gap-3" style={v(4)}>
              <Link href="/research" className="btn-ink group">
                Read the research <span aria-hidden className="arrow-nudge">→</span>
              </Link>
              <Link href="/projects" className="btn-line group">
                See the projects <span aria-hidden className="arrow-nudge">→</span>
              </Link>
              <Link href="/contact" className="inline-flex items-center rounded-full px-3 py-2.5 text-[0.92rem] text-ink-2 hover:text-ink">
                Contact and CV
              </Link>
            </div>
          </div>
          <div className="enter" style={v(3)}>
            <div className="rounded-[1.75rem] border border-line bg-surface/70 p-5 shadow-[0_40px_80px_-50px_rgb(var(--shadow)/0.45)] backdrop-blur-sm sm:p-7">
              <HeroSchematic />
            </div>
          </div>
        </section>
      </Container>

      {/* Key figures as a slow ticker; the list is real, the copy only fills the loop */}
      <section aria-label="Key figures" className="ticker enter border-y border-line bg-surface" style={v(5)}>
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="ticker-list" aria-hidden={copy === 1 || undefined}>
              {heroStats.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} tabIndex={copy === 1 ? -1 : undefined} className="group flex items-baseline gap-3 px-8 py-5">
                    <span className="stat text-[1.7rem] sm:text-[2rem]">{s.value}</span>
                    <span className="max-w-[14rem] text-[0.82rem] leading-snug text-ink-3 group-hover:text-ink">{s.label}</span>
                    <span aria-hidden className="ml-6 text-ink-3">✦</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* Research themes: three large numbered rows, not boxes */}
      <Container className="py-20 sm:py-28">
        <SectionHeading
          eyebrow="What I research"
          title="Forecasts that hold up under real data, and decisions that use them"
          action={
            <Link href="/research" className="link-quiet text-sm text-ink">
              All research →
            </Link>
          }
        />
        <ol className="border-t border-ink">
          {researchThemes.map((t, i) => (
            <li key={t.href} data-reveal>
              <Link href={t.href} className="theme-row group">
                <span className="theme-num">0{i + 1}</span>
                <span className="display text-[1.45rem] leading-tight text-ink sm:text-[1.9rem]">{t.title}</span>
                <span className="text-[0.95rem] leading-relaxed text-ink-2">{t.text}</span>
                <span aria-hidden className="theme-arrow">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>

      {/* Selected projects: sheets that stack as you scroll */}
      <section className="border-y border-line bg-pale py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="What I build"
            title="Selected projects, each with the pipeline that runs it"
            action={
              <Link href="/projects" className="link-quiet text-sm text-ink">
                All {projects.length} projects →
              </Link>
            }
          />
          <WorkStack items={featured} />
        </Container>
      </section>

      {/* Record as a ledger: date, result, evidence */}
      <Container className="py-20 sm:py-28">
        <SectionHeading eyebrow="Record" title="Results, with the kind of evidence behind each" />
        <ol className="ledger">
          {achievements.slice(0, 5).map((a) => (
            <li key={a.title} className="ledger-row" data-reveal>
              <span className="font-mono text-[0.75rem] text-ink-3">{a.date}</span>
              <div>
                <p className="text-[1.05rem] font-medium text-ink">
                  {a.href ? (
                    a.href.startsWith("/") ? (
                      <Link href={a.href} className="link-quiet">
                        {a.title}
                      </Link>
                    ) : (
                      <a href={a.href} target="_blank" rel="noopener noreferrer" className="link-quiet">
                        {a.title}
                      </a>
                    )
                  ) : (
                    a.title
                  )}
                </p>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-3">{a.detail}</p>
              </div>
              <EvidenceTag kind={a.kind} />
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink px-6 py-5 text-paper" data-reveal>
          <p className="max-w-2xl text-[0.95rem] leading-relaxed">
            Also co-wrote a 36-month research proposal submitted to the Central Power Research Institute (decision pending), and co-authored two publications during the B.Tech.
          </p>
          <Link href="/experience" className="group inline-flex items-center gap-1.5 text-sm">
            Full record <span aria-hidden className="arrow-nudge">→</span>
          </Link>
        </div>
      </Container>

      <Container className="pb-12">
        <SectionHeading
          eyebrow="Outputs"
          title="Papers, manuscripts and data, readable in full"
          action={
            <Link href="/research" className="link-quiet text-sm text-ink">
              Statuses explained →
            </Link>
          }
        />
        <ul className="-mt-4 divide-y divide-line">
          {papers.slice(0, 5).map((p) => (
            <PaperRow key={p.slug} paper={p} />
          ))}
        </ul>
      </Container>
    </>
  );
}
