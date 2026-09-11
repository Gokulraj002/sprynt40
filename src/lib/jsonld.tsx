/*
  Structured data (JSON-LD). Rendered as a literal <script type="application/ld+json">
  in page/layout JSX — never via metadata (Next silently drops JSON-LD placed there)
  and never via next/script (that's for executable JS, not inert data).
  Values sourced only from lib/data/site.ts and lib/data/services.ts.
*/
import { site } from "@/lib/data/site";
import { allServices } from "@/lib/data/services";

export function OrgJsonLd() {
  const sameAs = site.socials.map((social) => social.href);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        areaServed: "IN",
        sameAs,
        makesOffer: allServices.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
