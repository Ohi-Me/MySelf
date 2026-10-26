import Link from "next/link";
import { Container, PageHeader } from "@/components/site/Page";
import { resolveRef } from "@/content";
import { skillGroups } from "@/content/site";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Skills and engineering",
  description:
    "Rohit Kumar's capabilities in forecasting, decisions under uncertainty, retrieval, LLM systems, vision, GPU inference, data engineering and backend work, each linked to the projects that show it.",
  path: "/skills",
});

export default function SkillsPage() {
  return (
    <Container>
      <PageHeader
        trail={[{ label: "Skills", href: "/skills" }]}
        eyebrow="Skills and engineering"
        title="Capabilities, with the work that shows each one"
        lede="Grouped by what I can do rather than by tool. Every group links to projects or papers where it was used, so each claim can be checked."
      />
      <div className="space-y-4">
        {skillGroups.map((g, i) => (
          <section key={g.id} id={g.id} className="scroll-mt-24 rounded-2xl border border-line p-6 sm:p-8" data-reveal>
            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
              <div>
                <span className="font-mono text-[0.72rem] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 text-[1.35rem] leading-snug font-medium tracking-tight text-ink">{g.title}</h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{g.summary}</p>
                <p className="eyebrow mt-6 mb-2">Shown in</p>
                <ul className="flex flex-wrap gap-2">
                  {g.evidence.map((slug) => {
                    const ref = resolveRef(slug);
                    if (!ref) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={ref.href}
                          className="inline-flex rounded-full border border-ink px-3 py-1 text-[0.8rem] text-ink transition-colors hover:bg-ink hover:text-paper"
                        >
                          {ref.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <ul className="grid content-start gap-2 sm:grid-cols-2">
                {g.skills.map((s) => (
                  <li key={s} className="rounded-lg bg-pale px-3 py-2 text-[0.88rem] text-ink-2">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
