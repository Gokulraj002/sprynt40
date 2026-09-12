"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { proofNotes, serviceCatalog, type CatalogGroup } from "@/lib/data/service-catalog";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Every catalog tone resolves to the brand accent; the map keeps the call sites tidy. */
const toneDot: Record<CatalogGroup["tone"], string> = {
  orange: "bg-accent",
  blue: "bg-accent",
  violet: "bg-accent",
};

const featuredTitles = [
  "Website & Tech",
  "SEO & Local Presence",
  "Paid Ads",
  "Leads, CRM & Sales",
] as const;

export function HomeWhy() {
  return (
  <Section id="work" theme="light" className="bg-white py-16 sm:py-24">
    <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p variants={fadeUp} className="text-sm font-semibold uppercase text-accent">
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
          {featuredTitles.map((title, index) => {
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
  );
}
