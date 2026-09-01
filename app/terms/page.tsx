import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/shared/PageHero";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
};

// Template terms — have them reviewed by a lawyer before launch.

/** Standalone legal page — slim dark hero, light max-w-2xl body, plain link row (no BigCta). */
export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · Last updated 1 September 2026"
        title="Terms of Service"
        lead="The basic terms for using this website and starting a Sprynt40 engagement."
        visual="image"
        image={{
          src: "/images/page-banners/generated-learning-archive.png",
          alt: "A soft archive of framed documents used as a terms page banner",
          position: "center 46%",
          muted: true,
          badge: "Working terms",
          labels: ["Scope", "Rights", "Terms"],
        }}
        tone="cyan"
      />

      <Section theme="light">
        <Container>
          <div className="max-w-2xl space-y-12">
            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Services provided
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {site.name} offers business growth services including websites, SEO,
                advertising, content, CRM, automation, loyalty and reporting. Work is
                delivered under separate written engagement agreements or proposals
                agreed with each client. The content on this website is informational only and
                does not itself constitute an offer or a binding service agreement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Sample content disclaimer
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Case studies, metrics and results shown on this site may be illustrative or
                summarised for presentation purposes. They describe past engagements under
                specific circumstances and are not a representation of results any particular
                client will achieve.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                No guarantees
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Marketing outcomes depend on factors outside our control, including market
                conditions, budget, competition and platform changes. Past results do not
                guarantee future performance, and nothing on this site or in our communications
                should be read as a promise of specific outcomes.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Payment &amp; engagement terms
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Fees, deliverables, timelines and payment schedules are governed by the
                individual proposal or engagement agreement signed with each client, not by
                this website. Where this site and a signed agreement differ, the signed
                agreement controls.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Intellectual property
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                All content on this site — including copy, design, graphics and code — is the
                property of {site.name} or its licensors and may not be reproduced or reused
                without written permission. Deliverables produced for clients are governed
                separately by the applicable engagement agreement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Limitation of liability
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                To the fullest extent permitted by law, {site.name} is not liable for indirect,
                incidental or consequential damages arising from use of this website or
                reliance on its content. Our total liability under any engagement is limited as
                set out in the applicable signed agreement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Termination
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Either party may terminate an active engagement in line with the notice and
                termination terms set out in the relevant proposal or agreement. Access to
                this website may be suspended or withdrawn at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Governing law &amp; jurisdiction
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                These terms are governed by the laws of India, and any disputes arising from
                them or from use of this website are subject to the exclusive jurisdiction of
                the courts of India.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Changes to terms
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                We may update these terms from time to time. Changes take effect once posted
                on this page, and the &ldquo;Last updated&rdquo; date above will reflect the
                most recent revision.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                Contact
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Questions about these terms can be sent to{" "}
                <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-16 flex max-w-2xl flex-wrap items-center gap-4 border-t border-line pt-10">
            <Button href="/" variant="outline">
              Back home
            </Button>
            <Button href="/contact" variant="ink">
              Contact us
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
