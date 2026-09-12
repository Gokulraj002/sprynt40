import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BigCta } from "@/components/ui/BigCta";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { projects, type Project } from "@/lib/data/projects";
import { stats } from "@/lib/data/social-proof";

export const metadata: Metadata = {
  title: "Work",
};

const projectImages: Record<Project["slug"], string> = {
  "local-brand-growth-system": "/images/services/ads-content.webp",
  "conversion-led-website-system": "/images/services/website-tech.webp",
  "local-visibility-retention-system": "/images/services/reviews-loyalty.webp",
};

const projectTone: Record<Project["tint"], { dot: string; panel: string; text: string }> = {
  lime: {
    dot: "bg-orange-500",
    panel: "border-orange-100 bg-orange-50/45",
    text: "text-orange-700",
  },
  neutral: {
    dot: "bg-ink",
    panel: "border-line bg-surface",
    text: "text-ink-muted",
  },
  violet: {
    dot: "bg-orange-500",
    panel: "border-orange-100 bg-[#fff7ed]",
    text: "text-orange-700",
  },
};

export default function WorkPage() {
  const statStrip = stats.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Work systems"
        title="Proof of how one growth package comes together."
        lead="Representative build paths for the Sprynt40 model, showing how website, visibility, ads, CRM, retention and reporting connect around one business goal."
        visual="image"
        image={{
          src: "/images/page-banners/agency/work-banner-v2.png",
          alt: "An agency strategist presenting campaign performance to clients",
          position: "60% center",
          labels: ["Audit", "Build", "Revenue"],
        }}
        tone="amber"
        primary={{ label: "Start a project", href: "/contact" }}
        secondary={{ label: "View services", href: "/services" }}
      />

      <Section theme="light" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </Container>
      </Section>

      <section className="relative bg-[#fbf6ee] py-16 sm:py-20">
        <PaperEdge position="top" />
        <Container>
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-orange-700">
                Operating proof
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight text-ink text-balance">
                Results are shown as systems, not isolated services.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {statStrip.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_18px_50px_-42px_rgba(124,45,18,0.45)]"
                >
                  <p className="font-display text-3xl font-semibold tabular-nums text-ink">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-muted">
            These examples are designed to show the service combinations clearly.
            Replace them with approved client proof when real results and
            permissions are available.
          </p>
        </Container>
        <PaperEdge position="bottom" />
      </section>

      <BigCta />
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tone = projectTone[project.tint];

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="View"
      aria-label={`Read growth system: ${project.client}`}
      className="group block rounded-lg border border-line bg-white p-3 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.48)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <article>
        <div className="relative aspect-[4/3] overflow-hidden [clip-path:polygon(2%_0,100%_5%,96%_96%,0_100%)]">
          <Image
            src={projectImages[project.slug]}
            alt={`${project.client} service route`}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.0),rgba(15,23,42,0.45))]" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-lg border border-white/20 bg-white/86 px-3 py-2 text-xs font-semibold text-ink backdrop-blur">
            <span>{project.sector}</span>
            <span className={cn("size-2 rounded-full", tone.dot)} />
          </div>
        </div>

        <div className="p-3 pt-5">
          <p className={cn("text-xs font-semibold uppercase", tone.text)}>
            {String(index + 1).padStart(2, "0")} / {project.before} to {project.after}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink text-balance">
            {project.headline}
          </h2>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">
            {project.challenge}
          </p>

          <div className={cn("mt-5 rounded-lg border p-4", tone.panel)}>
            <p className="font-display text-3xl font-semibold tabular-nums text-ink">
              {project.metric.value}
            </p>
            <p className="mt-1 text-sm leading-5 text-ink-muted">
              {project.metric.label}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 text-sm font-semibold text-ink">
            <span>View system</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PaperEdge({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-0 right-0 h-8 bg-white",
        position === "top"
          ? "top-0 [clip-path:polygon(0_0,100%_0,100%_44%,91%_62%,79%_45%,66%_72%,52%_48%,39%_70%,25%_48%,12%_69%,0_50%)]"
          : "bottom-0 [clip-path:polygon(0_55%,12%_35%,26%_58%,39%_34%,52%_60%,66%_38%,79%_55%,91%_36%,100%_54%,100%_100%,0_100%)]",
      )}
    />
  );
}
