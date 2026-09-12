import type { Metadata } from "next";
import { FaqSection } from "./_components/FaqSection";
import { FinalCtaSection } from "./_components/FinalCtaSection";
import { GrowthSystemSection } from "./_components/GrowthSystemSection";
import { HeroSection } from "./_components/HeroSection";
import { HomeOneFooter } from "./_components/HomeOneFooter";
import { IndustriesSection } from "./_components/IndustriesSection";
import { ProcessSection } from "./_components/ProcessSection";
import { ResultsSection } from "./_components/ResultsSection";
import { ServicesSection } from "./_components/ServicesSection";
import { TrustSection } from "./_components/TrustSection";
import { GrowthPlanLab } from "./GrowthPlanLab";
import styles from "./home1.module.css";

export const metadata: Metadata = {
  title: "Complete Business Growth Solutions",
  description:
    "A tailored four-month growth system connecting marketing, sales, automation, AI and reporting.",
};

export default function HomeOnePage() {
  return (
    <div className={styles.home1Page}>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <GrowthPlanLab />
      <ProcessSection />
      <GrowthSystemSection />
      <IndustriesSection />
      <ResultsSection />
      <FaqSection />
      <FinalCtaSection />
      <HomeOneFooter />
    </div>
  );
}
