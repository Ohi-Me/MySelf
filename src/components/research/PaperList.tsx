import Link from "next/link";
import type { Paper } from "@/content/types";
import { PaperStatusTag } from "@/components/content/Tags";
import { ManuscriptSheet } from "./Manuscript";

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

/**
 * One paper in a list. With `readable`, a disclosure under the row opens the
 * whole manuscript sheet in place, so the paper can be read without leaving
 * the list.
 */
export function PaperRow({ paper, readable = false }: { paper: Paper; readable?: boolean }) {
  return (
    <li className={readable ? "pb-6" : undefined}>
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
      {readable && (
        <details className="reader sm:ml-[11rem]">
          <summary className="inline-flex items-center gap-2 rounded-full border border-ink px-3.5 py-1.5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper">
            <span aria-hidden className="reader-chevron inline-block transition-transform">
              ›
            </span>
            Read the paper here
            <span className="font-mono text-[0.68rem] text-current opacity-70">
              {paper.sections.length + 2} sections · pipeline · updates
            </span>
          </summary>
          <div className="mt-5">
            <ManuscriptSheet paper={paper} prefix={`${paper.slug}-`} />
          </div>
        </details>
      )}
    </li>
  );
}
