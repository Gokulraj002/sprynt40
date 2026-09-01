"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { proofNotes, serviceCatalog, workflowSteps } from "@/lib/data/service-catalog";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { fadeUp, staggerParent, viewportOnce } from "@/lib/motion";

const signals = [
  { value: "14 days", label: "campaign launch window" },
  { value: "1 metric", label: "weekly decision focus" },
  { value: "12+", label: "creative tests every month" },
];

const orbitNodes = [
  { label: "Website", left: "84%", top: "50%" },
  { label: "Ads", left: "67%", top: "77.7%" },
  { label: "SEO", left: "33%", top: "77.7%" },
  { label: "CRM", left: "16%", top: "50%" },
  { label: "AI", left: "33%", top: "22.3%" },
  { label: "Loyalty", left: "67%", top: "22.3%" },
];

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
          className="absolute inset-0 object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,0,15,0.45)_0%,rgba(5,0,15,0.18)_35%,rgba(5,0,15,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.28),transparent_28%)]" />

        <Container className="relative z-10 flex flex-1 flex-col">
          <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-between text-center">
            <div className="pt-4 sm:pt-8">
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
                Digital growth engineered with AI clarity
              </p>

              <h1 className="mt-6 font-display text-[clamp(2.9rem,7vw,6.7rem)] font-semibold leading-[0.96] tracking-normal text-white text-balance">
                Being visible is not enough. Be measurable.
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/76 sm:text-xl">
                Sprynt40 builds digital marketing systems where creative,
                websites, ads and analytics work together to turn attention into
                qualified growth.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/contact" variant="accent" className="px-7">
                  Build my growth plan
                </Button>
                <Button
                  href={hasWhatsApp ? waLink("Hi! I want to build a growth plan.") : "/services"}
                  variant="outline"
                  external={hasWhatsApp}
                  className="border-white/25 bg-white/10 px-7 text-white backdrop-blur hover:border-white/60"
                >
                  {hasWhatsApp ? "Talk on WhatsApp" : "Explore services"}
                </Button>
              </div>
            </div>

            <div className="w-full pb-4 sm:pb-6">
              <div className="mx-auto grid max-w-3xl grid-cols-3 overflow-hidden rounded-full border border-white/15 bg-white/10 text-white shadow-[0_24px_90px_-40px_rgba(168,85,247,0.85)] backdrop-blur-md">
                {signals.map((item) => (
                  <div
                    key={item.label}
                    className="border-l border-white/15 px-4 py-3 first:border-l-0 sm:px-6 sm:py-4"
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

      <Section id="services" theme="light" className="bg-white py-16 sm:py-24">
        <Container>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr]"
          >
            <motion.div variants={fadeUp} className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase text-orange-600">
                Complete solutions
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl">
                One custom package built around your business.
              </h2>
              <p className="mt-5 text-lg leading-8 text-ink-muted">
                Sprynt40 does not sell fixed tiers. We study your business,
                choose the right services, deliver for 4 months, then keep the
                system optimized with clear reporting.
              </p>

              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-[#fff8ef] p-3 shadow-[0_24px_80px_-52px_rgba(124,45,18,0.45)]">
                <div className="relative min-h-[430px] overflow-hidden rounded-[1.1rem] bg-[linear-gradient(180deg,#fffefa_0%,#fff3e4_100%)]">
                  <Image
                    src="/images/page-banners/generated-growth-map.png"
                    alt="Strategic growth path concept"
                    fill
                    sizes="(min-width: 1024px) 430px, 100vw"
                    className="object-cover object-[center_52%] opacity-90"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,248,239,0.84))]" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/80 bg-white/82 p-5 shadow-sm backdrop-blur">
                    <p className="text-xs font-semibold uppercase text-orange-600">
                      Your own package
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold leading-tight text-ink">
                      4 months. One flat price. Only what you need.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={staggerParent} className="grid gap-4">
              {workflowSteps.map((item) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  className="grid gap-4 rounded-[1.35rem] border border-orange-100 bg-[linear-gradient(135deg,#ffffff_0%,#fffaf3_100%)] p-5 shadow-[0_18px_60px_-48px_rgba(124,45,18,0.5)] sm:grid-cols-[4.5rem_1fr] sm:p-6"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-orange-500 font-display text-xl font-semibold text-white shadow-[0_12px_34px_-20px_rgba(234,88,12,0.8)]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-ink-muted">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      <Section
        id="catalog"
        theme="light"
        className="bg-[linear-gradient(180deg,#fffaf3_0%,#f8fdff_100%)] py-16 sm:py-24"
      >
        <Container>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase text-orange-600">
              Full service catalog
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-display text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl"
            >
              Marketing, sales, automation and reporting under one system.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-ink-muted">
              We pick from the complete catalog below, so your package fits your
              business instead of forcing you into a template.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {serviceCatalog.map((service, index) => (
              <CatalogCard
                key={service.title}
                index={String(index + 1).padStart(2, "0")}
                title={service.title}
                items={service.items}
              />
            ))}
          </motion.div>
        </Container>
      </Section>

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
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-orange-100 bg-[linear-gradient(180deg,#fffdf7_0%,#f8fbff_100%)] p-6 shadow-[0_24px_70px_-38px_rgba(124,45,18,0.45)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:34px_34px]" />
            <div className="relative flex min-h-[468px] items-center justify-center">
              <div className="absolute left-0 top-8 rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase text-ink-muted">Your business</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">Audit</p>
              </div>
              <div className="absolute right-0 bottom-8 rounded-2xl border border-orange-100 bg-white px-5 py-4 text-right shadow-sm">
                <p className="text-xs font-semibold uppercase text-ink-muted">Sprynt40 system</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">Growth</p>
              </div>
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-100 bg-white shadow-[0_24px_90px_-48px_rgba(234,88,12,0.65)]" />
              <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 shadow-[0_0_70px_rgba(249,115,22,0.45)]" />
              {orbitNodes.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm"
                  style={{
                    left: item.left,
                    top: item.top,
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.45, delay: 0.12 * index }}
                >
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      <Section
        id="cta"
        theme="light"
        className="bg-[linear-gradient(135deg,#f5f3ff_0%,#ecfeff_45%,#fff7ed_100%)] py-16 sm:py-24"
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

function CatalogCard({
  title,
  items,
  index,
}: {
  title: string;
  items: string[];
  index: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[1.25rem] border border-orange-100 bg-white p-5 shadow-[0_18px_60px_-48px_rgba(124,45,18,0.45)]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase text-orange-600">
          {index}
        </span>
        <span className="size-2 rounded-full bg-orange-500" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold leading-tight tracking-normal text-ink">
        {title}
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-ink-muted">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
