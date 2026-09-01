"use client";

import { useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { hasWhatsApp, waLink } from "@/lib/data/site";

const blastStops = [
  {
    label: "01",
    eyebrow: "Who we are",
    title: "A digital growth team built around signal, not noise.",
    body: "Sprynt40 connects strategy, content, websites, paid media and reporting so every marketing move has a reason.",
    points: ["Strategy-first planning", "Creative production", "Performance review"],
    side: "right",
    accent: "orange",
  },
  {
    label: "02",
    eyebrow: "Mission",
    title: "Make growth decisions visible before budgets move.",
    body: "We define the audience, offer, funnel and weekly metric first. Then campaigns launch with clarity instead of guesswork.",
    points: ["Clear offer", "Tracked funnel", "Weekly decisions"],
    side: "left",
    accent: "cyan",
  },
  {
    label: "03",
    eyebrow: "Vision",
    title: "Help ambitious brands become impossible to ignore.",
    body: "Our vision is a marketing system where brand, demand and analytics work together until growth becomes repeatable.",
    points: ["Louder brand recall", "Better-quality enquiries", "Compounding learning"],
    side: "right",
    accent: "violet",
  },
] as const;

const dashboardStats = [
  ["Service groups", "15", "catalog"],
  ["Delivery window", "4 mo", "planned"],
  ["Package type", "1", "custom"],
] as const;

const particles = Array.from({ length: 28 }, (_, index) => ({
  delay: (index % 7) * 0.18,
  left: `${10 + ((index * 23) % 80)}%`,
  size: 4 + (index % 4) * 2,
  top: `${8 + ((index * 17) % 84)}%`,
}));

const burstRays = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2;
  return {
    delay: (index % 6) * 0.035,
    x: Math.round(Math.cos(angle) * (116 + (index % 3) * 18)),
    y: Math.round(Math.sin(angle) * (116 + (index % 3) * 18)),
  };
});

export function SignalControlRoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 78%", "end 34%"],
  });

  const signalY = useTransform(
    scrollYProgress,
    [0, 0.24, 0.48, 0.72, 1],
    ["7%", "27%", "50%", "73%", "91%"],
  );
  const signalScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.28, 0.44, 0.56, 0.7, 0.82, 1],
    [0.9, 1.55, 0.95, 1.65, 1, 1.75, 1.05, 1.25],
  );
  const beamScale = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const dashboardRise = useTransform(scrollYProgress, [0.72, 1], [70, 0]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.72, 0.88], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value > 0.68) setActive(2);
    else if (value > 0.38) setActive(1);
    else setActive(0);
  });

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      data-about-signal-room
      className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fdff_42%,#fff7ed_100%)] pt-24 sm:pt-28"
    >
      <Container>
        <div className="mx-auto max-w-4xl py-10 text-center sm:py-14">
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-orange-100 bg-white/85 px-4 py-2 text-sm font-semibold uppercase text-orange-600 shadow-[0_16px_40px_-32px_rgba(249,115,22,0.8)]">
            <LogoMark className="size-5" />
            About Sprynt40
          </div>
          <h1 className="mx-auto mt-6 max-w-[19rem] font-display text-4xl font-semibold leading-[1.04] tracking-normal text-ink sm:max-w-none sm:text-6xl lg:text-7xl">
            <span className="block">The Signal</span>
            <span className="block">Blast Journey</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[19rem] text-base leading-7 text-ink-muted sm:max-w-2xl sm:text-lg sm:leading-8">
            One brand signal zooms, bursts and reforms into the story of who
            we are, why we exist and where we take your brand.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="accent">
              Start a growth plan
            </Button>
            <Button
              href={hasWhatsApp ? waLink("Hi! I want to discuss the Sprynt40 growth system.") : "/services"}
              variant={hasWhatsApp ? "whatsapp" : "outline"}
              external={hasWhatsApp}
            >
              {hasWhatsApp ? "Message us" : "View services"}
            </Button>
          </div>
        </div>

        <BlastStage
          active={active}
          beamScale={beamScale}
          dashboardOpacity={dashboardOpacity}
          dashboardRise={dashboardRise}
          reduceMotion={reduceMotion}
          signalScale={signalScale}
          signalY={signalY}
        />
      </Container>
    </section>
  );
}

function BlastStage({
  active,
  beamScale,
  dashboardOpacity,
  dashboardRise,
  reduceMotion,
  signalScale,
  signalY,
}: {
  active: number;
  beamScale: MotionValue<number>;
  dashboardOpacity: MotionValue<number>;
  dashboardRise: MotionValue<number>;
  reduceMotion: boolean | null;
  signalScale: MotionValue<number>;
  signalY: MotionValue<string>;
}) {
  return (
    <div className="relative mx-auto mt-4 max-w-6xl pb-16 sm:pb-20">
      <div className="relative hidden min-h-[1680px] rounded-[2rem] border border-cyan-100 bg-[radial-gradient(circle_at_50%_14%,rgba(249,115,22,0.12),transparent_25%),radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(180deg,#ffffff,rgba(239,251,255,0.92)_54%,#fff7ed)] shadow-[0_40px_120px_-84px_rgba(15,23,42,0.46)] lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute left-1/2 top-16 h-[1320px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-orange-200 to-transparent" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-16 h-[1320px] w-5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-300 via-cyan-300 to-orange-400 opacity-70 blur-sm"
          style={{ scaleY: reduceMotion ? 1 : beamScale }}
        />

        {particles.map((particle, index) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            aria-hidden
            className={cn(
              "absolute rounded-full",
              index % 3 === 0 && "bg-orange-400",
              index % 3 === 1 && "bg-cyan-300",
              index % 3 === 2 && "bg-violet/60",
            )}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.15, 0.72, 0.2], y: [-12, 18, -6] }
            }
            style={{
              height: particle.size,
              left: particle.left,
              top: particle.top,
              width: particle.size,
            }}
            transition={{
              delay: particle.delay,
              duration: 3.2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          />
        ))}

        {[24, 49, 73].map((top, index) => (
          <BlastRing
            key={top}
            active={active === index}
            index={index}
            top={`${top}%`}
          />
        ))}

        <FloatingFragments />

        <motion.div
          aria-hidden
          className="absolute left-1/2 z-50 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[12px] border-white bg-white shadow-[0_0_80px_rgba(249,115,22,0.72)]"
          style={{
            scale: reduceMotion ? 1 : signalScale,
            top: reduceMotion ? "73%" : signalY,
          }}
        >
          <LogoMark className="size-12" />
        </motion.div>

        {blastStops.map((stop, index) => (
          <BlastCard
            key={stop.label}
            active={active === index}
            index={index}
            stop={stop}
          />
        ))}

        <motion.div
          className="absolute bottom-16 left-1/2 z-30 w-[860px] -translate-x-1/2"
          style={{
            opacity: reduceMotion ? 1 : dashboardOpacity,
            y: reduceMotion ? 0 : dashboardRise,
          }}
        >
          <GrowLoudDashboard />
        </motion.div>
      </div>

      <div className="grid gap-5 lg:hidden">
        {blastStops.map((stop, index) => (
          <MobileBlastCard
            key={stop.label}
            active={active === index}
            index={index}
            stop={stop}
          />
        ))}
        <GrowLoudDashboard />
      </div>
    </div>
  );
}

function BlastRing({
  active,
  index,
  top,
}: {
  active: boolean;
  index: number;
  top: string;
}) {
  return (
    <div className="absolute left-1/2 z-20 size-[22rem] -translate-x-1/2 -translate-y-1/2" style={{ top }}>
      <motion.div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-full border",
          index === 0 && "border-orange-200 bg-orange-100/20",
          index === 1 && "border-cyan-200 bg-cyan-100/20",
          index === 2 && "border-violet/20 bg-violet/5",
        )}
        animate={{ opacity: active ? 0.84 : 0.34, scale: active ? 1.12 : 0.88 }}
        transition={{ duration: 0.45 }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-12 rounded-full border border-white/80 bg-white/35 backdrop-blur-sm"
        animate={{ scale: active ? 1.04 : 0.92 }}
        transition={{ duration: 0.45 }}
      />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_54px_rgba(249,115,22,0.9)]"
        animate={{ opacity: active ? 1 : 0.45, scale: active ? 1.5 : 0.9 }}
        transition={{ duration: 0.45 }}
      />
      {burstRays.map((ray, rayIndex) => (
        <motion.span
          key={`${ray.x}-${ray.y}`}
          aria-hidden
          className={cn(
            "absolute left-1/2 top-1/2 block h-1.5 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full",
            rayIndex % 3 === 0 && "bg-orange-400",
            rayIndex % 3 === 1 && "bg-cyan-300",
            rayIndex % 3 === 2 && "bg-violet/60",
          )}
          animate={
            active
              ? {
                  opacity: [0, 0.95, 0],
                  scaleX: [0.4, 1.35, 0.65],
                  x: [0, ray.x],
                  y: [0, ray.y],
                }
              : { opacity: 0, scaleX: 0.2, x: 0, y: 0 }
          }
          transition={{
            delay: ray.delay,
            duration: 0.68,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

function FloatingFragments() {
  return (
    <>
      <FragmentCard className="left-[8%] top-[18%]" label="Discover" value="Market signal" />
      <FragmentCard className="right-[9%] top-[12%]" label="Build" value="Custom package" />
      <FragmentCard className="left-[12%] top-[55%]" label="Connect" value="Channels aligned" />
      <FragmentCard className="right-[13%] top-[64%]" label="Report" value="Monthly clarity" />
    </>
  );
}

function FragmentCard({
  className,
  label,
  value,
}: {
  className: string;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "absolute z-10 rounded-2xl border border-white/80 bg-white/58 px-5 py-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.6)] backdrop-blur",
        className,
      )}
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      <p className="text-xs font-semibold uppercase text-orange-600">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-ink">{value}</p>
    </motion.div>
  );
}

function BlastCard({
  active,
  index,
  stop,
}: {
  active: boolean;
  index: number;
  stop: (typeof blastStops)[number];
}) {
  const sideClass =
    stop.side === "left"
      ? "left-[7%] text-left"
      : "right-[7%] text-left";
  const topClass = ["top-[19%]", "top-[43%]", "top-[66%]"][index];

  return (
    <motion.article
      className={cn(
        "absolute z-40 w-[385px] rounded-3xl border bg-white/84 p-6 shadow-[0_24px_74px_-48px_rgba(15,23,42,0.54)] backdrop-blur-xl",
        active ? activePanelClass[stop.accent] : "border-white/80",
        sideClass,
        topClass,
      )}
      animate={{
        opacity: active ? 1 : 0.82,
        scale: active ? 1.04 : 0.96,
        x: active ? 0 : stop.side === "left" ? 18 : -18,
        y: active ? -10 : 8,
      }}
      transition={{ duration: 0.38 }}
    >
      <BlastCardContent stop={stop} />
    </motion.article>
  );
}

function MobileBlastCard({
  active,
  index,
  stop,
}: {
  active: boolean;
  index: number;
  stop: (typeof blastStops)[number];
}) {
  return (
    <motion.article
      className={cn(
        "relative max-w-full overflow-hidden rounded-3xl border bg-white/88 p-5 shadow-[0_20px_64px_-46px_rgba(15,23,42,0.42)] backdrop-blur",
        active ? activePanelClass[stop.accent] : "border-white/80",
      )}
      animate={{ opacity: active ? 1 : 0.96, y: active ? -3 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <span
        aria-hidden
        className="absolute right-2 top-2 size-20 rounded-full bg-orange-200/25 blur-2xl"
      />
      <span
        aria-hidden
        className="absolute left-6 top-6 size-16 rounded-full border border-orange-100"
      />
      <div className="relative z-10 min-w-0 max-w-full">
        <BlastCardContent stop={stop} />
      </div>
      {index < blastStops.length - 1 && (
        <div className="mx-auto mt-5 h-16 w-1 rounded-full bg-gradient-to-b from-orange-300 via-cyan-300 to-transparent" />
      )}
    </motion.article>
  );
}

function BlastCardContent({ stop }: { stop: (typeof blastStops)[number] }) {
  return (
    <>
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg",
            stop.accent === "orange" && "bg-orange-500 shadow-orange-500/25",
            stop.accent === "cyan" && "bg-cyan-500 shadow-cyan-500/25",
            stop.accent === "violet" && "bg-violet shadow-violet/25",
          )}
        >
          {stop.label}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className={cn("text-xs font-semibold uppercase", panelTextClass[stop.accent])}>
            {stop.eyebrow}
          </p>
          <h2 className="mt-1 max-w-[16rem] break-words font-display text-xl font-semibold leading-tight text-ink sm:max-w-none sm:text-2xl">
            {stop.title}
          </h2>
        </div>
      </div>
      <p className="mt-4 max-w-[18.5rem] break-words text-sm leading-6 text-ink-muted sm:max-w-none">
        {stop.body}
      </p>
      <div className="mt-5 grid gap-2">
        {stop.points.map((point) => (
          <div key={point} className="flex items-center gap-2 text-sm font-medium text-ink">
            <span
              className={cn(
                "size-2 rounded-full",
                stop.accent === "orange" && "bg-orange-500",
                stop.accent === "cyan" && "bg-cyan-500",
                stop.accent === "violet" && "bg-violet",
              )}
            />
            {point}
          </div>
        ))}
      </div>
    </>
  );
}

function GrowLoudDashboard() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white/88 p-5 shadow-[0_32px_100px_-68px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-orange-600">
            Grow Loud System
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Strategy, creative and reporting in one view.
          </h2>
        </div>
        <LogoMark className="size-12" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {dashboardStats.map(([label, value, change]) => (
          <div key={label} className="rounded-2xl border border-line bg-orange-50/45 p-4">
            <p className="text-xs font-semibold uppercase text-ink-muted">
              {label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {value}
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              {change}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-end gap-2">
            {[32, 46, 38, 58, 50, 72, 84].map((height, index) => (
              <span
                key={height}
                className={cn(
                  "block flex-1 rounded-t-lg",
                  index % 2 === 0 ? "bg-orange-400" : "bg-cyan-400",
                )}
                style={{ height }}
              />
            ))}
          </div>
          <div className="mt-4 h-px bg-line" />
          <p className="mt-3 text-sm font-medium text-ink-muted">
            Channel performance improves when every campaign reports to one
            weekly decision.
          </p>
        </div>
        <div className="grid gap-3 rounded-2xl border border-line bg-white p-4">
          {["Campaigns", "SEO", "Social", "Content", "Analytics"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-sm font-medium text-ink">
              <span>{item}</span>
              <span className="text-orange-600">active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const activePanelClass = {
  violet: "border-violet/30 ring-2 ring-violet/10",
  cyan: "border-cyan-300 ring-2 ring-cyan-100",
  orange: "border-orange-300 ring-2 ring-orange-100",
};

const panelTextClass = {
  violet: "text-violet",
  cyan: "text-cyan-700",
  orange: "text-orange-600",
};
