/*
  Template policy — have it reviewed by a lawyer before launch.
  Written for an India-based digital marketing agency; references India's
  DPDP Act 2023 and mentions GDPR for EU visitors. Replace all bracketed
  placeholders (legal entity name, contact email, physical address, DPO)
  with real values before this ships to production.
*/
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "1. Who we are",
    body: [
      "Sprynt40 (\"Sprynt40\", \"we\", \"us\", \"our\") is a digital marketing services agency based in India, operating this website at sprynt40.online. We help brands grow through digital marketing, growth systems, creative, websites, ads and analytics — we like to call it Grow Loud!",
      "This Privacy Policy explains what information we collect when you visit sprynt40.online or engage with us, how we use it, who we share it with, and the rights you have over it. It applies to enquiries, prospective clients, active clients and general website visitors.",
      "Last updated: 11 September 2026.",
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "Information you give us. When you fill out a contact or enquiry form, book a call, subscribe to updates, or otherwise reach out, you share details like your name, email address, phone number, company name, role, and the content of any message or brief you send us.",
      "WhatsApp and messaging. If you click a WhatsApp CTA or message us on any third-party platform (WhatsApp, LinkedIn, Instagram, email), we receive whatever contact identifier and message content that platform passes to us. Those platforms have their own privacy policies that also apply to your conversation.",
      "Information we collect automatically. Like most websites, we automatically log basic technical data when you visit — IP address, approximate location (city or region), device and browser type, operating system, referrer URL, pages viewed, time on page and interaction events. This is collected through cookies and similar technologies (see Section 4).",
      "Client-project information. If you become a client, we may also receive access credentials, brand assets, ad-account access, analytics access, campaign data and other project materials strictly for the purpose of delivering the services you engage us for.",
    ],
  },
  {
    title: "3. How we use your information",
    body: [
      "We use your information to: respond to your enquiry and share proposals, deliver the services agreed in your contract, communicate with you about active projects, invoice and meet accounting and tax obligations, improve the performance and content of our website, and — only where you have opted in — send marketing updates about our work and services.",
      "We rely on the lawful bases available to us: performance of a contract with you, your consent, our legitimate interests in running and improving our business, and compliance with applicable law.",
      "We do not sell, rent or trade your personal information to third parties. We do not use your data to train third-party AI models.",
    ],
  },
  {
    title: "4. Cookies and tracking technologies",
    body: [
      "We use two broad categories of cookies. Essential cookies are required for the site to function — for example, remembering that you dismissed a banner or completed a form. Analytics cookies help us understand how visitors use the site (which pages perform, where people drop off) so we can improve it. We may also use marketing pixels if you interact with our paid campaigns.",
      "You can accept, reject or manage non-essential cookies through your browser settings or any consent banner shown on the site. Disabling cookies may affect some site functionality. Most browsers also let you send a \"Do Not Track\" signal; we honour this by not loading non-essential analytics for visitors who opt out.",
    ],
  },
  {
    title: "5. Sharing and disclosure",
    body: [
      "We share personal information only with parties that need it to help us operate. This includes: hosting and infrastructure providers, email and communication tools, analytics providers, CRM and project-management tools, payment and accounting providers, and freelance specialists engaged under confidentiality obligations for a specific project.",
      "We may disclose information where required by law, court order or a valid request from a public authority; to protect our rights, property or safety, or those of our clients; or in connection with a merger, acquisition or sale of business assets, in which case we will notify you.",
      "We do not sell your personal data.",
    ],
  },
  {
    title: "6. Data retention",
    body: [
      "We keep personal information only for as long as we need it for the purpose it was collected — to respond to your enquiry, deliver services, meet our legal, tax and accounting obligations, or resolve disputes. Enquiry data from prospects we did not engage is typically deleted or anonymised within 24 months. Client records are retained for the duration of the engagement and a reasonable period afterwards as required by law.",
    ],
  },
  {
    title: "7. Your rights",
    body: [
      "Under India's Digital Personal Data Protection Act, 2023 (DPDP Act) and, where applicable, the EU/UK General Data Protection Regulation (GDPR), you have the right to: access the personal data we hold about you, correct inaccurate or incomplete data, request deletion of your data, withdraw a consent you previously gave, request a copy of your data in a portable format, and nominate another person to exercise these rights on your behalf in the event of death or incapacity.",
      "You also have the right to complain to a data protection authority — for India, the Data Protection Board of India once operational; for the EU/UK, your local supervisory authority.",
      "To exercise any of these rights, email us using the contact details in Section 12. We will respond within a reasonable time and, where required by law, within the statutory timeframe.",
    ],
  },
  {
    title: "8. Data security",
    body: [
      "We apply reasonable technical and organisational safeguards to protect your information — including HTTPS for site traffic, access controls on internal tools, principle-of-least-privilege for team access, and vetted third-party processors. However, no method of transmission over the internet or electronic storage is fully secure, and we cannot guarantee absolute security. If we ever become aware of a personal data breach that is likely to affect you, we will notify you and the relevant authority in line with applicable law.",
    ],
  },
  {
    title: "9. International data transfers",
    body: [
      "Some of the service providers we use (for example, hosting, analytics and email tools) are located outside India and may process your data in other jurisdictions. Where we transfer personal data across borders, we rely on lawful transfer mechanisms and require our processors to apply protections comparable to those under the DPDP Act and, where relevant, standard contractual clauses under the GDPR.",
    ],
  },
  {
    title: "10. Children's privacy",
    body: [
      "Our website and services are directed at businesses and adults. We do not knowingly collect personal data from anyone under the age of 18. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.",
    ],
  },
  {
    title: "11. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time — for example, when we change how we work, add new tools, or when the law changes. The latest version will always be posted on this page with a revised \"Last updated\" date. Material changes will be highlighted at the top of the page or, where appropriate, communicated to you directly.",
    ],
  },
  {
    title: "12. Contact us",
    body: [
      <>
        Questions, requests or complaints about this policy or how we handle
        your data? Reach the person responsible for privacy at{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {site.email}
        </a>
        . We aim to acknowledge every request within seven working days.
      </>,
      "This policy is governed by the laws of India. Any dispute arising out of or in connection with it is subject to the exclusive jurisdiction of the competent courts in India.",
    ],
  },
] as const;

/** Legal page — privacy policy. Slim hero, plain h2-sectioned legal prose. */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · Last updated 11 September 2026"
        title="Privacy Policy"
        lead="How Sprynt40 collects, uses and protects the information you share with us."
        visual="image"
        image={{
          src: "/images/page-banners/growth-map.png",
          alt: "A softly lit map path used as a legal page banner",
          position: "center 58%",
          muted: true,
          badge: "Policy route",
          labels: ["Collect", "Protect", "Respond"],
        }}
        tone="emerald"
      />

      <Section theme="light">
        <Container>
          <div className="mx-auto max-w-2xl">
            {sections.map((s) => (
              <div key={s.title} className="border-b border-line py-8 first:pt-0 last:border-b-0">
                <h2 className="font-display text-title font-medium text-balance">
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-ink-muted">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link
                href="/"
                className="rounded-sm text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Back to home
              </Link>
              <Link
                href="/contact"
                className="rounded-sm text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
