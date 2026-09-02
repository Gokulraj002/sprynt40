"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import {
  serviceCatalog,
  workflowSteps,
  type CatalogGroup,
} from "@/lib/data/service-catalog";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const serviceImageByTitle: Record<CatalogGroup["title"], string> = {
  "Website & Tech": "/images/services/website-tech.webp",
  "SEO & Local Presence": "/images/services/local-seo.webp",
  "Paid Ads": "/images/services/ads-content.webp",
  "Social & Content": "/images/services/ads-content.webp",
  "Reviews & Reputation": "/images/services/reviews-loyalty.webp",
  Branding: "/images/services/website-tech.webp",
  Conversion: "/images/services/reporting-revenue.webp",
  "Leads, CRM & Sales": "/images/services/crm-automation.webp",
  "Email & Messaging": "/images/services/crm-automation.webp",
  "Loyalty & Retention": "/images/services/reviews-loyalty.webp",
  "AI & Automation": "/images/services/crm-automation.webp",
  "Revenue & Data": "/images/services/reporting-revenue.webp",
  "Delivery & Marketplace": "/images/services/local-seo.webp",
  "Video & Influencer": "/images/services/ads-content.webp",
  Reporting: "/images/services/reporting-revenue.webp",
};

const toneClasses: Record<CatalogGroup["tone"], string> = {
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue: "border-cyan-200 bg-cyan-50 text-cyan-800",
  violet: "border-orange-200 bg-orange-50 text-orange-700",
};

const dotClasses: Record<CatalogGroup["tone"], string> = {
  orange: "bg-orange-500",
  blue: "bg-cyan-500",
  violet: "bg-orange-500",
};

export function ServicePinBoard() {
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
            Complete service route
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-3xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl"
          >
            Pick the right growth path from one connected service system.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[20rem] text-base leading-7 text-ink-muted sm:max-w-2xl sm:text-lg sm:leading-8"
          >
            Every package is assembled after we study your business, so website,
            marketing, automation and reporting move toward the same goal.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-3 rounded-[1.5rem] border border-orange-200 bg-white/72 p-3 shadow-[0_26px_90px_-62px_rgba(124,45,18,0.48)] backdrop-blur sm:grid-cols-2 sm:p-4 lg:mt-12 lg:grid-cols-4"
        >
          {workflowSteps.map((step) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              className="rounded-[1rem] bg-[#fff8ef] p-4"
            >
              <span className="text-sm font-bold text-orange-600">
                {step.step}
              </span>
              <p className="mt-2 font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                {step.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative mx-auto mt-14 max-w-5xl lg:mt-20">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-4 h-[calc(100%-2rem)] w-16 text-orange-700/36 sm:left-8 lg:left-1/2 lg:w-28 lg:-translate-x-1/2 lg:text-orange-700/62"
            viewBox="0 0 112 2460"
            preserveAspectRatio="none"
          >
            <path
              d="M52 4 C106 118 12 190 62 304 C108 407 7 488 59 610 C107 724 12 790 58 912 C104 1035 8 1102 58 1228 C109 1350 8 1415 58 1540 C107 1660 13 1733 58 1852 C104 1968 8 2038 58 2162 C103 2280 18 2350 58 2456"
              fill="none"
              stroke="currentColor"
              strokeDasharray="11 14"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          <div className="grid gap-8 lg:gap-2">
            {serviceCatalog.map((service, index) => (
              <JourneyService
                key={service.title}
                index={index}
                service={service}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function JourneyService({
  index,
  service,
}: {
  index: number;
  service: CatalogGroup;
}) {
  const image = serviceImageByTitle[service.title];
  const flipped = index % 2 === 1;
  const rotation = flipped ? "lg:rotate-[2deg]" : "lg:-rotate-[2deg]";

  return (
    <motion.article
      variants={fadeUp}
      className="relative grid items-center gap-5 pl-10 sm:pl-16 lg:grid-cols-[1fr_8rem_1fr] lg:gap-8 lg:pl-0"
    >
      <div
        className={cn(
          "relative min-h-[180px] overflow-hidden rounded-[1.25rem] border border-white bg-white shadow-[0_20px_60px_-44px_rgba(15,23,42,0.48)] [clip-path:polygon(2%_6%,17%_2%,32%_5%,48%_2%,65%_6%,82%_3%,98%_7%,96%_25%,99%_43%,95%_61%,98%_80%,94%_96%,77%_93%,61%_98%,44%_94%,28%_97%,10%_93%,4%_98%,6%_77%,2%_60%,5%_42%,1%_24%)] sm:min-h-[220px]",
          rotation,
          flipped && "lg:col-start-3",
        )}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="object-cover saturate-[0.92]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,248,239,0.28))]" />
      </div>

      <div className="relative hidden h-full min-h-28 items-center justify-center lg:flex">
        <span
          className={cn(
            "relative z-10 flex size-14 items-center justify-center rounded-full border-[6px] border-[#fbf6ee] text-sm font-bold text-white shadow-[0_12px_34px_-18px_rgba(124,45,18,0.9)]",
            dotClasses[service.tone],
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div
        className={cn(
          "rounded-[1.25rem] border border-orange-100 bg-white/78 p-5 shadow-[0_20px_70px_-52px_rgba(124,45,18,0.5)] backdrop-blur sm:p-6",
          flipped && "lg:col-start-1 lg:row-start-1",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-bold uppercase",
              toneClasses[service.tone],
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "mt-2 size-2.5 rounded-full",
              dotClasses[service.tone],
            )}
          />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-normal text-ink sm:text-3xl">
          {service.title}
        </h3>
        <ul className="mt-4 space-y-2.5">
          {service.items.slice(0, 4).map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink-muted">
              <span
                className={cn(
                  "mt-2 size-1.5 shrink-0 rounded-full",
                  dotClasses[service.tone],
                )}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
