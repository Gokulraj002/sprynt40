import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";
import { BigCta } from "@/components/shared/BigCta";
import { PageHero } from "@/components/shared/PageHero";
import { cn } from "@/lib/cn";
import { projects } from "@/lib/data/projects";
import { stats } from "@/lib/data/social-proof";

export const metadata: Metadata = {
  title: "Work",
};

/**
 * Work index — the "results, not decks" proof list. Plain server-rendered
 * rows (no motion/client JS): hover polish is CSS transitions only, matching
 * the hard rule that this route ships without a "use client" boundary.
 * Deliberately does NOT reuse components/home/WorkCard (client + motion) —
 * this is a simpler, static row built for the full index.
 */
export default function WorkPage() {
  const statStrip = stats.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Growth systems"
        title="See how the Sprynt40 package can come together."
        lead="Representative build paths showing how website, visibility, ads, CRM, automation, loyalty and reporting can connect inside one 4-month system."
        visual="image"
        image={{
          src: "/images/page-banners/generated-customer-bridge.png",
          alt: "A bridge visual connecting customer demand to business growth",
          position: "center 49%",
          muted: true,
          badge: "Customer bridge",
          labels: ["Intent", "Traffic", "Revenue"],
        }}
        tone="amber"
        primary={{ label: "Start a project", href: "/contact" }}
      />

      <Section theme="light" className="pt-0">
        <Container>
          <div className="border-t border-line">
            {projects.map((project, i) => {
              const alignEnd = i % 2 === 1;

              return (
                <div
                  key={project.slug}
                  className="border-b border-line py-12 sm:py-16"
                >
                  <Link
                    href={`/work/${project.slug}`}
                    data-cursor="View"
                    aria-label={`Read growth system: ${project.client} - ${project.headline}`}
                    className={cn(
                      "group block w-full lg:w-[92%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                      alignEnd ? "lg:ml-auto lg:pl-[4%]" : "lg:mr-auto lg:pr-[4%]",
                    )}
                  >
                    <div className={cn("max-w-2xl", alignEnd && "lg:ml-auto lg:text-right")}>
                      <p className="text-label font-sans uppercase text-ink-muted">
                        {project.sector}
                      </p>

                      <h2 className="mt-4 font-display text-title font-medium text-balance transition-transform duration-300 group-hover:translate-x-1">
                        {project.headline}
                      </h2>

                      <p
                        className={cn(
                          "mt-5 flex flex-wrap items-baseline gap-2 font-display text-lead tabular-nums",
                          alignEnd && "lg:justify-end",
                        )}
                      >
                        <span className="text-ink-muted">{project.before}</span>
                        <span aria-hidden className="text-ink-muted">
                          →
                        </span>
                        <span className="text-accent">{project.after}</span>
                      </p>

                      <p className="mt-5 line-clamp-2 text-ink-muted">{project.challenge}</p>

                      <div
                        className={cn(
                          "mt-6 flex flex-wrap items-center gap-4",
                          alignEnd && "lg:justify-end",
                        )}
                      >
                        <Chip pulse>
                          {project.metric.value} {project.metric.label}
                        </Chip>

                        <span className="inline-flex items-center gap-2 text-sm font-medium text-ink transition-transform duration-300 group-hover:translate-x-1">
                          View system
                          <span aria-hidden>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section theme="light" className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-3 sm:gap-10">
            {statStrip.map((s) => (
              <div key={s.label}>
                <p className="font-display text-title font-medium tabular-nums">
                  {s.value}
                  {s.suffix}
                </p>
                <p className="mt-2 text-ink-muted text-balance">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-muted">
            These are representative systems. Replace them with real client
            proof once approved results and permissions are available.
          </p>
        </Container>
      </Section>

      <BigCta />
    </>
  );
}
