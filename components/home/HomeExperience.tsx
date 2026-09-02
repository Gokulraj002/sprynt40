"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { proofNotes, serviceCatalog, type CatalogGroup } from "@/lib/data/service-catalog";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const signals = [
  { value: "14 days", label: "campaign launch window" },
  { value: "1 metric", label: "weekly decision focus" },
  { value: "12+", label: "creative tests every month" },
];

const homeServiceTitles = [
  "Website & Tech",
  "SEO & Local Presence",
  "Paid Ads",
  "Leads, CRM & Sales",
  "Loyalty & Retention",
  "Reporting",
] as const;

const homeServiceImages: Record<(typeof homeServiceTitles)[number], string> = {
  "Website & Tech": "/images/services/website-tech.webp",
  "SEO & Local Presence": "/images/services/local-seo.webp",
  "Paid Ads": "/images/services/ads-content.webp",
  "Leads, CRM & Sales": "/images/services/crm-automation.webp",
  "Loyalty & Retention": "/images/services/reviews-loyalty.webp",
  Reporting: "/images/services/reporting-revenue.webp",
};

const toneDot: Record<CatalogGroup["tone"], string> = {
  orange: "bg-orange-500",
  blue: "bg-cyan-500",
  violet: "bg-orange-500",
};

export function HomeExperience() {
  return (
    <>
      <Section
        id="hero"
        theme="dark"
        className="flex min-h-svh overflow-hidden pt-24 pb-8 sm:pt-28 lg:pt-[7.5rem]"
      >
        <Image
          src="/images/home/hero-command-wall.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover object-center saturate-[0.88] hue-rotate-[105deg]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.48)_0%,rgba(10,8,5,0.2)_35%,rgba(10,8,5,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.28),transparent_28%)]" />

        <Container className="relative z-10 flex flex-1 flex-col">
          <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-between text-center">
            <div className="pt-4 sm:pt-8">
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
                Digital growth engineered with AI clarity
              </p>

              <h1 className="mx-auto mt-6 max-w-[22rem] font-display text-[clamp(2.28rem,10.8vw,6.7rem)] font-semibold leading-[1.02] tracking-normal text-white text-balance sm:max-w-5xl sm:leading-[0.98]">
                Being visible is not enough. Be measurable.
              </h1>

              <p className="mx-auto mt-5 max-w-[21rem] text-base leading-7 text-white/76 sm:max-w-3xl sm:text-xl sm:leading-8">
                Sprynt40 builds digital marketing systems where creative,
                websites, ads and analytics work together to turn attention into
                qualified growth.
              </p>

              <div className="mx-auto mt-7 flex w-full max-w-[21rem] flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
                <Button href="/contact" variant="accent" className="w-full px-7 sm:w-auto">
                  Build my growth plan
                </Button>
                <Button
                  href={hasWhatsApp ? waLink("Hi! I want to build a growth plan.") : "/services"}
                  variant="outline"
                  external={hasWhatsApp}
                  className="w-full border-white/25 bg-white/10 px-7 text-white backdrop-blur hover:border-white/60 sm:w-auto"
                >
                  {hasWhatsApp ? "Talk on WhatsApp" : "Explore services"}
                </Button>
              </div>
            </div>

            <div className="w-full pb-4 sm:pb-6">
              <div className="mx-auto grid max-w-[21rem] grid-cols-1 overflow-hidden rounded-[1.25rem] border border-white/15 bg-white/10 text-white shadow-[0_24px_90px_-40px_rgba(249,115,22,0.78)] backdrop-blur-md sm:max-w-3xl sm:grid-cols-3 sm:rounded-full">
                {signals.map((item) => (
                  <div
                    key={item.label}
                    className="border-t border-white/15 px-4 py-3 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 sm:px-6 sm:py-4"
                  >
                    <p className="font-display text-xl font-semibold sm:text-3xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-white/65 sm:text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <HomeServiceJourney />

      <Section id="work" theme="light" className="bg-white py-16 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase text-orange-600">
              Why it works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-display text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl"
            >
              More than campaigns. A connected growth operating system.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-ink-muted">
              Website, ads, SEO, reviews, CRM, WhatsApp, loyalty, AI automation
              and reporting are planned together, so every service supports the
              same revenue goal.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 grid gap-3 sm:grid-cols-2">
              {proofNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-orange-100 bg-[#fffaf3] p-5 text-sm font-semibold text-ink shadow-sm"
                >
                  {note}
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/services" variant="accent" className="px-7">
                Explore all services
              </Button>
              <Button href="/work" variant="outline" className="bg-white px-7">
                View selected work
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-orange-100 bg-[#fbf6ee] p-6 shadow-[0_24px_70px_-38px_rgba(124,45,18,0.45)]"
          >
            <div className="relative h-full min-h-[468px]">
              {homeServiceTitles.slice(0, 4).map((title, index) => {
                const service = serviceCatalog.find((item) => item.title === title)!;
                return (
                  <div
                    key={service.title}
                    className={cn(
                      "absolute w-[46%] rounded-[1rem] border border-orange-100 bg-white/84 p-4 shadow-sm backdrop-blur",
                      index === 0 && "left-0 top-4",
                      index === 1 && "right-0 top-24",
                      index === 2 && "left-0 bottom-24",
                      index === 3 && "right-0 bottom-4",
                    )}
                  >
                    <span className={cn("block size-2 rounded-full", toneDot[service.tone])} />
                    <p className="mt-3 font-semibold leading-tight text-ink">{service.title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                      {service.items[0]}
                    </p>
                  </div>
                );
              })}
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full text-orange-700/42"
                viewBox="0 0 480 480"
                fill="none"
              >
                <path
                  d="M80 70 C260 110 210 190 370 170 C430 270 120 220 105 342 C250 410 305 300 405 392"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="10 14"
                />
              </svg>
            </div>
          </motion.div>
        </Container>
      </Section>

      <Section
        id="cta"
        theme="light"
        className="bg-[linear-gradient(135deg,#fff8ef_0%,#ecfeff_48%,#fff7ed_100%)] py-16 sm:py-24"
      >
        <Container>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-sm font-semibold uppercase text-violet">
              Start clean
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-6xl">
              Bring one business goal. We will build the route to it.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink-muted">
              Share your product, current channels and target number. We will
              map the fastest honest path before you spend on more campaigns.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/contact" variant="accent" className="px-8">
                Get the strategy call
              </Button>
              <Button href="/services" variant="outline" className="bg-white/70 px-8">
                Explore services
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}

function HomeServiceJourney() {
  const services = homeServiceTitles.map((title) =>
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
            className="text-sm font-semibold uppercase text-orange-600"
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
    homeServiceImages[service.title as (typeof homeServiceTitles)[number]];

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
