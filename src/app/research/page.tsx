import Link from "next/link";
import { Tag } from "@/components/content/Tags";
import { PaperRow } from "@/components/research/PaperList";
import { Container, PageHeader, SectionHeading } from "@/components/site/Page";
import { papers } from "@/content";
import { researchExperience, researchThemes } from "@/content/site";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Research and publications",
  description:
    "Papers, manuscripts and datasets by Rohit Kumar on forecasting, decisions under uncertainty and forecast correction for India's power system, with the exact status of each.",
  path: "/research",
});

const groups = [
  { title: "Submitted", match: ["submitted", "under-review", "accepted", "preprint"] },
  { title: "Manuscripts complete, not yet submitted", match: ["manuscript", "in-progress"] },
  { title: "Published", match: ["published", "dataset"] },
];

export default function ResearchPage() {
  return (
    <Container>
      <PageHeader
        trail={[{ label: "Research", href: "/research" }]}
        eyebrow="Research and publications"
        title="Learning and deciding with data that arrive late, noisy or shifted"
        lede="My research uses India's power system as a testbed: forecasting from data as it is actually published, turning forecasts into decisions under real settlement rules, and asking when adaptive methods are worth their variance. Every study is pre-registered and scored once. Each paper below opens in place: its pipeline, sections, the problems it resolves, where it applies and what changed in each version."
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
          <span>Status key:</span>
          <Tag label="Published" style="filled" />
          <Tag label="Submitted" style="outline" />
          <Tag label="Manuscript, not yet submitted" style="dashed" />
        </div>
      </PageHeader>

      <section aria-labelledby="themes" className="mb-24">
        <SectionHeading eyebrow="Questions" title="Three research questions" />
        <h2 id="themes" className="sr-only">
          Research themes
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {researchThemes.map((t, i) => (
            <li key={t.href}>
              <Link href={t.href} className="lift flex h-full flex-col rounded-2xl border border-line p-6" data-reveal>
                <span className="font-mono text-[0.72rem] text-ink-3">0{i + 1}</span>
                <span className="mt-4 text-[1.1rem] leading-snug font-medium text-ink">{t.title}</span>
                <span className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">{t.text}</span>
                <span className="mt-auto pt-5 text-sm text-ink">
                  Read <span aria-hidden className="arrow-nudge inline-block">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {groups.map((g) => {
        const items = papers.filter((p) => g.match.includes(p.status));
        if (!items.length) return null;
        return (
          <section key={g.title} className="mb-20">
            <SectionHeading title={g.title} />
            <ul className="-mt-4 divide-y divide-line">
              {items.map((p) => (
                <PaperRow key={p.slug} paper={p} readable />
              ))}
            </ul>
          </section>
        );
      })}

      <section className="mb-8">
        <SectionHeading title="Research experience" />
        <div className="space-y-10">
          {researchExperience.map((r) => (
            <div key={r.title} className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8" data-reveal>
              <span className="font-mono text-[0.78rem] text-ink-3">{r.period}</span>
              <div>
                <p className="text-[1.05rem] font-medium text-ink">
                  {r.href ? (
                    <Link href={r.href} className="link-quiet">
                      {r.title}
                    </Link>
                  ) : (
                    r.title
                  )}
                </p>
                <p className="mt-1 text-sm text-ink-3">{r.org}</p>
                <ul className="prose-body mt-3 list-[square] space-y-1.5 pl-5 !text-[0.98rem] marker:text-ink-3">
                  {r.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
