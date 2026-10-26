import type { MetadataRoute } from "next";
import { papers, projects } from "@/content";
import { absoluteUrl } from "@/lib/site";

/** Every route on the site. Content changes are dated by the content check. */
const CHECKED = new Date("2026-10-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/research", "/projects", "/experience", "/competitions", "/skills", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), lastModified: CHECKED, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/projects/${p.slug}`), lastModified: CHECKED, changeFrequency: "monthly" as const, priority: p.featured ? 0.8 : 0.6 })),
    ...papers.map((p) => ({ url: absoluteUrl(`/research/${p.slug}`), lastModified: CHECKED, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
