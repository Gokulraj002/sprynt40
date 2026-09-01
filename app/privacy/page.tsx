/*
  Template policy — have it reviewed by a lawyer before launch.
  Generic-but-sensible privacy policy for an Indian digital marketing agency
  website. Swap in real legal review before this ships to production.
*/
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/shared/PageHero";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "What we collect",
    body: [
      "When you fill out a contact or enquiry form on this site, we collect the details you submit — typically your name, email address, phone number, company name and the message you send us.",
      "Like most websites, we also collect basic analytics data automatically: pages visited, device and browser type, approximate location, and how you found the site. This helps us understand what's working and fix what isn't.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "We use the information you share to respond to your enquiry, understand your goals, and put together a proposal or plan for working together.",
      "If you become a client, we use your details to deliver the agreed services and communicate about the work in progress.",
      `We do not sell, rent or trade your personal information to third parties. Full stop.`,
    ],
  },
  {
    title: "Cookies & analytics",
    body: [
      "This site uses cookies and similar technologies for essential functionality and to understand how visitors use the site through analytics tools. You can control or disable cookies through your browser settings, though some parts of the site may not work as intended without them.",
    ],
  },
  {
    title: "WhatsApp & third-party communications",
    body: [
      "If you choose to message us on WhatsApp or another third-party platform, that conversation is also subject to that platform's own privacy policy and terms. We use these channels only to communicate with you directly about your enquiry or project — never for unsolicited marketing.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We keep enquiry and client data for as long as it's needed to deliver our services, meet legal or accounting obligations, and maintain a reasonable record of our work together. Data that's no longer needed is deleted or anonymised.",
    ],
  },
  {
    title: "Your rights",
    body: [
      <>
        You can ask us to access, correct or delete the personal data we hold
        about you at any time. To make a request, email us at{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {site.email}
        </a>{" "}
        and we&apos;ll get back to you within a reasonable time.
      </>,
    ],
  },
  {
    title: "Governing law",
    body: [
      "This policy, and any dispute arising from it, is governed by the laws of India, and is subject to the exclusive jurisdiction of the courts of India.",
    ],
  },
  {
    title: "Contact",
    body: [
      <>
        Questions about this policy or how your data is handled? Reach us at{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-ink underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {site.email}
        </a>
        .
      </>,
    ],
  },
] as const;

/** Legal page — privacy policy. Slim hero, plain h2-sectioned legal prose. */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal · Last updated 1 September 2026"
        title="Privacy Policy"
        lead="How Sprynt40 collects, uses and protects enquiry and client information."
        visual="image"
        image={{
          src: "/images/page-banners/generated-growth-map.png",
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
