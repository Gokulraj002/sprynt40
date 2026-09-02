import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { hasWhatsApp, site, waLink } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
};

const responseSteps = [
  {
    label: "Brief",
    body: "Share what you want to improve: leads, website, ads, local presence, retention or reporting.",
  },
  {
    label: "Audit",
    body: "We review the current path and identify the highest-impact fixes before suggesting a service mix.",
  },
  {
    label: "Plan",
    body: "You get the recommended route, delivery focus and next call agenda without unnecessary package confusion.",
  },
] as const;

const directOptions = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    label: "Location",
    value: site.city,
    href: "/contact",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start with the right growth question."
        lead="Tell us where the business is stuck. We will come back within one working day with the cleanest next step for your website, campaigns, CRM or retention path."
        visual="image"
        image={{
          src: "/images/page-banners/generated-service-bulb.png",
          alt: "A digital marketing idea system with services radiating from a central light",
          position: "center 52%",
          muted: true,
          badge: "Start point",
          labels: ["Brief", "Audit", "Plan"],
        }}
        tone="amber"
      />

      <section className="relative bg-[#fbf6ee] py-16 sm:py-20 lg:py-24">
        <PaperEdge position="top" />
        <Container>
          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-16">
            <ContactForm />

            <aside className="grid h-fit min-w-0 gap-5 lg:sticky lg:top-28">
              <div className="rounded-lg border border-orange-100 bg-white p-5 shadow-[0_24px_70px_-50px_rgba(124,45,18,0.45)] sm:p-6">
                <Chip className="border-orange-200 bg-orange-50 text-orange-700">
                  Faster route
                </Chip>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink text-balance">
                  Prefer to speak directly?
                </h2>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Send a short note with your website link, main service need and
                  current goal. We will route it to the right next step.
                </p>

                <div className="mt-6 grid gap-3">
                  <Button
                    href={waLink("Hi! I want to discuss the Sprynt40 growth package.")}
                    external={hasWhatsApp}
                    variant={hasWhatsApp ? "whatsapp" : "accent"}
                    className="w-full"
                  >
                    {hasWhatsApp ? "Chat on WhatsApp" : "Send your brief"}
                  </Button>

                  {directOptions.map((option) => (
                    <a
                      key={option.label}
                      href={option.href}
                      className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span>{option.label}</span>
                      <span className="min-w-0 truncate text-right text-ink-muted">
                        {option.value}
                      </span>
                    </a>
                  ))}

                  {site.phone && (
                    <a
                      href={`tel:${site.phone}`}
                      className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span>Call</span>
                      <span className="min-w-0 truncate text-right text-ink-muted">
                        {site.phone}
                      </span>
                    </a>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-cyan-100 bg-white shadow-[0_24px_70px_-54px_rgba(15,23,42,0.5)]">
                <div className="relative aspect-[1.55/1]">
                  <Image
                    src="/images/services/crm-automation.webp"
                    alt="CRM and automation workflow for follow-up"
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.42))]" />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-sm font-semibold uppercase text-cyan-700">
                    What to include
                  </p>
                  <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink-muted">
                    <li>Current website or social link</li>
                    <li>Main business goal for the next 4 months</li>
                    <li>Where leads or sales are getting stuck</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
        <PaperEdge position="bottom" />
      </section>

      <Section theme="light" className="py-16 sm:py-20">
        <Container>
          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-orange-700">
                After you enquire
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight text-ink text-balance">
                No vague callback. A clear first route.
              </h2>
              <p className="mt-5 text-ink-muted">
                The first reply should help you understand what to check next,
                even before a full package is proposed.
              </p>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-3">
              <div className="absolute left-[9%] right-[9%] top-8 hidden h-px border-t-2 border-dashed border-orange-300 sm:block" />
              {responseSteps.map((step, index) => (
                <div
                  key={step.label}
                  className="relative rounded-lg border border-line bg-white p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]"
                >
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-sm font-bold text-white",
                      index === 1 ? "bg-cyan-500" : "bg-orange-500",
                    )}
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
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
