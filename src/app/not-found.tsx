import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Em } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Global App Router 404. Renders inside the root layout's fixed Header /
 * Footer chrome, so min-h-svh here fills the true viewport for a full-bleed,
 * centered moment rather than a cramped inline error.
 */
export default function NotFound() {
  return (
    <Section
      theme="light"
      className="flex min-h-svh items-center bg-[linear-gradient(135deg,#fff8ef_0%,#ecfeff_55%,#fff7ed_100%)] pt-32 pb-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-hero font-medium text-ink-muted/30">
            404
          </p>
          <h1 className="mt-4 font-display text-display font-medium text-balance">
            Lost in the <Em>noise</Em>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lead text-ink-muted">
            This page doesn&apos;t exist — but your growth plan can.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" variant="accent">
              Back to signal
            </Button>
            <Button href="/contact" variant="outline">
              Talk to us
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
