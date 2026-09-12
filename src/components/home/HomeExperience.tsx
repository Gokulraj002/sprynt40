import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeServiceJourney } from "@/components/home/HomeServiceJourney";
import { HomeWhy } from "@/components/home/HomeWhy";
import { GrowthPlanLab } from "@/app/home1/GrowthPlanLab";

/** Homepage composition. Each section owns its own data and markup. */
export function HomeExperience() {
  return (
    <>
      <HeroCarousel />
      <HomeServiceJourney />
      <div className="[--orange:#f97604]">
        <GrowthPlanLab />
      </div>
      <HomeProcess />
      <HomeWhy />
      <HomeCta />
    </>
  );
}
