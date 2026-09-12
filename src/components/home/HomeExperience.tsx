import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeServiceJourney } from "@/components/home/HomeServiceJourney";
import { HomeWhy } from "@/components/home/HomeWhy";

/** Homepage composition. Each section owns its own data and markup. */
export function HomeExperience() {
  return (
    <>
      <HeroCarousel />
      <HomeServiceJourney />
      <HomeWhy />
      <HomeCta />
    </>
  );
}
