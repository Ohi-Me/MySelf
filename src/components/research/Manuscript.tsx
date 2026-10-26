import { Blocks } from "@/components/content/Blocks";
import { Inline, SmartLink } from "@/components/content/Inline";
import { Pipeline } from "@/components/story/Pipeline";
import { ImpactGrid, ResolvedList } from "@/components/story/StoryPanels";
import type { Paper, Revision } from "@/content/types";
import { paperStatusLabel } from "@/lib/site";
import { ManuscriptFrame } from "./ManuscriptFrame";

/** The ids a sheet uses, in reading order, for the page's table of contents. */
export function manuscriptToc(p: Paper, prefix = "") {
  return [
    { id: `${prefix}abstract`, title: p.abstract ? "Abstract" : "Summary" },
    { id: `${prefix}pipeline`, title: "Pipeline" },
    ...p.sections.map((s, i) => ({ id: `${prefix}${s.id}`, title: `${i + 1}. ${s.title}` })),
    { id: `${prefix}resolved`, title: `${p.sections.length + 1}. Problems resolved` },
    { id: `${prefix}impact`, title: `${p.sections.length + 2}. Where it applies` },
    { id: `${prefix}updates`, title: "What we updated" },
  ];
}

function frameNote(p: Paper): string {
  if (p.status === "published") return "Reader edition of a published paper. The version of record, with its full text and tables, is linked at the end.";
  if (p.status === "dataset") return "Reader edition of a dataset release. The data, code and documentation are linked at the end.";
  return `Reader edition, built from the ${p.abstract ? "submitted abstract" : "public results"} and the public repository. ${p.disclosure ?? ""}`.trim();
}

function SheetHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="manuscript-h scroll-mt-36">
      {children}
    </h3>
  );
}

/** Version history: what changed in the manuscript, newest first. */
export function RevisionTimeline({ revisions }: { revisions: Revision[] }) {
  return (
    <ol className="relative space-y-7 border-l border-line-strong pl-6">
      {revisions.map((r, i) => (
        <li key={r.version + r.date} className="relative" data-reveal>
          <span
            aria-hidden
            className={`absolute top-1.5 -left-[1.86rem] h-3 w-3 rounded-full border border-ink ${i === 0 ? "bg-ink" : "bg-surface"}`}
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="rounded-full border border-ink px-2.5 py-0.5 font-mono text-[0.68rem] tracking-wide text-ink uppercase">{r.version}</span>
            <span className="font-mono text-[0.74rem] text-ink-3">{r.date}</span>
          </div>
          <p className="mt-2 text-[0.98rem] leading-relaxed font-medium text-ink">
            <Inline text={r.summary} />
          </p>
          <ul className="mt-2 list-[square] space-y-1.5 pl-5 text-[0.92rem] leading-relaxed text-ink-2 marker:text-ink-3">
            {r.changes.map((c) => (
              <li key={c}>
                <Inline text={c} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/**
 * A paper laid out as a manuscript you read on the page: title block,
 * abstract, the pipeline as Figure 1, numbered sections, the problems it
 * resolves, where it applies and its version history. `prefix` keeps ids
 * unique when several sheets share one page.
 */
export function ManuscriptSheet({ paper: p, prefix = "" }: { paper: Paper; prefix?: string }) {
  const n = p.sections.length;
  const primary = p.links.find((l) => l.kind === "paper") ?? p.links.find((l) => l.kind === "dataset") ?? p.links[0];
  return (
    <ManuscriptFrame label={`${paperStatusLabel[p.status]} · ${p.venue}`} note={frameNote(p)}>
      <div className="manuscript-sheet">
        <header className="border-b border-line pb-8 text-center">
          <p className="eyebrow">
            {p.venue} · {p.year}
          </p>
          <p className="manuscript-title">{p.title}</p>
          <p className="mt-4 text-[0.95rem] text-ink-2">
            {p.authors.map((a, i) => (
              <span key={a.name}>
                {i > 0 && ", "}
                {a.me ? <strong className="font-medium text-ink">{a.name}</strong> : a.name}
              </span>
            ))}
          </p>
          {p.authors.some((a) => a.affiliation) && (
            <p className="mt-1 text-[0.82rem] text-ink-3 italic">{[...new Set(p.authors.map((a) => a.affiliation).filter(Boolean))].join(" · ")}</p>
          )}
        </header>

        <section className="manuscript-abstract" aria-labelledby={`${prefix}abstract`}>
          <SheetHeading id={`${prefix}abstract`}>{p.abstract ? "Abstract" : "Summary"}</SheetHeading>
          <p className="prose-body">{p.abstract ?? p.plain}</p>
          <p className="mt-4 text-[0.82rem] text-ink-3">
            <span className="font-medium text-ink-2">Keywords:</span> {p.topics.join(" · ")}
          </p>
        </section>

        <section aria-labelledby={`${prefix}pipeline`}>
          <SheetHeading id={`${prefix}pipeline`}>Pipeline</SheetHeading>
          <Pipeline stages={p.pipeline} label="Figure 1 · Pipeline" caption="Figure 1. The study from input to result. Each stage lights up in order; hover to pause." />
        </section>

        {p.sections.map((s, i) => (
          <section key={s.id} aria-labelledby={`${prefix}${s.id}`}>
            <SheetHeading id={`${prefix}${s.id}`}>
              <span className="manuscript-num">{i + 1}.</span> {s.title}
            </SheetHeading>
            <Blocks blocks={s.blocks} />
          </section>
        ))}

        <section aria-labelledby={`${prefix}resolved`}>
          <SheetHeading id={`${prefix}resolved`}>
            <span className="manuscript-num">{n + 1}.</span> Problems resolved
          </SheetHeading>
          <ResolvedList items={p.resolved} />
        </section>

        <section aria-labelledby={`${prefix}impact`}>
          <SheetHeading id={`${prefix}impact`}>
            <span className="manuscript-num">{n + 2}.</span> Where it applies
          </SheetHeading>
          <ImpactGrid items={p.impact} />
        </section>

        <section aria-labelledby={`${prefix}updates`} className="rounded-2xl border border-line bg-pale p-5 sm:p-7">
          <SheetHeading id={`${prefix}updates`}>What we updated</SheetHeading>
          <p className="mb-6 text-[0.9rem] leading-relaxed text-ink-3">How this manuscript changed, newest first, from the dated records in the project repository.</p>
          <RevisionTimeline revisions={p.revisions} />
        </section>

        {primary && (
          <footer className="border-t border-line pt-6 text-center text-sm text-ink-3">
            {p.status === "published" ? "Full text: " : "Source: "}
            <SmartLink href={primary.href} className="link text-ink">
              {primary.label}
            </SmartLink>
          </footer>
        )}
      </div>
    </ManuscriptFrame>
  );
}
