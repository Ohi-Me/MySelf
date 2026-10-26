import Link from "next/link";
import { Container, PageHeader, SectionHeading } from "@/components/site/Page";
import { principles, profile } from "@/content/site";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Rohit Kumar's path from electrical engineering to machine learning research: academic journey, research interests, how he works, and what he is looking for next.",
  path: "/about",
  type: "profile",
});

const journey = [
  {
    when: "2020 – 2024",
    title: "B.Tech, Electrical and Electronics Engineering, IIIT Bhubaneswar",
    text: "Power systems, signals and embedded hardware. Wrote the C++ for a real-time arc-fault detector on a Raspberry Pi (IEEE APSIT 2023, co-author) and the analysis code for a renewable-energy study (IJ-ICT 2026, co-author).",
    href: "/research/arc-fault-detection",
  },
  {
    when: "2025",
    title: "M.Tech, Artificial Intelligence, NIT Jalandhar",
    text: "Moved from building electrical systems to learning from their data. Research on forecasting and decision making for India's power system, advised by Dr Urvashi Bansal.",
  },
  {
    when: "Feb – Aug 2026",
    title: "RE-FUSED, the early stages",
    text: "An ambitious pipeline that mostly failed instructively: deep models lost to a tree on yesterday's residual, a carbon gate lost to random noise, and 98.2% of test prices turned out to be carried forward. Each failure changed the method.",
    href: "/projects/re-fused",
  },
  {
    when: "Sep 2026",
    title: "Pre-registration, and one score",
    text: "Rebuilt the data from official sources, froze every choice and its hash, and scored two programmes once. Wrote four manuscripts; one is submitted and the dataset is public.",
    href: "/research",
  },
  {
    when: "Sep – Oct 2026",
    title: "Competitions and systems",
    text: "Entity resolution at 10-million-record scale (team rank 206), knee MRI with labels read from reports (rank 542 of 6,425), faster LLM decoding for ARC, and agent systems where fixed rules make the risky decisions.",
    href: "/projects",
  },
];

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        trail={[{ label: "About", href: "/about" }]}
        eyebrow="About"
        title="From power electronics to machine learning that has to be right"
        lede={profile.statement}
      />

      <section className="mb-24">
        <SectionHeading eyebrow="Journey" title="How I got here" />
        <ol className="relative space-y-10 border-l border-line pl-8">
          {journey.map((j) => (
            <li key={j.title} className="relative" data-reveal>
              <span aria-hidden className="absolute top-1.5 -left-[2.3rem] h-3 w-3 rounded-full border border-ink bg-paper" />
              <p className="font-mono text-[0.75rem] text-ink-3">{j.when}</p>
              <p className="mt-1 text-[1.08rem] font-medium text-ink">
                {j.href ? (
                  <Link href={j.href} className="link-quiet">
                    {j.title}
                  </Link>
                ) : (
                  j.title
                )}
              </p>
              <p className="prose-body mt-2 max-w-3xl">{j.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-24 grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Interests" title="Research interests" />
          <p className="prose-body">
            Decision-reliable machine learning: uncertainty that stays calibrated when data arrive late and shift, judging models by the decisions they drive, and knowing when adaptivity pays. My main testbed is power systems and electricity markets.
          </p>
          <p className="prose-body mt-4">
            On the engineering side: agents whose risky actions are decided by tested code rather than a model, retrieval and entity resolution at scale, and getting large models to run within real GPU budgets.
          </p>
        </div>
        <div>
          <SectionHeading eyebrow="Next" title="What I am looking for" />
          <p className="prose-body">{profile.availability}</p>
          <p className="prose-body mt-4">
            I am most useful where a model&apos;s output turns into a decision with a cost, where the data are messy, and where someone needs to know whether a result will hold.
          </p>
          <Link href="/contact" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.92rem] text-paper">
            Get in touch <span aria-hidden className="arrow-nudge">→</span>
          </Link>
        </div>
      </section>

      <section className="mb-24">
        <SectionHeading eyebrow="Method" title="How I work" />
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {principles.map((p, i) => (
            <li key={p.title} className="bg-paper p-6" data-reveal>
              <span className="font-mono text-[0.72rem] text-ink-3">0{i + 1}</span>
              <p className="mt-3 font-medium text-ink">{p.title}</p>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-ink-2">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionHeading eyebrow="Outside work" title="Beyond the code" />
        <p className="prose-body max-w-3xl">
          Chess, photography (core member of the Photogeeks team at IIIT Bhubaneswar&apos;s tech fest), poetry on stage, and carrom (winner, BH3, NIT Jalandhar). I speak English and Hindi.
        </p>
      </section>
    </Container>
  );
}
