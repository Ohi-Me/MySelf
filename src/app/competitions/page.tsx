import Link from "next/link";
import { Sparkline } from "@/components/charts/Sparkline";
import { EvidenceTag, Tag } from "@/components/content/Tags";
import { Container, PageHeader, SectionHeading } from "@/components/site/Page";
import { platforms, statsFetchedOn } from "@/content/competitive";
import { codingProfiles, mlCompetitions, profileLinks } from "@/content/site";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Competitions and competitive programming",
  description:
    "Kaggle and machine-learning competition results of Rohit Kumar, with LeetCode, Codeforces and CodeChef ratings, problems solved and rating history read from each platform's public data.",
  path: "/competitions",
});

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CompetitionsPage() {
  const solved = platforms.reduce((n, p) => n + p.solved, 0);
  const contests = platforms.reduce((n, p) => n + p.contests, 0);
  const completed = mlCompetitions.filter((c) => c.status === "Completed").length;
  const tensortonic = codingProfiles.find((c) => c.label === "TensorTonic");
  const kaggle = profileLinks.find((l) => l.label === "Kaggle");
  const others = [
    ...profileLinks.filter((l) => l.kind === "profile" && l.label !== "Kaggle").map((l) => ({ label: l.label, href: l.href, note: "" })),
    ...(tensortonic ? [{ label: tensortonic.label, href: tensortonic.href, note: `${tensortonic.best} · ${tensortonic.note}` }] : []),
  ];

  const summary = [
    { value: fmt(solved), label: "problems solved across LeetCode, Codeforces and CodeChef" },
    { value: fmt(contests), label: "rated programming contests" },
    { value: "Top 9%", label: "best Kaggle finish, RSNA Knee (542 of 6,425)" },
    { value: `${completed} + ${mlCompetitions.length - completed}`, label: "ML competitions completed + in progress" },
  ];

  return (
    <Container>
      <PageHeader
        trail={[{ label: "Competitions", href: "/competitions" }]}
        eyebrow="Competitions and competitive programming"
        title={
          <>
            Leaderboards, ratings <em>and how they moved</em>
          </>
        }
        lede={
          <>
            Machine-learning competitions on Kaggle and elsewhere, and contest programming on three platforms. Ratings and
            counts are a snapshot of each platform&apos;s public data, read on {statsFetchedOn}.
          </>
        }
      />

      <ul className="mb-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4" aria-label="Summary">
        {summary.map((s) => (
          <li key={s.label} className="flex flex-col gap-3 bg-paper p-5 sm:p-6" data-reveal>
            <span className="stat text-[1.9rem] sm:text-[2.3rem]">{s.value}</span>
            <span className="text-[0.85rem] leading-snug text-ink-3">{s.label}</span>
          </li>
        ))}
      </ul>

      <section className="mb-20">
        <SectionHeading
          eyebrow="01 · Kaggle and ML competitions"
          title="Machine-learning competitions"
          action={
            kaggle && (
              <a href={kaggle.href} target="_blank" rel="noopener noreferrer" className="link-quiet text-sm text-ink">
                Kaggle profile ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )
          }
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {mlCompetitions.map((c) => (
            <li key={c.name} className="card lift flex flex-col p-5 sm:p-6" data-reveal>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="eyebrow">{c.host}</p>
                <div className="flex gap-2">
                  {c.status === "Completed" && <EvidenceTag kind="leaderboard" />}
                  <Tag label={c.status} style={c.status === "Completed" ? "filled" : "dotted"} />
                </div>
              </div>
              <p className="mt-4 text-[1.15rem] leading-snug font-medium text-ink">
                {c.href ? (
                  <Link href={c.href} className="link-quiet">
                    {c.name}
                  </Link>
                ) : (
                  c.name
                )}
              </p>
              <p className="mt-2 font-mono text-[0.85rem] text-ink">{c.result}</p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-3">{c.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-20">
        <SectionHeading eyebrow="02 · Competitive programming" title="Ratings, problems solved and growth" />
        <ul className="grid gap-4 lg:grid-cols-3">
          {platforms.map((p) => {
            const top = p.breakdown ? Math.max(...p.breakdown.map((b) => b.value)) : 0;
            return (
              <li key={p.id} className="card flex flex-col p-5 sm:p-6" data-reveal>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[1.15rem] font-medium text-ink">{p.label}</h3>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-quiet font-mono text-[0.75rem] text-ink-3 hover:text-ink">
                    @{p.handle} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                  {[
                    { label: "Rating now", value: fmt(p.current) },
                    { label: p.bestTitle ? `Best · ${p.bestTitle}` : "Best rating", value: fmt(p.best) },
                    { label: "Problems solved", value: fmt(p.solved) },
                    { label: "Rated contests", value: fmt(p.contests) },
                  ].map((f) => (
                    <div key={f.label}>
                      <dt className="text-[0.75rem] text-ink-3">{f.label}</dt>
                      <dd className="stat mt-1.5 text-[1.5rem]">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                {p.breakdown && (
                  <div className="mt-6">
                    <p className="eyebrow mb-2.5">Solved by difficulty</p>
                    <ul className="chart space-y-2">
                      {p.breakdown.map((b, i) => (
                        <li key={b.label} className="grid grid-cols-[4rem_1fr_2.5rem] items-center gap-3 text-[0.8rem]">
                          <span className="text-ink-2">{b.label}</span>
                          <span className="relative h-2 overflow-hidden rounded-full bg-pale-2">
                            <span
                              className={`bar absolute inset-y-0 left-0 rounded-full ${i === 2 ? "bg-ink" : i === 1 ? "bg-ink-2" : "bg-ink-3"}`}
                              style={{ width: `${(b.value / top) * 100}%` }}
                            />
                          </span>
                          <span className="text-right font-mono text-ink tabular-nums">{b.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {p.facts.length > 0 && (
                  <ul className="mt-5 space-y-1 text-[0.8rem] text-ink-3">
                    {p.facts.map((f) => (
                      <li key={f.label} className="flex justify-between gap-3 border-b border-line pb-1">
                        <span>{f.label}</span>
                        <span className="font-mono text-ink">{f.value}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-4">
                  <Sparkline series={p.series} label={`${p.label} rating history`} />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-ink-3">
          Each chart shows the rating after every rated contest. Codeforces shows low early ratings because new accounts start
          from a low displayed rating. The problem total adds the three platforms&apos; own counts; they are different problem sets.
        </p>
      </section>

      <section className="mb-20">
        <SectionHeading eyebrow="03 · Elsewhere" title="Other profiles" />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.label} className="bg-paper">
              <a
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between gap-6 p-5 transition-colors hover:bg-pale sm:p-6"
              >
                <span className="flex items-center justify-between text-[1rem] font-medium text-ink">
                  {o.label}
                  <span aria-hidden className="arrow-nudge font-mono text-ink-3">
                    ↗
                  </span>
                </span>
                <span className="text-[0.8rem] break-words text-ink-3">{o.note || o.href.replace(/^https:\/\/(www\.)?/, "")}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-2xl border border-dashed border-line-strong p-5 text-sm leading-relaxed text-ink-3 sm:p-6">
        <p className="eyebrow mb-2">Sources</p>
        <ul className="space-y-1">
          {platforms.map((p) => (
            <li key={p.id}>
              {p.label}: {p.source}, read on {statsFetchedOn}.
            </li>
          ))}
          <li>Competition results: final leaderboards and the case studies linked above.</li>
        </ul>
      </section>
    </Container>
  );
}
