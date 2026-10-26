import type { Block, Section } from "@/content/types";
import { Chart } from "@/components/charts/Chart";
import { Diagram } from "@/components/diagrams/Diagram";
import { Inline, SmartLink } from "./Inline";
import { MetricGrid } from "./MetricGrid";
import { TeX } from "./TeX";

const calloutTitle: Record<string, string> = {
  note: "Note",
  caution: "Caution",
  negative: "Negative result",
  result: "Result",
};

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="prose-body">
          <Inline text={block.text} />
        </p>
      );

    case "h3":
      return <h3 className="pt-2 text-lg font-medium tracking-tight text-ink">{block.text}</h3>;

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`prose-body space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-[square]"} marker:text-ink-3`}>
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <Inline text={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case "table":
      return (
        <figure className="my-1" data-reveal>
          {block.caption && <figcaption className="mb-3 text-sm font-medium text-ink">{block.caption}</figcaption>}
          <div className="overflow-x-auto rounded-xl border border-line" tabIndex={0} role="region" aria-label={block.caption ?? "Table"}>
            <table className="w-full min-w-[32rem] border-collapse text-left text-[0.88rem]">
              <thead>
                <tr className="border-b border-line bg-pale">
                  {block.columns.map((c, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-4 py-2.5 font-mono text-[0.7rem] font-normal tracking-wide text-ink-3 uppercase ${block.numeric?.includes(i) ? "text-right" : ""}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-line last:border-0">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`px-4 py-2.5 align-top leading-snug ${c === 0 ? "text-ink" : "text-ink-2"} ${block.numeric?.includes(c) ? "text-right font-mono tabular-nums" : ""}`}
                      >
                        <Inline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-3"><Inline text={block.note} /></p>}
        </figure>
      );

    case "equation":
      return (
        <figure className="rounded-xl border border-line px-4 py-4 sm:px-6" data-reveal>
          <TeX tex={block.tex} display />
          {block.caption && <figcaption className="mt-2 text-sm leading-relaxed text-ink-3"><Inline text={block.caption} /></figcaption>}
          {block.where && (
            <dl className="mt-3 grid gap-x-4 gap-y-1.5 border-t border-line pt-3 text-sm sm:grid-cols-[auto_1fr]">
              {block.where.map(([sym, meaning], i) => (
                <div key={i} className="contents">
                  <dt className="text-ink"><TeX tex={sym} /></dt>
                  <dd className="text-ink-2">{meaning}</dd>
                </div>
              ))}
            </dl>
          )}
        </figure>
      );

    case "code":
      return (
        <figure data-reveal>
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="flex items-center justify-between border-b border-line bg-pale px-4 py-2">
              <span className="font-mono text-[0.7rem] tracking-wide text-ink-3 uppercase">{block.lang}</span>
              {block.source && (
                <SmartLink href={block.source} className="link-quiet font-mono text-[0.7rem] text-ink-3 hover:text-ink">
                  source
                </SmartLink>
              )}
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[0.8rem] leading-relaxed text-ink" tabIndex={0}>
              <code>{block.code}</code>
            </pre>
          </div>
          {block.caption && <figcaption className="mt-2 text-sm text-ink-3">{block.caption}</figcaption>}
        </figure>
      );

    case "metrics":
      return <MetricGrid items={block.items} />;

    case "callout":
      return (
        <aside
          className={`rounded-xl px-5 py-4 ${block.tone === "negative" ? "border border-dashed border-ink" : block.tone === "result" ? "bg-ink text-paper" : "border border-line bg-pale"}`}
          data-reveal
        >
          <p className={`eyebrow ${block.tone === "result" ? "!text-paper/70" : ""}`}>{block.title ?? calloutTitle[block.tone]}</p>
          <p className={`mt-1.5 text-[0.95rem] leading-relaxed ${block.tone === "result" ? "text-paper" : "text-ink-2"}`}>
            <Inline text={block.text} />
          </p>
        </aside>
      );

    case "diagram":
      return <Diagram id={block.id} caption={block.caption} />;

    case "chart":
      return <Chart chart={block.chart} caption={block.caption} note={block.note} />;

    case "steps":
      return (
        <ol className="relative space-y-5 border-l border-line pl-6" data-reveal>
          {block.items.map((s, i) => (
            <li key={i} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-[1.72rem] h-2.5 w-2.5 rounded-full border border-ink bg-paper" />
              <p className="font-medium text-ink">{s.title}</p>
              <p className="prose-body mt-1 !text-[0.98rem]">
                <Inline text={s.text} />
              </p>
            </li>
          ))}
        </ol>
      );

    case "kv":
      return (
        <dl className="grid overflow-hidden rounded-xl border border-line sm:grid-cols-[minmax(10rem,auto)_1fr]">
          {block.items.map(([k, v], i) => (
            <div key={i} className="contents">
              <dt className="border-b border-line bg-pale px-4 py-2.5 text-sm text-ink-3 sm:border-b">{k}</dt>
              <dd className="border-b border-line px-4 py-2.5 text-sm text-ink">
                <Inline text={v} />
              </dd>
            </div>
          ))}
        </dl>
      );
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

export function SectionView({ section, level = 2 }: { section: Section; level?: 2 | 3 }) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <section id={section.id} className="scroll-mt-28">
      <H className={`mb-5 font-medium tracking-tight text-ink ${level === 2 ? "text-2xl" : "text-xl"}`}>{section.title}</H>
      <Blocks blocks={section.blocks} />
    </section>
  );
}
