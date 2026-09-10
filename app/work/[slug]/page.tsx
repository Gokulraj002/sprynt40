import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/shared/PageHero";
import { projects, type Project } from "@/lib/data/projects";

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Next project in the array, wrapping around after the last one. */
function getNextProject(current: Project): Project {
  const index = projects.findIndex((project) => project.slug === current.slug);
  return projects[(index + 1) % projects.length];
}

function getProjectHeroImage(project: Project) {
  if (project.tint === "violet") {
    return {
      src: "/images/page-banners/generated-digital-solutions.png",
      alt: "A conversion-focused website design command center",
      position: "center 42%",
      muted: true,
      badge: "Case study route",
      labels: ["Traffic", "Page", "Demo"],
    };
  }

  if (project.tint === "neutral") {
    return {
      src: "/images/page-banners/generated-customer-bridge.png",
      alt: "A customer bridge visual connecting demand to a local business",
      position: "center 52%",
      muted: true,
      badge: "Case study route",
      labels: ["Search", "Lead", "Booking"],
    };
  }

  return {
    src: "/images/page-banners/generated-service-bulb.png",
    alt: "A digital marketing idea system for scaling campaign results",
    position: "center 52%",
    muted: true,
    badge: "Case study route",
    labels: ["Creative", "Spend", "ROAS"],
  };
}

export function generateStaticParams(): RouteParams[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.client}: ${project.headline}`,
    description: project.challenge,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project);

  return (
    <>
      <PageHero
        eyebrow={project.sector}
        title={project.headline}
        lead={`${project.before} to ${project.after}. ${project.metric.value} ${project.metric.label}.`}
        visual="image"
        image={getProjectHeroImage(project)}
        tone="amber"
        primary={{ label: "Build my package", href: "/contact" }}
      />

      <Section theme="light">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 className="font-display text-title font-medium">The gap</h2>
              <p className="mt-5 max-w-prose text-ink-muted">{project.challenge}</p>
            </div>

            <div className="lg:col-span-7">
              <h2 className="font-display text-title font-medium">Package direction</h2>
              <ol className="mt-5 flex flex-col border-t border-line">
                {project.approach.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-6 border-b border-line py-6 first:pt-0"
                  >
                    <span
                      aria-hidden
                      className="shrink-0 font-display text-2xl tabular-nums text-ink-muted/50"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="max-w-prose text-ink-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-20 sm:mt-28">
            <h2 className="font-display text-title font-medium">What this connects</h2>
            <div className="mt-8 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-3xl border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {project.results.map((result) => (
                <div key={result.label} className="p-8 sm:p-10">
                  <p className="font-display text-display font-medium tabular-nums">
                    {result.value}
                  </p>
                  <p className="mt-2 text-ink-muted">{result.label}</p>
                </div>
              ))}
            </div>
          </div>

          {project.quote && (
            <blockquote className="mt-20 max-w-3xl border-l border-line pl-8 sm:mt-28">
              <p className="font-display text-lead italic text-balance">
                “{project.quote.text}”
              </p>
              <footer className="mt-5 text-sm text-ink-muted">
                {project.quote.author}, {project.quote.role}
              </footer>
            </blockquote>
          )}
        </Container>
      </Section>

      <Section theme="light">
        <Container>
          <div className="flex flex-col items-start gap-12 border-t border-line pt-16 sm:flex-row sm:items-end sm:justify-between">
            <Link
              href={`/work/${next.slug}`}
              data-cursor="View"
              className="group block max-w-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <p className="text-label font-sans uppercase text-ink-muted">Next system →</p>
              <p className="mt-4 font-display text-title font-medium text-balance transition-transform duration-300 group-hover:translate-x-1">
                {next.client}: {next.headline}
              </p>
            </Link>

            <Button href="/contact" variant="accent" className="shrink-0">
              Build my package
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
