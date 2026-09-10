import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { allServices, type Service } from "@/lib/data/services";
import { hasWhatsApp, site, waLink } from "@/lib/data/site";

function getService(slug: string): Service | undefined {
  return allServices.find((s) => s.slug === slug);
}

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.outcome,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} - ${site.name}`,
      description: service.outcome,
      url: `/services/${service.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} - ${site.name}`,
      description: service.outcome,
    },
  };
}

/** Structured data: Service, rendered directly in the route body. */
function ServiceJsonLd({ service }: { service: Service }) {
  const url = `${site.url}/services/${service.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    serviceType: service.name,
    name: service.name,
    description: service.outcome,
    url,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    areaServed: { "@type": "Country", name: "India" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} deliverables`,
      itemListElement: service.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function DeliverablesList({ deliverables }: { deliverables: string[] }) {
  return (
    <ul className="mt-8 divide-y divide-line border-y border-line">
      {deliverables.map((item, i) => (
        <li key={item} className="flex items-baseline gap-6 py-5">
          <span className="font-display text-sm text-ink-muted tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-lg text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function getServiceHeroImage(service: Service) {
  const shared = {
    muted: true,
    badge: "Service system",
  };

  if (service.slug === "performance-marketing") {
    return {
      ...shared,
      src: "/images/page-banners/generated-service-bulb.png",
      alt: "A digital marketing services system built around a central growth idea",
      position: "center 52%",
      labels: ["Signal", "Creative", "Scale"],
    };
  }

  if (service.slug === "funnels-cro") {
    return {
      ...shared,
      src: "/images/page-banners/generated-digital-solutions.png",
      alt: "A website design command center showing conversion-focused interfaces",
      position: "center 42%",
      labels: ["Page", "Offer", "Lead"],
    };
  }

  if (service.slug === "seo") {
    return {
      ...shared,
      src: "/images/page-banners/generated-growth-map.png",
      alt: "A glowing map route representing search visibility and compounding growth",
      position: "center 50%",
      labels: ["Intent", "Content", "Rank"],
    };
  }

  return {
    ...shared,
    src: "/images/page-banners/generated-digital-solutions.png",
    alt: "A digital solutions board with service cards and campaign planning",
    position: "center 40%",
    labels: ["Target", "Launch", "Measure"],
  };
}

export default async function ServicePage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd service={service} />

      <PageHero
        eyebrow="Service"
        title={service.name}
        lead={service.outcome}
        visual="image"
        image={getServiceHeroImage(service)}
        tone="violet"
        primary={{ label: "Get your growth plan", href: "/contact" }}
        secondary={{
          label: hasWhatsApp ? "Chat on WhatsApp" : "View all services",
          href: hasWhatsApp ? waLink(`Hi! I'm interested in ${service.name}.`) : "/services",
          external: hasWhatsApp,
        }}
      />

      {/* Body + deliverables */}
      <Section theme="light">
        <Container>
          <div className="max-w-prose space-y-5 text-lg text-ink-muted">
            {service.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-16">
            <SectionHeading label="Deliverables" title="What you get" />
            <DeliverablesList deliverables={service.deliverables} />
          </div>
        </Container>
      </Section>

      {/* Closing band */}
      <Section theme="light">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-display text-title font-medium text-balance">
              See the work, then get your plan.
            </h2>
            <p className="mt-4 text-lead text-ink-muted">
              Browse recent {service.name.toLowerCase()} results or talk to us about
              yours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/#work" variant="outline">
                See the work
              </Button>
              <Button href="/contact" variant="accent">
                Get your growth plan
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
