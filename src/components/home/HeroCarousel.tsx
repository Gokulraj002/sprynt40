"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

const ROTATE_MS = 6500;

const signals = [
  { value: "Strategy", label: "Clear direction around your goal" },
  { value: "Creative", label: "Work designed to earn attention" },
  { value: "Performance", label: "Decisions guided by real signals" },
];

const slides = [
  {
    image: "/images/home/carousel/agency-strategy.png",
    eyebrow: "Full-service digital growth agency",
    title: "Make your brand impossible to overlook.",
    lead: "We combine strategy, design, websites and content into a distinctive digital presence built to attract the right audience.",
    services: ["Brand strategy", "Web & CRO", "Content systems"],
  },
  {
    image: "/images/home/carousel/performance-review.png",
    eyebrow: "Marketing connected to business outcomes",
    title: "Turn attention into measurable growth.",
    lead: "Search, paid media and reporting work together so you can see what creates demand, improve what converts and scale with confidence.",
    services: ["Paid media", "SEO & local", "Revenue reporting"],
  },
  {
    image: "/images/home/carousel/creative-launch.png",
    eyebrow: "Your extended digital team",
    title: "Every channel. One clear growth direction.",
    lead: "From the first campaign to CRM follow-up and retention, one team keeps the customer journey connected and moving forward.",
    services: ["CRM journeys", "Automation", "Retention"],
  },
] as const;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Stop the timer when the hero is scrolled away or the tab is hidden —
  // each tick repaints a full-bleed image, so running it unseen is pure cost.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(node);

    const onVisibility = () => setOnScreen(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    // Auto-rotation is motion the visitor did not ask for, so honour the
    // reduced-motion preference and leave them on the first slide.
    if (paused || !onScreen || reduceMotion) return;
    const interval = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(interval);
  }, [paused, onScreen, reduceMotion]);

  const show = (index: number) => setActive((index + slides.length) % slides.length);
  const slide = slides[active];

  return (
    <>
      <DesktopCommandHero />

      <Section
        ref={sectionRef}
        id="hero-mobile"
        theme="dark"
        aria-roledescription="carousel"
        aria-label="Sprynt40 agency highlights"
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="flex h-[780px] overflow-hidden bg-black pt-20 pb-8 sm:h-[840px] sm:pt-24 sm:pb-10 md:hidden"
      >
        {slides.map((item, index) => (
          <motion.div
            key={item.image}
            aria-hidden={active !== index}
            initial={false}
            animate={{ opacity: active === index ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="pointer-events-none absolute inset-0"
            style={{ willChange: "opacity" }}
          >
            <Image
              src={item.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[68%_center] sm:object-center"
            />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_34%,rgba(0,0,0,0.3)_68%,rgba(0,0,0,0.16)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.04)_45%,rgba(0,0,0,0.82)_100%)]" />

        <Container className="relative z-10 flex flex-1 flex-col">
          <div className="flex flex-1 flex-col justify-between">
            <div
              key={active}
              role="group"
              aria-roledescription="slide"
              aria-label={`${active + 1} of ${slides.length}`}
              className="max-w-[22rem] pt-7 sm:max-w-2xl sm:pt-10"
            >
              <p className="inline-flex rounded-full border border-white/18 bg-black/25 px-4 py-2 text-xs font-semibold uppercase text-white/90 shadow-sm backdrop-blur-md sm:text-sm">
                {slide.eyebrow}
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.2rem,5.7vw,4.7rem)] font-semibold leading-[1.02] tracking-normal text-white text-balance">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-[21rem] text-base leading-7 text-white/76 sm:max-w-xl sm:text-lg sm:leading-8">
                {slide.lead}
              </p>
              <div className="mt-6 flex w-full max-w-[21rem] flex-col gap-3 sm:max-w-none sm:flex-row">
                <Button href="/contact" variant="accent" className="w-full px-7 sm:w-auto">Build my growth plan</Button>
                <Button href={hasWhatsApp ? waLink("Hi! I want to build a growth plan.") : "/services"} variant="outline" external={hasWhatsApp} className="w-full border-white/25 bg-white/10 px-7 text-white backdrop-blur hover:border-white/60 sm:w-auto">
                  {hasWhatsApp ? "Talk on WhatsApp" : "Explore services"}
                </Button>
              </div>
            </div>
            <div className="w-full">
              <CarouselControls active={active} onShow={show} />
              <div className="hidden grid-cols-3 overflow-hidden rounded-full border border-white/15 bg-black/30 text-white backdrop-blur sm:grid sm:max-w-3xl">
                {signals.map((item) => <div key={item.label} className="border-l border-white/15 px-6 py-4 first:border-l-0"><p className="font-display text-3xl font-semibold">{item.value}</p><p className="mt-1 text-sm text-white/65">{item.label}</p></div>)}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function DesktopCommandHero() {
  const desktopSignals = [
    { value: "14 days", label: "campaign launch window" },
    { value: "1 metric", label: "weekly decision focus" },
    { value: "12+", label: "creative tests every month" },
  ];

  return (
    <Section id="hero" theme="dark" className="hidden min-h-svh overflow-hidden pt-24 pb-8 md:flex lg:pt-[7.5rem]">
      <Image
        src="/images/home/hero-command-wall.png"
        alt="A classical strategist using a laptop inside a panoramic digital marketing command centre"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center saturate-[0.88] hue-rotate-[105deg]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.48)_0%,rgba(10,8,5,0.2)_35%,rgba(10,8,5,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.28),transparent_28%)]" />

      <Container className="relative z-10 flex flex-1 flex-col">
        <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-between text-center">
          <div className="pt-4 sm:pt-8">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
              Digital growth engineered with AI clarity
            </p>
            <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(4rem,7.2vw,6.7rem)] font-semibold leading-[0.98] tracking-normal text-white text-balance">
              Being visible is not enough. Be measurable.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-white/72">
              Sprynt40 builds digital marketing systems where creative, websites, ads and analytics
              work together to turn attention into qualified growth.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Button href="/contact" variant="accent" className="px-7">Build my growth plan</Button>
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

          <div className="w-full pb-6">
            <div className="mx-auto grid max-w-3xl grid-cols-3 overflow-hidden rounded-full border border-white/15 bg-white/10 text-white shadow-[0_24px_90px_-40px_rgba(249,115,22,0.78)] backdrop-blur-md">
              {desktopSignals.map((item) => (
                <div key={item.value} className="border-l border-white/15 px-6 py-4 first:border-l-0">
                  <p className="font-display text-3xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-sm text-white/65">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function CarouselControls({
  active,
  onShow,
}: {
  active: number;
  onShow: (index: number) => void;
}) {
  const arrow =
    "grid size-10 place-items-center rounded-full border border-white/20 bg-black/25 text-xl text-white backdrop-blur transition-colors hover:border-white/55 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div className="mb-4 flex w-full max-w-3xl items-center justify-between gap-4">
      <div className="flex items-center gap-2" role="tablist" aria-label="Choose carousel slide">
        {slides.map((item, index) => (
          <button
            key={item.image}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
            onClick={() => onShow(index)}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
              active === index ? "w-10 bg-accent" : "w-5 bg-white/35 hover:bg-white/70",
            )}
          />
        ))}
      </div>

      <div className="hidden gap-2 sm:flex">
        <button type="button" aria-label="Previous carousel slide" onClick={() => onShow(active - 1)} className={arrow}>
          <span aria-hidden="true">‹</span>
        </button>
        <button type="button" aria-label="Next carousel slide" onClick={() => onShow(active + 1)} className={arrow}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
