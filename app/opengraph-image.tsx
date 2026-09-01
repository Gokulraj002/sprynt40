import { ImageResponse } from "next/og";
import { site } from "@/lib/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BAR_HEIGHTS = [18, 34, 22, 52, 30, 64, 40, 84, 46, 96, 54, 84, 40, 64, 30, 52, 22, 34, 18, 26];

export default async function Image() {
  const domain = new URL(site.url).hostname;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0a0a0c",
          padding: "88px 96px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 92,
              fontWeight: 700,
              color: "#f5f4f0",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            {site.wordmark}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 32,
              color: "#f5f4f0",
              opacity: 0.6,
              marginTop: 28,
              maxWidth: 820,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 96,
            }}
          >
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  width: 10,
                  height: h,
                  borderRadius: 6,
                  background: "#f97316",
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 26,
              color: "#f5f4f0",
              opacity: 0.6,
              marginTop: 24,
              letterSpacing: "0.02em",
            }}
          >
            {domain}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
