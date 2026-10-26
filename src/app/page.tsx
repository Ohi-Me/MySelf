import Link from "next/link";
import { EvidenceTag } from "@/components/content/Tags";
import { HeroSchematic } from "@/components/home/HeroSchematic";
import { ProjectCard, toSummary } from "@/components/project/ProjectCard";
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
  {
    value: platforms.reduce((n, p) => n + p.solved, 0).toLocaleString("en-US"),
    label: "problems solved on LeetCode, Codeforces and CodeChef",
    href: "/competitions",
  },
];

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

      <Container>
        <section className="grid-paper -mx-4 grid items-center gap-12 px-4 pt-14 pb-14 sm:-mx-6 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20">
          <div>
            <p className="eyebrow enter flex items-center gap-2" style={{ ["--i" as string]: 0 }}>
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
              {profile.affiliation} · 2025 – 2027
            </p>
            <h1 className="display enter mt-5 text-[3rem] leading-[0.98] text-ink sm:text-[4.6rem]" style={{ ["--i" as string]: 1 }}>
              Rohit Kumar
            </h1>
            <p className="enter mt-6 max-w-xl text-[1.15rem] leading-relaxed text-ink-2 sm:text-[1.25rem]" style={{ ["--i" as string]: 2 }}>
              {profile.statement}
            </p>
            <div className="enter mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
              <Link href="/research" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.92rem] text-paper">
                Read the research <span aria-hidden className="arrow-nudge">→</span>
              </Link>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-[0.92rem] text-ink transition-colors hover:bg-pale"
              >
                See the projects <span aria-hidden className="arrow-nudge">→</span>
              </Link>
              <Link href="/contact" className="inline-flex items-center rounded-full px-3 py-2.5 text-[0.92rem] text-ink-2 hover:text-ink">
                Contact and CV
              </Link>
            </div>
          </div>
          <div className="enter" style={{ ["--i" as string]: 2 }}>
            <HeroSchematic />
          </div>
        </section>

        <ul className="enter mb-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:mb-24 lg:grid-cols-4" style={{ ["--i" as string]: 4 }} aria-label="Key figures">
          {heroStats.map((s) => (
            <li key={s.label} className="bg-paper">
              <Link href={s.href} className="group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-pale sm:p-6">
                <span className="stat text-[1.9rem] sm:text-[2.3rem]">{s.value}</span>
                <span className="text-[0.85rem] leading-snug text-ink-3 group-hover:text-ink-2">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <section className="border-y border-line bg-pale/60 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Record" title="Results, with the kind of evidence behind each" />
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {achievements.slice(0, 5).map((a) => (
              <li key={a.title} className="bg-paper p-5 sm:p-6" data-reveal>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.72rem] text-ink-3">{a.date}</span>
                  <EvidenceTag kind={a.kind} />
                </div>
                <p className="mt-4 font-medium text-ink">
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
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-3">{a.detail}</p>
              </li>
            ))}
            <li className="flex flex-col justify-between bg-ink p-5 text-paper sm:p-6" data-reveal>
              <p className="eyebrow !text-paper/60">Also</p>
              <p className="mt-4 text-[0.95rem] leading-relaxed">
                Co-wrote a 36-month research proposal submitted to the Central Power Research Institute (decision pending), and co-authored two publications during the B.Tech.
              </p>
              <Link href="/experience" className="group mt-5 inline-flex items-center gap-1.5 text-sm">
                Full record <span aria-hidden className="arrow-nudge">→</span>
              </Link>
            </li>
          </ul>
        </Container>
      </section>

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
        <ol className="grid gap-4 md:grid-cols-3">
          {researchThemes.map((t, i) => (
            <li key={t.href}>
              <Link href={t.href} className="lift flex h-full flex-col rounded-2xl border border-line p-6" data-reveal>
                <span className="font-mono text-[0.72rem] text-ink-3">0{i + 1}</span>
                <span className="mt-4 text-[1.1rem] leading-snug font-medium text-ink">{t.title}</span>
                <span className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">{t.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="pb-20 sm:pb-28">
        <SectionHeading
          eyebrow="What I build"
          title="Selected projects"
          action={
            <Link href="/projects" className="link-quiet text-sm text-ink">
              All {projects.length} projects →
            </Link>
          }
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.slug}>
              <ProjectCard p={toSummary(p)} />
            </li>
          ))}
        </ul>
      </Container>

      <Container className="pb-8">
        <SectionHeading
          eyebrow="Outputs"
          title="Papers, manuscripts and data"
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
