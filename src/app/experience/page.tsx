import Link from "next/link";
import { Tag } from "@/components/content/Tags";
import { Container, PageHeader, SectionHeading } from "@/components/site/Page";
import { codingProfiles, education, positions, ratingsCheckedOn, researchExperience } from "@/content/site";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Experience and education",
  description:
    "Education, research experience, competition results, competitive programming ratings and positions of responsibility of Rohit Kumar, each with its status and date.",
  path: "/experience",
});

const competitions = [
  {
    name: "Amazon ML Challenge 2026",
    result: "Team rank 206, final leaderboard, macro F0.5 0.988285",
    detail: "Business entity resolution, 1.73M entities against about 10M records. Team of four.",
    status: "Completed",
    href: "/projects/amazon-ml-entity-resolution",
  },
  {
    name: "RSNA Knee Abnormality Detection (Kaggle)",
    result: "Rank 542 of 6,425 (top 9%), private AUC 0.943",
    detail: "Solo. Final blend includes credited public models; no medal is shown on the profile.",
    status: "Completed",
    href: "/projects/rsna-knee",
  },
  {
    name: "ARC Prize 2026, ARC-AGI-2 (Kaggle)",
    result: "Best public leaderboard score 29.44 so far",
    detail: "Faster decoding within a fixed GPU budget. Final results after 2 November 2026.",
    status: "Ongoing",
    href: "/projects/arc-agi-inference",
  },
  {
    name: "Google Gemma 4 Developer Agent (Kaggle)",
    result: "No final result yet",
    detail: "A coding agent on Gemma 4 served with vLLM. The competition ends on 2 December 2026.",
    status: "Ongoing",
  },
];

export default function ExperiencePage() {
  return (
    <Container>
      <PageHeader
        trail={[{ label: "Experience", href: "/experience" }]}
        eyebrow="Experience and education"
        title="Record"
        lede="Degrees, research, competitions and roles, with dates and the status of anything that is not finished."
      />

      <section className="mb-20">
        <SectionHeading title="Education" />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((e) => (
            <div key={e.degree} className="rounded-2xl border border-line p-6" data-reveal>
              <p className="font-mono text-[0.75rem] text-ink-3">{e.period}</p>
              <p className="mt-3 text-[1.1rem] font-medium text-ink">{e.degree}</p>
              <p className="mt-1 text-sm text-ink-3">{e.school}</p>
              <p className="mt-4 font-mono text-[0.9rem] text-ink">{e.grade}</p>
              <p className="mt-3 text-[0.94rem] leading-relaxed text-ink-2">{e.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <SectionHeading title="Research experience" />
        <div className="space-y-10">
          {researchExperience.map((r) => (
            <div key={r.title} className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8" data-reveal>
              <span className="font-mono text-[0.78rem] text-ink-3">{r.period}</span>
              <div>
                <p className="text-[1.05rem] font-medium text-ink">
                  {r.href ? (
                    <Link href={r.href} className="link-quiet">
                      {r.title}
                    </Link>
                  ) : (
                    r.title
                  )}
                </p>
                <p className="mt-1 text-sm text-ink-3">{r.org}</p>
                <ul className="prose-body mt-3 list-[square] space-y-1.5 pl-5 !text-[0.98rem] marker:text-ink-3">
                  {r.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <SectionHeading title="Competitions" />
        <ul className="divide-y divide-line">
          {competitions.map((c) => (
            <li key={c.name} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:gap-8" data-reveal>
              <div>
                <p className="font-medium text-ink">
                  {c.href ? (
                    <Link href={c.href} className="link-quiet">
                      {c.name}
                    </Link>
                  ) : (
                    c.name
                  )}
                </p>
                <p className="mt-1 text-[0.95rem] text-ink-2">{c.result}</p>
                <p className="mt-1 text-sm text-ink-3">{c.detail}</p>
              </div>
              <span>
                <Tag label={c.status} style={c.status === "Completed" ? "filled" : "dotted"} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-20">
        <SectionHeading title="Competitive programming" />
        <div className="overflow-x-auto rounded-xl border border-line" role="region" aria-label="Competitive programming ratings" tabIndex={0}>
          <table className="w-full min-w-[30rem] text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-line bg-pale font-mono text-[0.7rem] tracking-wide text-ink-3 uppercase">
                <th scope="col" className="px-4 py-2.5 font-normal">
                  Platform
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-normal">
                  Best
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-normal">
                  Current
                </th>
                <th scope="col" className="px-4 py-2.5 font-normal">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {codingProfiles.map((c) => (
                <tr key={c.label} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5">
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink">
                      {c.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink tabular-nums">{c.best}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink-3 tabular-nums">{c.current ?? "—"}</td>
                  <td className="px-4 py-2.5 text-ink-3">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-ink-3">
          Ratings change; these were checked on {ratingsCheckedOn}. Also: 2nd place, Swing &apos;n&apos; Code contest, IIIT Bhubaneswar.
        </p>
      </section>

      <section>
        <SectionHeading title="Positions of responsibility" />
        <ul className="space-y-6">
          {positions.map((p) => (
            <li key={p.title} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-8" data-reveal>
              <span className="font-mono text-[0.78rem] text-ink-3">{p.period}</span>
              <div>
                <p className="font-medium text-ink">{p.title}</p>
                <p className="text-sm text-ink-3">{p.org}</p>
                <p className="mt-2 text-[0.95rem] text-ink-2">{p.points[0]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
