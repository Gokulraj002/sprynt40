"use client";

import { motion, useReducedMotion } from "motion/react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { hasWhatsApp, waLink } from "@/lib/data/site";
import { cn } from "@/lib/cn";
import { maskUp, staggerParent, fadeUp, viewportOnce } from "@/lib/motion";

/*
  The site's signature closer — reused above the footer on every route.
  Headline words are server-rendered content (plain strings baked into JSX,
  not fetched/computed client-side); this file is "use client" only because
  the mask-reveal + waveform need scroll/viewport + reduced-motion state.
*/

const HEADLINE: { text: string; emphasis?: boolean }[] = [
  { text: "Ready" },
  { text: "when" },
  { text: "the" },
  { text: "noise", emphasis: true },
  { text: "isn't." },
];

/** overflow-hidden clip + translateY mask, one word per span, staggered by the parent. */
function MaskWord({ text, emphasis }: { text: string; emphasis?: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-top">
      <motion.span
        variants={maskUp}
        className={cn("inline-block", emphasis && "italic text-accent")}
      >
        {text}
      </motion.span>
    </span>
  );
}

function RevealHeadline() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.h2
      variants={staggerParent}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="text-balance font-display text-hero font-medium text-ink"
    >
      {HEADLINE.map((word, i) => (
        <span key={word.text}>
          <MaskWord text={word.text} emphasis={word.emphasis} />
          {i < HEADLINE.length - 1 ? " " : null}
        </span>
      ))}
    </motion.h2>
  );
}

/** Faint horizontal signal line — subtle sine undulation, transform-only, hidden under reduced motion. */
function SignalWaveform() {
  const wave =
    "M0 20 Q25 4 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20";

  return (
    <div
      aria-hidden
      className="pointer-events-none mt-10 hidden h-8 w-full max-w-xl overflow-hidden opacity-40 [contain:paint] motion-reduce:hidden sm:mt-12 md:block lg:mt-14"
    >
      <div className="signal-wave flex h-full w-[200%]">
        <svg className="h-full w-1/2 text-ink-muted" viewBox="0 0 400 40" preserveAspectRatio="none">
          <path d={wave} stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="h-full w-1/2 text-ink-muted" viewBox="0 0 400 40" preserveAspectRatio="none">
          <path d={wave} stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <style>{`
        .signal-wave { animation: signal-drift 14s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .signal-wave { animation: none; }
        }
        @keyframes signal-drift {
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

export function BigCta() {
  return (
    <Section
      theme="light"
      className="overflow-hidden bg-[linear-gradient(135deg,#f5f3ff_0%,#ecfeff_48%,#fff7ed_100%)] py-20 sm:py-28 lg:py-36"
    >
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/70 p-8 shadow-[0_28px_90px_-45px_rgba(76,29,149,0.48)] backdrop-blur sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="relative max-w-4xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-label font-sans uppercase text-violet"
          >
            Next step
          </motion.p>

          <div className="mt-5">
            <RevealHeadline />
          </div>

          <SignalWaveform />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-12 flex flex-wrap items-center gap-4 lg:mt-16"
          >
            <Button variant="accent" href="/contact">
              Get your growth plan
            </Button>
            <Button
              variant={hasWhatsApp ? "whatsapp" : "outline"}
              href={hasWhatsApp ? waLink("Hi! I'd like a growth plan.") : "/services"}
              external={hasWhatsApp}
              className={hasWhatsApp ? undefined : "bg-white/70"}
            >
              {hasWhatsApp ? "WhatsApp us" : "View services"}
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-5 text-sm text-ink-muted"
          >
            No pitch. 30 useful minutes.
          </motion.p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
