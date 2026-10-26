import type { CSSProperties, ReactNode } from "react";
import type { DiagramId } from "@/content/types";
import { diagrams, type FlowNode, type FlowRow, type NodeStyle } from "./specs";

const nodeClass: Record<NodeStyle, string> = {
  solid: "border border-line-strong bg-paper text-ink",
  dashed: "border border-dashed border-ink-3 bg-paper text-ink",
  filled: "border border-ink bg-ink text-paper",
  muted: "border border-line bg-pale text-ink-2",
};

function Node({ node }: { node: FlowNode }) {
  const style = node.style ?? "solid";
  return (
    <div className={`min-w-0 flex-1 rounded-lg px-3.5 py-2.5 ${nodeClass[style]}`}>
      <p className="text-[0.9rem] leading-snug font-medium">{node.title}</p>
      {node.detail && (
        <p className={`mt-0.5 text-[0.8rem] leading-snug ${style === "filled" ? "opacity-80" : "text-ink-3"}`}>{node.detail}</p>
      )}
    </div>
  );
}

function Connector({ label }: { label?: string }) {
  return (
    <div className="relative flex h-7 justify-center" aria-hidden>
      <span className="connector block h-full w-px bg-ink-3" />
      <span className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-ink-3" />
      {label && (
        <span className="absolute top-1/2 left-1/2 ml-3 -translate-y-1/2 font-mono text-[0.68rem] tracking-wide whitespace-nowrap text-ink-3 uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

function Row({ row }: { row: FlowRow }) {
  if (row.loop) {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-ink-3 px-3.5 py-2.5 text-[0.82rem] leading-snug text-ink-2">
        <span aria-hidden className="font-mono text-base leading-none text-ink">↺</span>
        <span>{row.loop}</span>
      </div>
    );
  }
  if (row.seq) {
    return (
      <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center">
        {row.nodes.map((n, i) => (
          <div key={i} className="contents">
            {i > 0 && (
              <span aria-hidden className="self-center font-mono text-xs text-ink-3">
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
            <Node node={n} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      className="grid gap-2.5 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
      style={{ "--cols": row.nodes.length } as CSSProperties}
    >
      {row.nodes.map((n, i) => (
        <Node key={i} node={n} />
      ))}
    </div>
  );
}

function Flow({ rows }: { rows: FlowRow[] }) {
  // Wrap consecutive rows that share a group name in one dashed box.
  const out: ReactNode[] = [];
  let i = 0;
  while (i < rows.length) {
    const group = rows[i].group;
    const start = i;
    while (i < rows.length && rows[i].group === group && group !== undefined) i++;
    if (group !== undefined) {
      const members = rows.slice(start, i);
      out.push(
        <div key={`g${start}`}>
          {start > 0 && <Connector label={members[0].via} />}
          <div className="rounded-xl border border-dashed border-ink-3 p-3 sm:p-4">
            <p className="eyebrow mb-3">{group}</p>
            {members.map((r, k) => (
              <div key={k}>
                {k > 0 && <Connector label={r.via} />}
                <Row row={r} />
              </div>
            ))}
          </div>
        </div>,
      );
    } else {
      const r = rows[i];
      out.push(
        <div key={i}>
          {i > 0 && <Connector label={r.via} />}
          <Row row={r} />
        </div>,
      );
      i++;
    }
  }
  return <div className="mx-auto max-w-2xl">{out}</div>;
}

const segmentClass: Record<NodeStyle, string> = {
  solid: "bg-paper border-r border-line-strong",
  dashed: "bg-[repeating-linear-gradient(135deg,var(--pale-2)_0_6px,var(--paper)_6px_12px)] border-r border-line-strong",
  filled: "bg-ink text-paper",
  muted: "bg-pale-2 border-r border-line-strong",
};

export function Diagram({ id, caption }: { id: DiagramId; caption: string }) {
  const spec = diagrams[id];
  return (
    <figure className="diagram my-2" data-reveal>
      <div className="rounded-2xl border border-line bg-pale/50 p-4 sm:p-6">
        {spec.kind === "flow" ? (
          <Flow rows={spec.rows} />
        ) : (
          <div>
            <div className="flex h-12 overflow-hidden rounded-lg border border-ink">
              {spec.segments.map((s, i) => (
                <div
                  key={i}
                  className={`flex min-w-0 items-center justify-center px-1 text-[0.72rem] font-medium ${segmentClass[s.style]}`}
                  style={{ flexGrow: s.value, flexBasis: 0 }}
                >
                  <span className="truncate">{s.label}</span>
                </div>
              ))}
            </div>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {spec.segments.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-28 shrink-0 font-medium text-ink">{s.label}</span>
                  <span className="text-ink-3">
                    {s.detail} · {s.value} {spec.unit}
                  </span>
                </li>
              ))}
            </ul>
            {spec.footnote && <p className="mt-3 text-[0.8rem] text-ink-3">{spec.footnote}</p>}
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-3">{caption}</figcaption>
    </figure>
  );
}
