/** Shared Open Graph card, rendered to PNG at build time by next/og. */
export const ogSize = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, subtitle, footer = "Rohit Kumar" }: { eyebrow: string; title: string; subtitle?: string; footer?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        color: "#0b0b0b",
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: "#686868" }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#0b0b0b" }} />
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: title.length > 60 ? 54 : 72, lineHeight: 1.08, letterSpacing: -1.5, fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 30, lineHeight: 1.35, color: "#3a3a3a", maxWidth: 980 }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #0b0b0b", paddingTop: 24, fontSize: 24 }}>
        <span>{footer}</span>
        <span style={{ color: "#686868" }}>ML research · engineering</span>
      </div>
    </div>
  );
}
