import type { Metadata } from "next";
import { BigCta } from "@/components/ui/BigCta";
import { PageHero } from "@/components/ui/PageHero";
import { ServicePinBoard } from "@/components/services/ServicePinBoard";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title={
          <>
            <span className="block">Digital solutions</span>
            <span className="block">built around you.</span>
          </>
        }
        lead="From marketing to automation, Sprynt40 builds one tailored 4-month system around your business instead of selling fixed packages."
        visual="image"
        size="compact"
        image={{
          src: "/images/page-banners/agency/services-banner-v2.png",
          alt: "A digital agency team planning a connected growth strategy together",
          position: "63% 12%",
          labels: ["Study", "Build", "Optimize"],
        }}
        tone="violet"
        primary={{ label: "Build my package", href: "/contact" }}
        secondary={{ label: "View the catalog", href: "#services" }}
      />

      <ServicePinBoard />

      <BigCta />
    </div>
  );
}
