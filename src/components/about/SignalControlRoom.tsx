import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { serviceCatalog } from "@/lib/data/service-catalog";

const routeSteps = [
  {
    label: "Study",
    title: "Understand the business before choosing services.",
    body: "We review the offer, current website, lead sources, search presence, social activity, sales follow-up and reporting gaps.",
    image: "/images/services/reporting-revenue.webp",
  },
  {
    label: "Shape",
    title: "Turn scattered needs into one growth route.",
    body: "The package is built around the commercial goal: visibility, enquiries, conversion, repeat customers or better sales response.",
    image: "/images/services/website-tech.webp",
  },
  {
    label: "Build",
    title: "Create the assets and systems that remove friction.",
    body: "Pages, ads, content, CRM flows, WhatsApp/email journeys, automation and dashboards are connected instead of handled as separate jobs.",
    image: "/images/services/crm-automation.webp",
  },
  {
    label: "Improve",
    title: "Use reporting to make the next move clear.",
    body: "Every month ends with a practical view of what worked, what needs adjustment and where the next investment should go.",
    image: "/images/services/local-seo.webp",
  },
] as const;

const principles = [
  "No fixed package pushed on every business.",
  "Mobile pages, ads, CRM and reporting planned together.",
  "Brand color, font, spacing and message kept consistent.",
  "Speed and clarity treated as part of conversion.",
] as const;

export function SignalControlRoom() {
  return (
    <main data-theme="light" className="overflow-hidden bg-white">
      <PageHero
        eyebrow="About Sprynt40"
        title="A digital growth team for one clear route."
        lead="Sprynt40 builds tailored four-month growth systems across websites, SEO, paid ads, content, CRM, automation, loyalty and reporting. We start with the business problem, then choose the service mix that can move it."
        visual="image"
        image={{
          src: "/images/page-banners/growth-map.png",
          alt: "A digital growth route map connecting marketing channels",
          position: "center 48%",
          muted: true,
          badge: "Growth route",
          labels: ["Study", "Build", "Improve"],
        }}
        tone="amber"
        primary={{ label: "View services", href: "/services" }}
        secondary={{ label: "Start with an audit", href: "/contact" }}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-accent">
                Why we exist
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-tight text-ink text-balance">
                Most businesses do not need more random marketing activity.
              </h2>
            </div>
            <div className="min-w-0 max-w-3xl text-base leading-8 text-ink-muted sm:text-lg">
              <p>
                They need a practical system that shows what to fix first, what
                to launch next and how to judge whether the work is improving
                revenue. That is the role Sprynt40 plays.
              </p>
              <p className="mt-5">
                We keep the work simple on the surface and disciplined behind
                it: one goal, one package, clear ownership and monthly decisions
                based on what the data and sales response show.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => (
              <div key={principle} className="border-t border-line pt-5">
                <span className="mb-4 block size-2 rounded-full bg-accent" />
                <p className="text-sm font-medium leading-6 text-ink">
                  {principle}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative bg-surface-2 py-16 sm:py-20 lg:py-24">
        <PaperEdge position="top" />
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-accent">
              How we work
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.7rem)] font-semibold leading-tight text-ink text-balance">
              A four-stop route from audit to repeatable growth.
            </h2>
          </div>

          <div className="relative mt-12 min-w-0 overflow-hidden">
            <svg
              aria-hidden
              viewBox="0 0 1050 720"
              className="pointer-events-none absolute inset-x-0 top-10 hidden h-[720px] w-full text-accent/70 lg:block"
              preserveAspectRatio="none"
            >
              <path
                d="M160 82 C 372 28, 430 216, 560 238 C 735 268, 868 182, 912 338 C 960 508, 744 562, 590 532 C 404 496, 300 560, 192 666"
                fill="none"
                stroke="currentColor"
                strokeDasharray="12 14"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-14">
              {routeSteps.map((step, index) => (
                <article
                  key={step.label}
                  className={cn(
                    "relative rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.35)]",
                    index % 2 === 1 && "lg:mt-20",
                  )}
                >
                  <div className="grid gap-5 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <div className="relative aspect-[1.25/1] overflow-hidden [clip-path:polygon(4%_0,100%_7%,94%_94%,0_100%)]">
                      <Image
                        src={step.image}
                        alt={`${step.label} service visual`}
                        fill
                        sizes="(min-width: 640px) 11rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-accent">
                        {String(index + 1).padStart(2, "0")} / {step.label}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink text-balance">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-ink-muted">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
        <PaperEdge position="bottom" />
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-16">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-accent">
                Service depth
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight text-ink text-balance">
                Built for the complete customer journey.
              </h2>
              <p className="mt-5 text-ink-muted">
                The package can be narrow or broad. The decision comes from the
                audit, not from a fixed menu.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {serviceCatalog.slice(0, 8).map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-line bg-surface-2 p-5"
                >
                  <p className="font-display text-xl font-semibold text-ink">
                    {group.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {group.items.slice(0, 2).join(" + ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
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
