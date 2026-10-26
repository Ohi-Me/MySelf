import Link from "next/link";
import { resolveRef } from "@/content";

/** Related projects and papers, resolved from slugs. */
export function RelatedWork({ slugs }: { slugs: string[] }) {
  const items = slugs.map(resolveRef).filter((x): x is NonNullable<typeof x> => Boolean(x));
  if (!items.length) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <li key={r.href}>
          <Link href={r.href} className="lift group flex h-full flex-col rounded-xl border border-line p-4" data-reveal>
            <span className="eyebrow">{r.type === "paper" ? "Research" : "Project"}</span>
            <span className="mt-2 font-medium text-ink">{r.title}</span>
            <span className="mt-1 line-clamp-2 text-sm text-ink-3">{r.summary}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Previous and next entries in a collection. */
export function PrevNext({
  prev,
  next,
  base,
}: {
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
  base: "/projects" | "/research";
}) {
  return (
    <nav aria-label="Previous and next" className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={`${base}/${prev.slug}`} className="group rounded-xl p-3 -m-3 hover:bg-pale">
          <span className="eyebrow">← Previous</span>
          <span className="mt-1 block text-ink">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`${base}/${next.slug}`} className="group rounded-xl p-3 -m-3 text-right hover:bg-pale">
          <span className="eyebrow">Next →</span>
          <span className="mt-1 block text-ink">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
