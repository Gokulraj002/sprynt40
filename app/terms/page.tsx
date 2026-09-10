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
        eyebrow="Legal · Last updated 11 September 2026"
        title="Terms of Service"
        lead="The umbrella terms for using this website and engaging Sprynt40 for services."
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
                1. Agreement to these terms
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
                website located at{" "}
                <a
                  href="https://sprynt40.online"
                  className="text-ink underline underline-offset-4"
                >
                  sprynt40.online
                </a>{" "}
                (the &ldquo;Site&rdquo;) and any services provided by {site.name}. By
                accessing the Site or engaging us for services, you agree to be bound by these
                Terms. If you do not agree, please do not use the Site or engage our services.
                These Terms are effective as of the &ldquo;Last updated&rdquo; date shown above
                (11 September 2026).
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                2. Definitions
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                In these Terms: &ldquo;Site&rdquo; means the website at sprynt40.online and any
                subdomains; &ldquo;Services&rdquo; means the digital marketing, growth systems,
                creative, website, advertising, analytics and related services we provide;
                &ldquo;Client&rdquo; means the individual or entity that engages us for
                Services; &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to{" "}
                {site.name} (&ldquo;[LEGAL_ENTITY_NAME]&rdquo;); and &ldquo;you&rdquo; means
                the person accessing the Site or engaging us, including anyone acting on
                behalf of a Client.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                3. Eligibility
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                You must be at least 18 years of age and legally capable of entering into a
                binding contract under the Indian Contract Act, 1872 to use the Site or engage
                us for Services. If you are accepting these Terms on behalf of a company or
                other legal entity, you represent that you have the authority to bind that
                entity.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                4. Use of the website
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                You may use the Site for lawful, personal or internal business purposes to
                learn about our Services and to communicate with us. You agree not to: (a)
                scrape, crawl, harvest or systematically extract content from the Site by any
                automated means; (b) reverse engineer, decompile or attempt to derive the
                source code of any part of the Site; (c) interfere with, disrupt or attempt to
                gain unauthorised access to the Site, its servers or its networks; (d) upload
                or transmit any virus, malware, worm or other harmful code; (e) impersonate
                any person or misrepresent your affiliation; or (f) use the Site in any manner
                that violates applicable law, including the Information Technology Act, 2000.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                5. Intellectual property
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                All content on the Site — including text, graphics, logos, images, video,
                design, layout and code — is owned by {site.name} or its licensors and is
                protected by applicable copyright, trademark and other intellectual property
                laws. You may not reproduce, distribute, modify, publicly display, create
                derivative works from or otherwise exploit any Site content without our prior
                written permission. Any content, materials, data or instructions you provide
                to us in connection with Services (&ldquo;Client Content&rdquo;) remain yours;
                you grant us a limited, non-exclusive, royalty-free licence to use, reproduce,
                modify and display the Client Content solely for the purpose of providing the
                Services. Ownership of deliverables produced during an engagement is governed
                by the applicable Statement of Work.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                6. Services and engagement
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Our Services are provided on a project or retainer basis. The specific scope,
                deliverables, timeline, fees, acceptance criteria and other commercial terms
                for any engagement are set out in a separate proposal or Statement of Work
                (&ldquo;SOW&rdquo;) executed by both parties. These Terms operate as the
                umbrella agreement covering all engagements; each SOW incorporates these
                Terms by reference. In the event of a conflict between these Terms and a
                signed SOW, the SOW controls with respect to that engagement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                7. Payment and fees
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Fees for Services are invoiced in accordance with the payment schedule set out
                in the applicable SOW. Unless otherwise stated, invoices are payable within
                the period specified in the SOW (typically within seven days of invoice
                date). All fees are exclusive of applicable taxes, duties and levies
                (including GST), which are payable by the Client in addition to the fees.
                Overdue amounts may attract interest at 1.5% per month (or the maximum rate
                permitted by law, whichever is lower) from the due date until paid in full.
                We may suspend Services if an invoice remains unpaid beyond thirty days from
                its due date. Third-party costs (such as ad spend, platform fees, stock media
                and hosting) are pass-through and billed at cost unless otherwise agreed.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                8. Refunds
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Refunds, where available, are governed by our separate{" "}
                <a href="/refunds" className="text-ink underline underline-offset-4">
                  Refund Policy
                </a>{" "}
                and the terms of the applicable SOW. Please review that policy for eligibility
                and process.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                9. Third-party links and services
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                The Site and our Services may reference or integrate with third-party
                websites, platforms, tools or services (for example advertising platforms,
                analytics providers, CRMs, payment gateways and hosting providers). We do not
                control and are not responsible for the content, availability, terms, privacy
                practices or performance of any third-party service. Your use of any
                third-party service is at your own risk and subject to that provider&rsquo;s
                own terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                10. Disclaimer of warranties
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                The Site and, to the extent permitted by law, the Services are provided on an
                &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties
                of any kind, whether express or implied, including implied warranties of
                merchantability, fitness for a particular purpose and non-infringement.
                Marketing outcomes depend on many factors outside our control — including
                market conditions, competition, budget, creative inputs, platform algorithms
                and Client responsiveness. We do not warrant or guarantee any specific
                business, revenue, ranking, traffic, conversion or other performance result.
                Case studies and metrics shown on the Site describe past engagements under
                specific circumstances and are not a promise of future results for you.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                11. Limitation of liability
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                To the fullest extent permitted by applicable law, {site.name} and its
                directors, employees, contractors and affiliates shall not be liable for any
                indirect, incidental, special, consequential, punitive or exemplary damages,
                or for any loss of profits, revenue, business, goodwill, data or anticipated
                savings, arising out of or in connection with the Site, the Services or these
                Terms, whether in contract, tort (including negligence) or otherwise, even if
                advised of the possibility of such damages. Our aggregate liability for all
                claims arising out of or in connection with an engagement shall not exceed the
                fees actually paid by you to us under that engagement in the six (6) months
                immediately preceding the event giving rise to the claim.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                12. Indemnification
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                You agree to defend, indemnify and hold harmless {site.name} and its
                directors, employees, contractors and affiliates from and against any and all
                claims, damages, losses, liabilities, costs and expenses (including reasonable
                legal fees) arising out of or related to: (a) Client Content, including any
                allegation that Client Content infringes any third-party intellectual property,
                privacy or publicity right, or violates any law; (b) instructions, approvals
                or materials provided by you; (c) your products, services or business
                operations; or (d) your breach of these Terms or an applicable SOW.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                13. Termination
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Either party may terminate an engagement in accordance with the notice and
                termination provisions of the applicable SOW. We may suspend or terminate your
                access to the Site at any time, without notice, if we reasonably believe you
                have breached these Terms or applicable law. On termination of an engagement,
                you remain liable for all fees and third-party costs accrued up to the
                effective date of termination. Sections that by their nature should survive
                termination — including intellectual property, disclaimers, limitation of
                liability, indemnification, governing law and dispute resolution — will
                survive.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                14. Governing law and jurisdiction
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                These Terms and any engagement between you and us are governed by and
                construed in accordance with the laws of India, including the Information
                Technology Act, 2000, the Indian Contract Act, 1872 and the Consumer
                Protection Act, 2019, without regard to conflict-of-laws principles. Subject
                to the dispute resolution clause below, the competent courts at [CITY], India
                shall have exclusive jurisdiction over any dispute arising out of or in
                connection with these Terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                15. Dispute resolution
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                The parties will first attempt in good faith to resolve any dispute, claim or
                controversy arising out of or relating to these Terms or an engagement through
                informal negotiation between authorised representatives, within thirty (30)
                days of written notice from the aggrieved party. If the dispute is not
                resolved within that period, it shall be referred to and finally resolved by
                arbitration under the Arbitration and Conciliation Act, 1996, by a sole
                arbitrator appointed by mutual agreement of the parties. The seat and venue of
                arbitration shall be [CITY], India, and the language of arbitration shall be
                English. The arbitral award shall be final and binding on the parties. Nothing
                in this clause prevents either party from seeking urgent interim or injunctive
                relief from a court of competent jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                16. Changes to these terms
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                We may update these Terms from time to time to reflect changes in our
                Services, our business or applicable law. When we do, we will revise the
                &ldquo;Last updated&rdquo; date at the top of this page. Material changes will
                take effect once posted on the Site. Your continued use of the Site or the
                Services after changes are posted constitutes your acceptance of the revised
                Terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-medium text-balance md:text-2xl">
                17. Contact
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Questions, notices or requests about these Terms can be sent to{" "}
                <a
                  href="mailto:[COMPLETE_CONTACT_EMAIL]"
                  className="text-ink underline underline-offset-4"
                >
                  [COMPLETE_CONTACT_EMAIL]
                </a>
                , or by post to {site.name}, [REGISTERED_OFFICE_ADDRESS], India.
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
