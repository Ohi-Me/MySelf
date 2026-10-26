import { Container, PageHeader, SectionHeading } from "@/components/site/Page";
import { codingProfiles, profile, profileLinks } from "@/content/site";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact and CV",
  description: "Email Rohit Kumar, find his profiles, and download his academic CV.",
  path: "/contact",
});

export default function ContactPage() {
  const links = [...profileLinks, ...codingProfiles.map((c) => ({ label: c.label, href: c.href }))];
  return (
    <Container>
      <PageHeader trail={[{ label: "Contact", href: "/contact" }]} eyebrow="Contact" title="Let's talk" lede={profile.availability} />

      <section className="mb-20 grid gap-4 md:grid-cols-2">
        <a href={`mailto:${profile.email}`} className="lift group flex flex-col justify-between rounded-2xl bg-ink p-6 text-paper sm:p-8" data-reveal>
          <span className="eyebrow !text-paper/60">Email</span>
          <span className="mt-10 text-[1.25rem] break-all sm:text-[1.45rem]">{profile.email}</span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-paper/80">
            Write to me <span aria-hidden className="arrow-nudge">→</span>
          </span>
        </a>
        <a href="/cv/Rohit_Kumar_Academic_CV.pdf" download className="lift group flex flex-col justify-between rounded-2xl border border-line p-6 sm:p-8" data-reveal>
          <span className="eyebrow">Download</span>
          <span className="mt-10 text-[1.25rem] text-ink sm:text-[1.45rem]">Academic CV (PDF, 2 pages)</span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-3">
            Research, publications, awards <span aria-hidden className="arrow-nudge">↓</span>
          </span>
        </a>
      </section>

      <section className="mb-20">
        <SectionHeading title="Profiles" />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.href} className="bg-paper">
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between px-5 py-4 hover:bg-pale">
                <span className="text-ink">{l.label}</span>
                <span aria-hidden className="arrow-nudge text-ink-3">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading title="Good to know" />
        <dl className="grid gap-x-8 gap-y-4 text-[0.95rem] sm:grid-cols-[12rem_1fr]">
          <dt className="eyebrow pt-1">Based in</dt>
          <dd className="text-ink-2">{profile.location}. Open to relocating within India, and abroad with visa sponsorship.</dd>
          <dt className="eyebrow pt-1">ORCID</dt>
          <dd>
            <a href={`https://orcid.org/${profile.orcid}`} target="_blank" rel="noopener noreferrer" className="link text-ink">
              {profile.orcid}
            </a>
          </dd>
          <dt className="eyebrow pt-1">Resume</dt>
          <dd className="text-ink-2">An industry resume tailored to the role is available on request.</dd>
        </dl>
      </section>
    </Container>
  );
}
