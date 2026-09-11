import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/data/site";

/**
 * Sprynt40 brand lockup — the original `public/logos.jpeg` (1600×1600 with
 * the arrow + wordmark + tagline centered on a black ground). Rendered at
 * a 4:1 aspect with `object-cover`, so the visible frame lands on the
 * logo band and the surrounding black reads as an intentional badge.
 */
export function Logo({
  className,
  onClick,
  withTagline = true,
}: {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  /** kept for API compatibility; tagline is baked into the lockup asset. */
  withTagline?: boolean;
}) {
  void withTagline;

  return (
    <Link
      href="/"
      aria-label={`${site.name} — ${site.tagline}`}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
    >
      <Image
        src="/logos.jpeg"
        alt={`${site.name} — ${site.tagline}`}
        width={1600}
        height={1600}
        priority
        sizes="(max-width: 640px) 144px, 192px"
        className="block h-9 w-36 rounded-md object-cover object-center sm:h-12 sm:w-48"
      />
    </Link>
  );
}
