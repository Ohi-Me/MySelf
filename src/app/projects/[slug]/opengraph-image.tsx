import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content";
import { OgCard, ogSize } from "@/lib/og";
import { projectKindLabel, projectStatusLabel } from "@/lib/site";

export const alt = "Project case study by Rohit Kumar";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return new ImageResponse(
    <OgCard
      eyebrow={p ? `${projectKindLabel[p.kind]} · ${projectStatusLabel[p.status]}` : "Project"}
      title={p?.title ?? "Project"}
      subtitle={p?.tagline}
    />,
    size,
  );
}
