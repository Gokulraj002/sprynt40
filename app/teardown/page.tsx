import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading, Em } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { hasWhatsApp, waLink } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Growth Audit",
};

/*
  Dedicated growth-audit page. One goal only: get enough context to recommend
  the right custom package.
*/

const WHAT_WE_LOOK_AT = [
  {
    name: "Website and funnel clarity",
    text: "Whether your pages explain the offer quickly, load cleanly on mobile and guide visitors toward one clear enquiry action.",
  },
  {
    name: "Search and local presence",
    text: "Where SEO, Google Business Profile, listings and local signals are helping or limiting discovery.",
  },
  {
    name: "Paid media readiness",
    text: "Whether tracking, audience, creative and landing-page message match are strong enough before more budget is spent.",
  },
  {
    name: "Lead handling",
    text: "How enquiries move through CRM, calls, WhatsApp, email and follow-up after the first response.",
  },
  {
    name: "Retention opportunities",
    text: "Where reviews, loyalty, win-back offers, referrals and repeat-purchase flows can create more value from existing customers.",
  },
  {
    name: "Reporting gaps",
    text: "Which numbers should be visible every month so strategy, creative and automation keep improving together.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    n: "01",
    name: "Share your current setup",
    text: "Send your website, active channels, customer flow and the business goal you want the next 4 months to support.",
  },
  {
    n: "02",
    name: "We map the gaps",
    text: "We review website, visibility, campaigns, content, CRM, automation and reporting as one connected system.",
  },
  {
    n: "03",
    name: "You get the package direction",
    text: "You leave with the clearest service mix to prioritize, whether that starts with website, ads, SEO, automation or retention.",
  },
] as const;

export default function TeardownPage() {
  return (
    <>
      <PageHero
        eyebrow="Growth audit"
        title={<>Find the gap <Em>before</Em> you build the package.</>}
        lead="A focused review of your website, visibility, campaigns, follow-up and reporting so the 4-month Sprynt40 package starts with the right priorities."
        visual="image"
        image={{
          src: "/images/page-banners/generated-customer-bridge.png",
          alt: "A bridge visual for finding the gap between traffic and business outcomes",
          position: "center 52%",
          muted: true,
          badge: "Growth audit",
          labels: ["Study", "Prioritize", "Build"],
        }}
        tone="amber"
        primary={{ label: "Start the audit", href: "/contact" }}
        secondary={{
          label: hasWhatsApp ? "Book via WhatsApp" : "View services",
          href: hasWhatsApp ? waLink("Hi! I'd like a growth audit.") : "/services",
          external: hasWhatsApp,
        }}
      />

      {/* What we look at */}
      <Section theme="light">
        <Container>
          <SectionHeading label="The audit" title="What we look at" />

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2">
            {WHAT_WE_LOOK_AT.map((item) => (
              <div key={item.name} className="border-t border-line pt-6">
                <h3 className="font-display text-title font-medium">
                  {item.name}
                </h3>
                <p className="mt-2 text-ink-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section theme="light" className="pt-0">
        <Container>
          <SectionHeading label="Audit path" title="How it works" />

          <ol className="mt-14 border-b border-line sm:mt-16">
            {HOW_IT_WORKS.map((step) => (
              <li
                key={step.n}
                className="grid grid-cols-12 items-start gap-x-6 gap-y-4 border-t border-line py-10 sm:gap-x-8 sm:py-12"
              >
                <span
                  className="col-span-4 font-display text-6xl leading-none text-ink-muted/40 tabular-nums sm:col-span-2 sm:text-7xl"
                  aria-hidden="true"
                >
                  {step.n}
                </span>

                <h3 className="col-span-8 font-display text-title font-medium sm:col-span-3">
                  {step.name}
                </h3>

                <p className="col-span-12 max-w-prose text-ink-muted sm:col-span-7 sm:col-start-6">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Closing accent band — restates the single CTA, no alternatives */}
      <section className="relative overflow-hidden bg-accent py-20 text-accent-ink sm:py-28">
        <Container>
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="max-w-xl font-display text-display font-medium text-balance">
              Start with the right plan.
            </h2>
            <Button variant="ink" href="/contact" className="shrink-0">
              Start the audit
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
