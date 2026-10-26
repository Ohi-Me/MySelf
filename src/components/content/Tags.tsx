import type { EvidenceKind, PaperStatus, ProjectStatus } from "@/content/types";
import { evidenceLabel, paperStatusLabel, projectStatusLabel } from "@/lib/site";

type TagStyle = "filled" | "outline" | "dashed" | "dotted" | "muted";

const paperStyle: Record<PaperStatus, TagStyle> = {
  published: "filled",
  dataset: "filled",
  accepted: "filled",
  submitted: "outline",
  "under-review": "outline",
  preprint: "outline",
  manuscript: "dashed",
  "in-progress": "dotted",
};

const projectStyle: Record<ProjectStatus, TagStyle> = {
  completed: "filled",
  research: "outline",
  competition: "outline",
  prototype: "dashed",
  ongoing: "dotted",
};

const evidenceStyle: Record<EvidenceKind, TagStyle> = {
  "held-out": "filled",
  measured: "outline",
  leaderboard: "dashed",
  simulation: "dotted",
  exploratory: "dotted",
  validation: "muted",
  reported: "muted",
};

export function Tag({ label, style = "outline", title }: { label: string; style?: TagStyle; title?: string }) {
  return (
    <span className="tag" data-style={style} title={title}>
      {label}
    </span>
  );
}

export function PaperStatusTag({ status }: { status: PaperStatus }) {
  return <Tag label={paperStatusLabel[status]} style={paperStyle[status]} />;
}

export function ProjectStatusTag({ status }: { status: ProjectStatus }) {
  return <Tag label={projectStatusLabel[status]} style={projectStyle[status]} />;
}

export function EvidenceTag({ kind }: { kind: EvidenceKind }) {
  const l = evidenceLabel[kind];
  return <Tag label={l.short} style={evidenceStyle[kind]} title={l.long} />;
}

/** Legend explaining the evidence tags, shown once per page that uses metrics. */
export function EvidenceLegend({ kinds }: { kinds: EvidenceKind[] }) {
  const unique = Array.from(new Set(kinds));
  if (!unique.length) return null;
  return (
    <dl className="mt-6 grid gap-x-6 gap-y-2 text-sm text-ink-3 sm:grid-cols-2">
      {unique.map((k) => (
        <div key={k} className="flex items-start gap-3">
          <dt className="shrink-0">
            <EvidenceTag kind={k} />
          </dt>
          <dd className="pt-0.5">{evidenceLabel[k].long}</dd>
        </div>
      ))}
    </dl>
  );
}
