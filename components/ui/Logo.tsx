import Link from "next/link";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/data/site";

/* Sprynt40 lockup: north-east growth arrow mark + bold wordmark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <path
        fill="var(--accent)"
        d="M3 3h26v26h-9.8V16.7L8.8 27.1 3 21.3l10.4-10.4H3z"
      />
    </svg>
  );
}

export function Logo({
  className,
  onClick,
  withTagline,
}: {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  withTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
    >
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-xl font-black tracking-normal text-ink sm:text-2xl">
          {site.name}
        </span>
        {withTagline && (
          <span className="mt-1 block text-xs font-medium text-ink-muted">
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
