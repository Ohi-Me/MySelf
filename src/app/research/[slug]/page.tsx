import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionView } from "@/components/content/Blocks";
import { Inline, SmartLink } from "@/components/content/Inline";
import { MetricGrid } from "@/components/content/MetricGrid";
import { EvidenceLegend, PaperStatusTag } from "@/components/content/Tags";
import { PrevNext, RelatedWork } from "@/components/project/Related";
import { CopyButton } from "@/components/research/CopyButton";
import { AuthorLine } from "@/components/research/PaperList";
import { Breadcrumbs, Container } from "@/components/site/Page";
import { getPaper, papers } from "@/content";
import { absoluteUrl, jsonLd, pageMetadata, paperStatusLabel } from "@/lib/site";

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPaper(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.shortTitle,
    description: `${paperStatusLabel[p.status]} · ${p.venue}. ${p.plain}`.slice(0, 300),
    path: `/research/${p.slug}`,
    type: "article",
    siteImage: false,
  });
}

export default async function PaperPage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const p = getPaper(slug);
  if (!p) notFound();

  const index = papers.findIndex((x) => x.slug === p.slug);
  const prev = papers[index - 1];
  const next = papers[index + 1];

  const toc = [
    { id: "summary", title: p.abstract ? "Abstract" : "Summary" },
    ...(p.keyMetrics.length ? [{ id: "key-results", title: "Key results" }] : []),
    ...p.sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "authors", title: "Authors and contribution" },
    ...(p.bibtex ? [{ id: "citation", title: "Citation" }] : []),
  ];

  const structured = {
    "@context": "https://schema.org",
    "@type": p.status === "dataset" ? "Dataset" : "ScholarlyArticle",
    name: p.title,
    headline: p.title.slice(0, 110),
    description: p.plain,
    url: absoluteUrl(`/research/${p.slug}`),
    author: p.authors.map((a) => ({ "@type": "Person", name: a.name })),
    creativeWorkStatus: paperStatusLabel[p.status],
    ...(p.doi ? { identifier: `https://doi.org/${p.doi}`, sameAs: `https://doi.org/${p.doi}` } : {}),
    ...(p.status === "published" || p.status === "dataset" ? { datePublished: p.year, publisher: p.venue } : {}),
    keywords: p.topics.join(", "),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <Container>
        <header className="max-w-4xl pt-10 pb-12 sm:pt-14">
          <Breadcrumbs trail={[{ label: "Research", href: "/research" }, { label: p.shortTitle, href: `/research/${p.slug}` }]} />
          <div className="enter mt-8 flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 1 }}>
            <span className="eyebrow">
              {p.venue} · {p.year}
            </span>
            <PaperStatusTag status={p.status} />
          </div>
          <h1 className="enter mt-4 text-[1.9rem] leading-[1.12] font-medium tracking-[-0.02em] text-ink sm:text-[2.6rem]" style={{ ["--i" as string]: 2 }}>
            {p.title}
          </h1>
          <p className="enter mt-5 text-[1.02rem] text-ink-2" style={{ ["--i" as string]: 3 }}>
            <AuthorLine paper={p} />
          </p>
          <p className="enter mt-2 text-sm text-ink-3" style={{ ["--i" as string]: 3 }}>
            {p.authorship}. {p.statusNote}
          </p>
          {p.links.length > 0 && (
            <div className="enter mt-6 flex flex-wrap gap-3 text-sm" style={{ ["--i" as string]: 4 }}>
              {p.links.map((l) => (
                <SmartLink
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink px-3.5 py-1.5 text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  {l.label} <span aria-hidden>↗</span>
                </SmartLink>
              ))}
            </div>
          )}
        </header>

        <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:block" aria-label="On this page">
            <div className="sticky top-24">
              <p className="eyebrow mb-3">On this page</p>
              <ul className="space-y-1.5 border-l border-line text-[0.85rem]">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 text-ink-3 transition-colors hover:border-ink hover:text-ink">
                      {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 max-w-3xl space-y-14">
            <section id="summary" className="scroll-mt-28 space-y-6">
              {p.abstract ? (
                <div>
                  <h2 className="mb-4 text-2xl font-medium tracking-tight text-ink">Abstract</h2>
                  <p className="prose-body">{p.abstract}</p>
                </div>
              ) : null}
              <div className="rounded-2xl border border-line bg-pale p-5 sm:p-6" data-reveal>
                <p className="eyebrow">In plain English</p>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-2">{p.plain}</p>
              </div>
              {p.disclosure && (
                <p className="rounded-xl border border-dashed border-ink-3 px-5 py-4 text-sm leading-relaxed text-ink-2">
                  <span className="eyebrow mb-1 block">What is shown here</span>
                  {p.disclosure}
                </p>
              )}
            </section>

            {p.keyMetrics.length > 0 && (
              <section id="key-results" className="scroll-mt-28">
                <h2 className="mb-5 text-2xl font-medium tracking-tight text-ink">Key results</h2>
                <MetricGrid items={p.keyMetrics} />
                <EvidenceLegend kinds={p.keyMetrics.map((m) => m.kind)} />
              </section>
            )}

            {p.sections.map((s) => (
              <SectionView key={s.id} section={s} />
            ))}

            <section id="authors" className="scroll-mt-28">
              <h2 className="mb-5 text-2xl font-medium tracking-tight text-ink">Authors and contribution</h2>
              <ol className="mb-5 space-y-1 text-[0.98rem] text-ink-2">
                {p.authors.map((a, i) => (
                  <li key={a.name}>
                    <span className="mr-2 font-mono text-[0.75rem] text-ink-3">{i + 1}.</span>
                    {a.me ? <strong className="font-medium text-ink">{a.name}</strong> : a.name}
                    {a.affiliation && <span className="text-ink-3"> · {a.affiliation}</span>}
                  </li>
                ))}
              </ol>
              <p className="eyebrow mb-2">My contribution</p>
              <ul className="prose-body list-[square] space-y-1.5 pl-5 marker:text-ink-3">
                {p.contribution.map((c) => (
                  <li key={c}>
                    <Inline text={c} />
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-3">
                Status: <span className="text-ink-2">{p.statusNote}</span>
              </p>
            </section>

            {p.bibtex && (
              <section id="citation" className="scroll-mt-28">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-medium tracking-tight text-ink">Citation</h2>
                  <CopyButton text={p.bibtex} label="Copy BibTeX" />
                </div>
                <pre className="overflow-x-auto rounded-xl border border-line bg-pale p-4 font-mono text-[0.78rem] leading-relaxed text-ink" tabIndex={0}>
                  <code>{p.bibtex}</code>
                </pre>
              </section>
            )}

            {p.related.length > 0 && (
              <section id="related" className="scroll-mt-28">
                <h2 className="mb-5 text-2xl font-medium tracking-tight text-ink">Related work</h2>
                <RelatedWork slugs={p.related} />
              </section>
            )}

            <PrevNext
              base="/research"
              prev={prev && { slug: prev.slug, title: prev.shortTitle }}
              next={next && { slug: next.slug, title: next.shortTitle }}
            />
          </div>
        </div>
      </Container>
    </article>
  );
}
