"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function HomeCta() {
  return (
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
  );
}
