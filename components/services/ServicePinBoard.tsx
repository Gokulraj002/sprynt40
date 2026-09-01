"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { serviceCatalog, workflowSteps, type CatalogGroup } from "@/lib/data/service-catalog";
import { cn } from "@/lib/cn";

const boardPositions = [
  { left: "42px", top: "80px", rotate: "-7deg" },
  { left: "398px", top: "255px", rotate: "6deg" },
  { left: "90px", top: "470px", rotate: "5deg" },
  { left: "390px", top: "700px", rotate: "-5deg" },
  { left: "58px", top: "930px", rotate: "-4deg" },
  { left: "390px", top: "1160px", rotate: "6deg" },
  { left: "110px", top: "1390px", rotate: "4deg" },
  { left: "395px", top: "1620px", rotate: "-5deg" },
  { left: "58px", top: "1850px", rotate: "-6deg" },
  { left: "388px", top: "2080px", rotate: "5deg" },
  { left: "112px", top: "2310px", rotate: "-4deg" },
  { left: "392px", top: "2540px", rotate: "6deg" },
  { left: "58px", top: "2770px", rotate: "5deg" },
  { left: "388px", top: "3000px", rotate: "-5deg" },
  { left: "225px", top: "3230px", rotate: "2deg" },
] as const;

const toneClasses: Record<CatalogGroup["tone"], string> = {
  orange: "border-orange-100 bg-orange-50/78 text-orange-600",
  blue: "border-blue-100 bg-blue-50/82 text-blue-700",
  violet: "border-violet-100 bg-violet-50/82 text-violet-700",
};

const pinClasses: Record<CatalogGroup["tone"], string> = {
  orange: "bg-orange-500 shadow-[0_0_28px_rgba(249,115,22,0.45)]",
  blue: "bg-blue-500 shadow-[0_0_28px_rgba(59,130,246,0.4)]",
  violet: "bg-violet-500 shadow-[0_0_28px_rgba(139,92,246,0.38)]",
};

export function ServicePinBoard() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 35%"],
  });

  const boardScale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.96, 1.02, 1.05, 1]);
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(serviceCatalog.length - 1, Math.max(0, Math.floor(value * serviceCatalog.length))));
  });

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_32%,#fff7ed_100%)] py-12 sm:py-16 lg:py-18"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase text-orange-600">
            Complete service catalog
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl">
            Your package is built from the services your business actually needs.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink-muted">
            We study the business first, then choose the right mix across
            website, marketing, sales, automation, loyalty and reporting.
          </p>
        </div>

        <div className="mt-9 space-y-8">
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1.5rem] border border-orange-100 bg-white p-6 shadow-[0_24px_80px_-58px_rgba(124,45,18,0.48)]"
          >
            <p className="text-xs font-semibold uppercase text-orange-600">
              How it works
            </p>
            <h3 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-ink">
              4 months. One flat price. No forced add-ons.
            </h3>
            <div className="mt-6 grid gap-3 lg:grid-cols-4">
              {workflowSteps.map((step) => (
                <div key={step.step} className="grid grid-cols-[3rem_1fr] gap-3 rounded-2xl bg-[#fff8ef] p-4 lg:grid-cols-1">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500 font-display text-base font-semibold text-white">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.div
            className="relative mx-auto hidden min-h-[3620px] max-w-[840px] overflow-hidden rounded-[2rem] border border-orange-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] shadow-[0_34px_110px_-78px_rgba(15,23,42,0.48)] lg:block"
            style={{ scale: reduceMotion ? 1 : boardScale }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:100%_52px]" />
            <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 760 3620">
              <motion.path
                d="M180 215 C555 255 540 380 520 455 C245 530 210 650 180 785 C560 845 525 1000 500 1080 C230 1160 220 1300 185 1410 C560 1495 525 1620 500 1710 C230 1815 215 1960 185 2070 C560 2160 530 2300 500 2395 C240 2490 210 2620 180 2735 C560 2825 525 2980 500 3085 C390 3190 320 3290 310 3460"
                fill="none"
                stroke="#9ca3af"
                strokeDasharray="10 17"
                strokeLinecap="round"
                strokeWidth="2"
                style={{ pathLength: reduceMotion ? 1 : lineProgress }}
              />
            </svg>

            {serviceCatalog.map((service, index) => (
              <PinnedServiceCard
                key={service.title}
                active={active === index}
                index={index}
                position={boardPositions[index]}
                service={service}
              />
            ))}

            <div className="absolute bottom-10 left-1/2 w-[340px] -translate-x-1/2 rounded-3xl border border-orange-100 bg-white/86 px-6 py-5 text-center shadow-[0_18px_60px_-42px_rgba(15,23,42,0.5)] backdrop-blur">
              <p className="font-display text-2xl font-semibold text-ink">
                Your all-in-one growth partner.
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                The final package is selected after we study your business.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-5 lg:hidden">
            {serviceCatalog.map((service, index) => (
              <MobileServiceCard key={service.title} index={index} service={service} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function PinnedServiceCard({
  active,
  index,
  position,
  service,
}: {
  active: boolean;
  index: number;
  position: (typeof boardPositions)[number];
  service: CatalogGroup;
}) {
  return (
    <motion.article
      className="absolute w-[310px] rounded-[1.45rem] bg-white p-5 shadow-[0_26px_70px_-48px_rgba(15,23,42,0.65)]"
      style={{
        left: position.left,
        rotate: position.rotate,
        top: position.top,
      }}
      animate={{
        opacity: active ? 1 : 0.88,
        scale: active ? 1.06 : 0.96,
        y: active ? -8 : 8,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={cn("absolute left-1/2 top-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white", pinClasses[service.tone])} />
      <div className={cn("rounded-[1rem] border p-5", toneClasses[service.tone])}>
        <p className="font-display text-3xl font-medium">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink">
          {service.title}
        </h3>
        <ul className="mt-4 space-y-2">
          {service.items.slice(0, 4).map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-5 text-ink-muted">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-current" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function MobileServiceCard({ index, service }: { index: number; service: CatalogGroup }) {
  return (
    <article className="rounded-[1.35rem] border border-orange-100 bg-white p-5 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
          {service.title}
        </h3>
        <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", toneClasses[service.tone])}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {service.items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-ink-muted">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
