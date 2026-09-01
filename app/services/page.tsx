import type { Metadata } from "next";
import { BigCta } from "@/components/shared/BigCta";
import { PageHero } from "@/components/shared/PageHero";
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
        image={{
          src: "/images/page-banners/generated-digital-solutions.png",
          alt: "A clean digital solutions concept board with campaign service cards",
          position: "center 38%",
          muted: true,
          badge: "Custom stack",
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
