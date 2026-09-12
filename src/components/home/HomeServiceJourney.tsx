"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { serviceCatalog, type CatalogGroup } from "@/lib/data/service-catalog";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const journeyTitles = [
  "Website & Tech",
  "SEO & Local Presence",
  "Paid Ads",
  "Leads, CRM & Sales",
  "Loyalty & Retention",
  "Reporting",
] as const;

/** Every catalog tone resolves to the brand accent; the map keeps call sites tidy. */
const toneDot: Record<CatalogGroup["tone"], string> = {
  orange: "bg-accent",
  blue: "bg-accent",
  violet: "bg-accent",
};

const serviceImages: Record<(typeof journeyTitles)[number], string> = {
  "Website & Tech": "/images/services/website-tech.webp",
  "SEO & Local Presence": "/images/services/local-seo.webp",
  "Paid Ads": "/images/services/ads-content.webp",
  "Leads, CRM & Sales": "/images/services/crm-automation.webp",
  "Loyalty & Retention": "/images/services/reviews-loyalty.webp",
  Reporting: "/images/services/reporting-revenue.webp",
};

export function HomeServiceJourney() {
  const services = journeyTitles.map((title) =>
    serviceCatalog.find((service) => service.title === title),
  ) as CatalogGroup[];

  return (
    <section
      id="services"
      data-theme="light"
      className="relative overflow-hidden bg-[#fbf6ee] py-14 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-8 bg-white [clip-path:polygon(0_0,100%_0,100%_42%,92%_62%,84%_44%,73%_68%,63%_39%,51%_61%,40%_45%,30%_70%,17%_42%,8%_62%,0_48%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-8 bg-white [clip-path:polygon(0_58%,8%_39%,18%_62%,31%_35%,42%_58%,52%_40%,63%_66%,75%_38%,86%_61%,94%_42%,100%_58%,100%_100%,0_100%)]"
      />

      <Container>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-[21rem] text-center sm:max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold uppercase text-accent"
          >
            Growth route
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-3xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl"
          >
            A custom path from visibility to qualified growth.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[20rem] text-base leading-7 text-ink-muted sm:max-w-2xl sm:text-lg sm:leading-8"
          >
            We combine only the services your business needs, then connect them
            into one 4-month execution plan.
          </motion.p>
        </motion.div>

        <div className="relative mx-auto mt-12 max-w-5xl lg:mt-16">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-5 h-[calc(100%-2rem)] w-16 text-orange-700/34 sm:left-8 lg:left-1/2 lg:w-28 lg:-translate-x-1/2 lg:text-orange-700/62"
            viewBox="0 0 112 1000"
            preserveAspectRatio="none"
          >
            <path
              d="M52 4 C106 78 12 145 62 232 C106 324 8 385 58 486 C108 587 9 650 58 752 C104 838 18 910 58 996"
              fill="none"
              stroke="currentColor"
              strokeDasharray="11 14"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-8 lg:gap-2"
          >
            {services.map((service, index) => (
              <HomeJourneyStop
                key={service.title}
                index={index}
                service={service}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/services" variant="accent" className="w-full px-8 sm:w-auto">
            View full service route
          </Button>
          <Button href="/contact" variant="outline" className="w-full bg-white/72 px-8 sm:w-auto">
            Build my package
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
function HomeJourneyStop({
  index,
  service,
}: {
  index: number;
  service: CatalogGroup;
}) {
  const flipped = index % 2 === 1;
  const image =
    serviceImages[service.title as (typeof journeyTitles)[number]];

  return (
    <motion.article
      variants={fadeUp}
      className="relative grid items-center gap-5 pl-10 sm:pl-16 lg:grid-cols-[1fr_8rem_1fr] lg:gap-8 lg:pl-0"
    >
      <div
        className={cn(
          "relative min-h-[174px] overflow-hidden rounded-[1.15rem] border border-white bg-white shadow-[0_20px_60px_-44px_rgba(15,23,42,0.48)] [clip-path:polygon(2%_6%,17%_2%,32%_5%,48%_2%,65%_6%,82%_3%,98%_7%,96%_25%,99%_43%,95%_61%,98%_80%,94%_96%,77%_93%,61%_98%,44%_94%,28%_97%,10%_93%,4%_98%,6%_77%,2%_60%,5%_42%,1%_24%)] sm:min-h-[220px]",
          flipped ? "lg:col-start-3 lg:rotate-[2deg]" : "lg:-rotate-[2deg]",
        )}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="object-cover saturate-[0.92]"
        />
      </div>

      <div className="relative hidden h-full min-h-28 items-center justify-center lg:flex">
        <span className={cn("relative z-10 flex size-14 items-center justify-center rounded-full border-[6px] border-[#fbf6ee] text-sm font-bold text-white shadow-[0_12px_34px_-18px_rgba(124,45,18,0.9)]", toneDot[service.tone])}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className={cn(
          "rounded-[1.15rem] border border-orange-100 bg-white/82 p-5 shadow-[0_20px_70px_-52px_rgba(124,45,18,0.5)] backdrop-blur sm:p-6",
          flipped && "lg:col-start-1 lg:row-start-1",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase text-orange-700">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={cn("mt-2 size-2.5 rounded-full", toneDot[service.tone])} />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-normal text-ink sm:text-3xl">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base sm:leading-7">
          {service.items.slice(0, 2).join(" plus ")}.
        </p>
      </div>
    </motion.article>
  );
}
