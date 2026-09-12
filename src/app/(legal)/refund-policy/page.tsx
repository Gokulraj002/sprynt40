import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Refund Policy",
};

/**
 * Slim legal page — no BigCta closer here by design (this is a policy
 * reference, not a conversion moment). Just a light body and a link row out.
 *
 * Template policy — have it reviewed by a lawyer before launch.
 */
export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · Last updated 1 September 2026"
        title="Refund Policy"
        lead="How service fees, platform spend and cancellation requests are handled."
        visual="none"
        tone="amber"
      />

      <Section theme="light">
        <Container>
          <div className="max-w-2xl">
            <div className="space-y-12">
              <section>
                <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                  Service fees
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Sprynt40 packages are scoped and billed according to the
                  written proposal agreed with each client. Work begins once the
                  agreed kickoff requirements and first payment are completed.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                  Delivery commitment
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Timelines depend on the approved scope, content, access and
                  client feedback speed. If Sprynt40 cannot deliver a committed
                  milestone for reasons within our control, we will review the
                  issue and propose a fair correction, credit or refund where
                  applicable.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                  Ad spend
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Ad spend is paid directly to the ad platforms (Meta,
                  Google, etc.) from your own accounts. It never passes
                  through us, and it is never refundable by us — any
                  disputes over ad spend go to the platform, not to us.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                  Mid-month cancellations
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  You can cancel anytime, but we do not pro-rate refunds for
                  the current billing period. If you cancel mid-month, the
                  engagement continues through to the end of the period
                  you&apos;ve already paid for, then ends.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                  How to request a refund
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Email us at{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-ink underline underline-offset-4 hover:text-accent"
                  >
                    {site.email}
                  </a>{" "}
                  with your account details and the reason for the request.
                  We process eligible refunds within 7 working days.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                  Exceptions & disputes
                </h2>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Something doesn&apos;t feel right? Talk to us first — most
                  issues get resolved in a conversation. Any dispute we
                  can&apos;t settle directly is governed by the laws of
                  India.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-16 max-w-2xl border-t border-line pt-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/" variant="outline">
                Back to home
              </Button>
              <Button href="/contact" variant="outline">
                Contact us
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
