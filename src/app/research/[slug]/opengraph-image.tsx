import { ImageResponse } from "next/og";
import { getPaper, papers } from "@/content";
import { OgCard, ogSize } from "@/lib/og";
import { paperStatusLabel } from "@/lib/site";

export const alt = "Research by Rohit Kumar";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPaper(slug);
  return new ImageResponse(
    <OgCard eyebrow={p ? `${paperStatusLabel[p.status]} · ${p.venue}` : "Research"} title={p?.title ?? "Research"} />,
    size,
  );
}
