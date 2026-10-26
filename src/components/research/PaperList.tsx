import Link from "next/link";
import type { Paper } from "@/content/types";
import { PaperStatusTag } from "@/components/content/Tags";

export function AuthorLine({ paper }: { paper: Paper }) {
  return (
    <span>
      {paper.authors.map((a, i) => (
        <span key={a.name}>
          {i > 0 && ", "}
          {a.me ? <strong className="font-medium text-ink">{a.name}</strong> : a.name}
        </span>
      ))}
    </span>
  );
}

export function PaperRow({ paper }: { paper: Paper }) {
  return (
    <li>
      <Link href={`/research/${paper.slug}`} className="group grid gap-3 py-6 sm:grid-cols-[9rem_1fr_auto] sm:gap-8" data-reveal>
        <span className="font-mono text-[0.78rem] text-ink-3">{paper.year}</span>
        <span className="min-w-0">
          <span className="block text-[1.08rem] leading-snug font-medium text-ink decoration-1 underline-offset-4 group-hover:underline">
            {paper.title}
          </span>
          <span className="mt-1.5 block text-sm text-ink-3">
            <AuthorLine paper={paper} /> · {paper.venue}
          </span>
          <span className="mt-1 block text-sm text-ink-3">{paper.authorship}</span>
        </span>
        <span className="sm:pt-0.5">
          <PaperStatusTag status={paper.status} />
        </span>
      </Link>
    </li>
  );
}
