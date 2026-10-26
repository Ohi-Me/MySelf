import type { Metadata } from "next";
import type { EvidenceKind, PaperStatus, ProjectKind, ProjectStatus } from "@/content/types";
import { profile } from "@/content/site";

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL to the confirmed domain before a
 * production build. On Vercel the production URL is used automatically when it
 * is not set; locally it falls back to localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = profile.name;

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** Page metadata with a canonical URL and Open Graph fields. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  siteImage = true,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  /** Routes with their own opengraph-image file pass false so that file is used. */
  siteImage?: boolean;
}): Metadata {
  // A page-level openGraph object replaces the inherited one, so pages without
  // their own image name the site card explicitly.
  // The key must be absent (not undefined) for a route's own image file to apply.
  const images = siteImage ? { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME} · ${title}` }] } : {};
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, siteName: SITE_NAME, locale: "en_IN", ...images },
    twitter: { card: "summary_large_image", title, description, ...images },
  };
}

/** JSON-LD as a script tag body, escaped against `</script>` injection. */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const projectStatusLabel: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  prototype: "Prototype",
  research: "Research programme",
  competition: "Competition",
};

export const projectKindLabel: Record<ProjectKind, string> = {
  research: "Research",
  competition: "Competition",
  system: "System",
  product: "Product",
};

export const paperStatusLabel: Record<PaperStatus, string> = {
  published: "Published",
  accepted: "Accepted",
  submitted: "Submitted",
  "under-review": "Under review",
  preprint: "Preprint",
  manuscript: "Manuscript, not yet submitted",
  "in-progress": "In progress",
  dataset: "Published dataset",
};

export const evidenceLabel: Record<EvidenceKind, { short: string; long: string }> = {
  "held-out": { short: "Held-out test", long: "Scored once on data not used during development." },
  validation: { short: "Validation", long: "Development data used to make choices; optimistic by construction." },
  leaderboard: { short: "Leaderboard", long: "A competition leaderboard score; comparable only with other leaderboard scores." },
  exploratory: { short: "Exploratory", long: "Run after scoring and not pre-registered." },
  simulation: { short: "Simulation", long: "Computed with a stylised model, not observed." },
  measured: { short: "Measured", long: "A direct engineering measurement or count." },
  reported: { short: "Reported", long: "Recorded by the author or organiser; not re-derived here." },
};
