import { ImageResponse } from "next/og";
import { allServices } from "@/lib/data/services";
import { site } from "@/lib/data/site";

export const alt = `${site.name} — Services`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = allServices.find((s) => s.slug === slug) ?? allServices[0];
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 26,
              color: "#f5f4f0",
              opacity: 0.6,
            }}
          >
            {site.wordmark}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#f97316",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Service
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 76,
              fontWeight: 700,
              color: "#f5f4f0",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {service.name}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 30,
              color: "#f5f4f0",
              opacity: 0.6,
              marginTop: 24,
              maxWidth: 860,
            }}
          >
            {service.short}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 64,
              height: 10,
              borderRadius: 6,
              background: "#f97316",
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 26,
              color: "#f5f4f0",
              opacity: 0.6,
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
