"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Em } from "@/components/ui/SectionHeading";

/** Root error boundary. Dark, cinematic, on-brand — not a stock crash page. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const buttonBase =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-[filter,opacity,border-color,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div
      data-theme="light"
      className="relative flex min-h-dvh flex-col items-center justify-center bg-[linear-gradient(135deg,#f5f3ff_0%,#ecfeff_55%,#fff7ed_100%)] text-center"
    >
      <Container>
        <p className="text-label font-sans uppercase text-ink-muted">Error</p>
        <h1 className="mt-4 font-display text-display font-medium text-balance">
          <Em>Signal</Em> lost.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lead text-ink-muted">
          Something broke on our end — it&rsquo;s not you.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className={cn(
              buttonBase,
              "bg-accent text-accent-ink hover:brightness-105 active:brightness-95",
            )}
          >
            Try again
          </button>
          <Link
            href="/"
            className={cn(buttonBase, "border border-line text-ink hover:border-ink/50")}
          >
            Back home
          </Link>
        </div>
      </Container>
    </div>
  );
}
