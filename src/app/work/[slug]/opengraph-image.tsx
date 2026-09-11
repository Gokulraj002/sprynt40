import { ImageResponse } from "next/og";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/data/site";

export const alt = `${site.name} — Work`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
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
            {project.client} · {project.sector}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 66,
              fontWeight: 700,
              color: "#f5f4f0",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 700,
            }}
          >
            {project.headline}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginLeft: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 96,
                fontWeight: 700,
                color: "#f97316",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {project.metric.value}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 24,
                color: "#f5f4f0",
                opacity: 0.6,
                marginTop: 8,
              }}
            >
              {project.metric.label}
            </div>
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
