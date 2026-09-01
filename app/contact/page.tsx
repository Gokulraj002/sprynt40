import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/shared/PageHero";
import { hasWhatsApp, site, waLink } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
};

/**
 * The conversion page: dark hero band sets the ask, then a light two-column
 * layout pairs the qualification form (components/contact/ContactForm) with
 * a card of faster, form-free ways to reach us.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s find your <Em>signal</Em>.</>}
        lead="Tell us where you are. We will come back within one working day with the cleanest next step."
        visual="image"
        image={{
          src: "/images/page-banners/generated-service-bulb.png",
          alt: "A digital marketing idea system with services radiating from a central light",
          position: "center 52%",
          muted: true,
          badge: "Start point",
          labels: ["Brief", "Plan", "Call"],
        }}
        tone="violet"
      />

      <Section theme="light" className="pt-16 sm:pt-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.85fr] lg:gap-16">
            <ContactForm />

            <aside className="flex h-fit flex-col gap-6 rounded-3xl border border-line bg-surface-2 p-6 sm:p-8 lg:sticky lg:top-28">
              <div>
                <p className="text-label font-sans uppercase text-ink-muted">Prefer not to fill a form?</p>
                <h2 className="mt-3 text-balance font-display text-title font-medium">
                  Reach us directly.
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  href={waLink("Hi! I'd like to talk.")}
                  external={hasWhatsApp}
                  variant={hasWhatsApp ? "whatsapp" : "accent"}
                  className="w-full"
                >
                  {hasWhatsApp ? "Chat on WhatsApp" : "Send your brief"}
                </Button>

                <a
                  href={`mailto:${site.email}`}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span>Email</span>
                  <span className="truncate text-ink-muted">{site.email}</span>
                </a>

                {site.phone && (
                  <a
                    href={`tel:${site.phone}`}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span>Call</span>
                    <span className="truncate text-ink-muted">{site.phone}</span>
                  </a>
                )}
              </div>

              <p className="border-t border-line pt-6 text-sm text-ink-muted">
                Not ready to start yet? Ask for a <strong className="text-ink">growth audit</strong> first.
                We will review your current website, channels and follow-up path before recommending a package.
              </p>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
