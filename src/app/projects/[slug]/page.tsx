import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Blocks, SectionView } from "@/components/content/Blocks";
import { Inline, SmartLink } from "@/components/content/Inline";
import { MetricGrid } from "@/components/content/MetricGrid";
import { EvidenceLegend, ProjectStatusTag } from "@/components/content/Tags";
import { PrevNext, RelatedWork } from "@/components/project/Related";
import { ReadingModes, type ModeDef } from "@/components/project/ReadingModes";
import { Breadcrumbs, Container } from "@/components/site/Page";
import { Pipeline } from "@/components/story/Pipeline";
import { ImpactGrid, ResolvedList } from "@/components/story/StoryPanels";
import { getProject, projects } from "@/content";
import type { Project } from "@/content/types";
import { absoluteUrl, jsonLd, pageMetadata, projectKindLabel } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/projects/${p.slug}`, type: "article", siteImage: false });
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="prose-body list-[square] space-y-1.5 pl-5 marker:text-ink-3">
      {items.map((t, i) => (
        <li key={i} className="pl-1">
          <Inline text={t} />
        </li>
      ))}
    </ul>
  );
}

function Panel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`panel-${id}`} data-mode-panel={id} role="tabpanel" aria-labelledby={`tab-${id}`} className="space-y-14">
      <h2 className="sr-only">{title}</h2>
      {children}
    </section>
  );
}

function modesFor(p: Project): ModeDef[] {
  return [
    {
      id: "overview",
      label: "30-second overview",
      hint: "The problem, the solution, my part and the outcome, with the evidence behind each number.",
      toc: [
        { id: "overview", title: "In 30 seconds" },
        ...(p.keyMetrics.length ? [{ id: "key-results", title: "Key results" }] : []),
        { id: "status", title: "What exists today" },
      ],
    },
    {
      id: "plain",
      label: "Plain English",
      hint: "The same work explained without jargon.",
      toc: [{ id: "plain", title: "In plain English" }],
    },
    {
      id: "engineering",
      label: "Engineering",
      hint: "Architecture, implementation, design decisions and how it was tested.",
      toc: p.engineering.map((s) => ({ id: s.id, title: s.title })),
    },
    {
      id: "research",
      label: "Research & evaluation",
      hint: "Questions, methods, results, failures and what the evidence supports.",
      toc: [...p.research.map((s) => ({ id: s.id, title: s.title })), { id: "lessons", title: "Limitations and lessons" }],
    },
    {
      id: "recruiter",
      label: "For recruiters",
      hint: "Responsibilities, individual contribution, skills and verified impact.",
      toc: [{ id: "recruiter", title: "Summary for recruiters" }],
    },
  ];
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const repo = p.links.find((l) => l.kind === "repo");

  const structured = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    headline: p.tagline,
    description: p.summary,
    url: absoluteUrl(`/projects/${p.slug}`),
    author: { "@type": "Person", name: "Rohit Kumar", url: absoluteUrl("/") },
    keywords: [...p.domains, ...p.stack].join(", "),
    ...(repo ? { isBasedOn: repo.href } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <noscript dangerouslySetInnerHTML={{ __html: "<style>[data-active-mode] [data-mode-panel]{display:block!important}</style>" }} />

      <Container>
        <header className="pt-10 pb-10 sm:pt-14">
          <Breadcrumbs trail={[{ label: "Projects", href: "/projects" }, { label: p.title, href: `/projects/${p.slug}` }]} />
          <div className="enter mt-8 flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 1 }}>
            <span className="eyebrow">
              {projectKindLabel[p.kind]} · {p.period}
            </span>
            <ProjectStatusTag status={p.status} />
          </div>
          <ViewTransition name={`project-title-${p.slug}`} share="morph" default="none">
            <h1
              className="enter mt-4 max-w-4xl text-[2.2rem] leading-[1.06] font-medium tracking-[-0.025em] text-ink sm:text-[3.2rem]"
              style={{ ["--i" as string]: 2 }}
            >
              {p.title}
            </h1>
          </ViewTransition>
          <p className="enter mt-5 max-w-3xl text-[1.1rem] leading-relaxed text-ink-2 sm:text-[1.2rem]" style={{ ["--i" as string]: 3 }}>
            {p.tagline}
          </p>
          <div className="enter mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm" style={{ ["--i" as string]: 4 }}>
            {p.links.map((l) => (
              <SmartLink
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink px-3.5 py-1.5 text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {l.label}
                <span aria-hidden>↗</span>
              </SmartLink>
            ))}
            <span className="text-ink-3">{p.statusNote}</span>
          </div>
          <dl className="enter mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-[8rem_1fr]" style={{ ["--i" as string]: 5 }}>
            <dt className="eyebrow pt-0.5">Role</dt>
            <dd className="text-ink-2">{p.role}</dd>
            <dt className="eyebrow pt-0.5">Built with</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full border border-line px-2.5 py-0.5 text-[0.78rem] text-ink-2">
                    {s}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        </header>

        <section id="pipeline" className="mb-16 scroll-mt-28" aria-labelledby="pipeline-title">
          <h2 id="pipeline-title" className="mb-5 text-2xl font-medium tracking-tight text-ink">
            How it works
          </h2>
          <Pipeline stages={p.pipeline} caption="Each stage lights up in order as the work moves through it. Hover to pause." />
        </section>

        <ReadingModes modes={modesFor(p)}>
          <Panel id="overview" title="30-second overview">
            <section id="overview" className="scroll-mt-36">
              <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {(
                  [
                    ["Problem", p.overview.problem],
                    ["Solution", p.overview.solution],
                    ["My contribution", p.overview.contribution],
                    ["Outcome", p.overview.outcome],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="bg-paper p-5 sm:p-6" data-reveal>
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-2 text-[1rem] leading-relaxed text-ink-2">
                      <Inline text={v} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            {p.keyMetrics.length > 0 && (
              <section id="key-results" className="scroll-mt-36">
                <h3 className="mb-5 text-xl font-medium tracking-tight text-ink">Key results</h3>
                <MetricGrid items={p.keyMetrics} />
                <EvidenceLegend kinds={p.keyMetrics.map((m) => m.kind)} />
              </section>
            )}
            <section id="status" className="scroll-mt-36">
              <h3 className="mb-5 text-xl font-medium tracking-tight text-ink">What exists today</h3>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-3">Implemented</p>
                  <List items={p.implemented} />
                </div>
                <div>
                  <p className="eyebrow mb-3">Planned, not built</p>
                  {p.planned.length ? <List items={p.planned} /> : <p className="prose-body text-ink-3">Nothing further is planned.</p>}
                </div>
              </div>
            </section>
          </Panel>

          <Panel id="plain" title="In plain English">
            <section id="plain" className="max-w-3xl scroll-mt-36">
              <Blocks blocks={p.plain} />
            </section>
          </Panel>

          <Panel id="engineering" title="Engineering deep dive">
            {p.engineering.map((s) => (
              <SectionView key={s.id} section={s} />
            ))}
          </Panel>

          <Panel id="research" title="Research and evaluation">
            {p.research.map((s) => (
              <SectionView key={s.id} section={s} />
            ))}
            <section id="lessons" className="scroll-mt-36">
              <h2 className="mb-5 text-2xl font-medium tracking-tight text-ink">Limitations and lessons</h2>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-3">Limitations</p>
                  <List items={p.limitations} />
                </div>
                <div>
                  <p className="eyebrow mb-3">Lessons</p>
                  <List items={p.lessons} />
                </div>
              </div>
            </section>
          </Panel>

          <Panel id="recruiter" title="Summary for recruiters">
            <section id="recruiter" className="scroll-mt-36 space-y-8">
              <div className="rounded-2xl bg-ink p-6 text-paper sm:p-8">
                <p className="eyebrow !text-paper/60">Ownership</p>
                <p className="mt-2 text-[1.15rem] leading-relaxed">{p.recruiter.ownership}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-3">Responsibilities</p>
                  <List items={p.recruiter.responsibilities} />
                </div>
                <div>
                  <p className="eyebrow mb-3">Individual contributions</p>
                  <List items={p.recruiter.contributions} />
                </div>
                <div>
                  <p className="eyebrow mb-3">Verified impact</p>
                  <List items={p.recruiter.impact} />
                </div>
                <div>
                  <p className="eyebrow mb-3">Skills shown</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {p.recruiter.skills.map((s) => (
                      <li key={s} className="rounded-full border border-ink px-2.5 py-1 text-[0.8rem] text-ink">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </Panel>
        </ReadingModes>

        <section id="resolved" className="mt-24 scroll-mt-28">
          <h2 className="mb-2 text-2xl font-medium tracking-tight text-ink">Problems resolved</h2>
          <p className="mb-6 text-[0.95rem] text-ink-3">What got in the way, and what was done about it.</p>
          <ResolvedList items={p.resolved} />
        </section>

        <section id="impact" className="mt-20 scroll-mt-28">
          <h2 className="mb-2 text-2xl font-medium tracking-tight text-ink">Where it applies</h2>
          <p className="mb-6 text-[0.95rem] text-ink-3">People, industries and operators the work could help in practice.</p>
          <ImpactGrid items={p.impact} />
        </section>

        <section id="evidence" className="mt-20 scroll-mt-28">
          <h2 className="mb-6 text-2xl font-medium tracking-tight text-ink">Evidence and sources</h2>
          <ul className="divide-y divide-line rounded-2xl border border-line">
            {p.evidence.map((e, i) => (
              <li key={i} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="w-56 shrink-0 font-medium text-ink">{e.href ? <SmartLink href={e.href}>{e.label}</SmartLink> : e.label}</span>
                <span className="text-sm text-ink-3">{e.note}</span>
              </li>
            ))}
          </ul>
        </section>

        {p.related.length > 0 && (
          <section id="related" className="mt-20 scroll-mt-28">
            <h2 className="mb-6 text-2xl font-medium tracking-tight text-ink">Related work</h2>
            <RelatedWork slugs={p.related} />
          </section>
        )}

        <div className="mt-20">
          <PrevNext base="/projects" prev={prev && { slug: prev.slug, title: prev.title }} next={next && { slug: next.slug, title: next.title }} />
        </div>
      </Container>
    </article>
  );
}
