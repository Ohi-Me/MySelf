import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/lib/og";

export const alt = "Rohit Kumar · Machine learning research and engineering";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="M.Tech AI · NIT Jalandhar"
      title="Rohit Kumar"
      subtitle="Machine learning systems for forecasting, decisions and retrieval, tested on held-out data."
    />,
    size,
  );
}
